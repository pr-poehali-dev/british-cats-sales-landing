import json
import os
import urllib.request
import urllib.error
import psycopg2


def _cors():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body, ensure_ascii=False, default=str), 'isBase64Encoded': False}


def _db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _esc(s):
    return str(s).replace("'", "''")


def handler(event: dict, context) -> dict:
    '''Чат Telegram для CRM: GET — список диалогов и сообщений, POST — отправка ответа клиенту.
    Хранит переписку в базе, отправляет ответы через Telegram Bot API.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        chat_id = params.get('chatId')
        conn = _db()
        try:
            cur = conn.cursor()
            if chat_id:
                cur.execute(
                    f"SELECT id, direction, text, file_name, created_at FROM tg_messages "
                    f"WHERE chat_id = {int(chat_id)} ORDER BY created_at ASC LIMIT 200"
                )
                rows = cur.fetchall()
                cur.execute(f"UPDATE tg_dialogs SET unread = 0 WHERE chat_id = {int(chat_id)}")
                conn.commit()
                messages = [{'id': r[0], 'direction': r[1], 'text': r[2], 'fileName': r[3], 'at': r[4]} for r in rows]
                return _resp(200, {'messages': messages})

            cur.execute(
                "SELECT chat_id, name, username, unread, last_message_at FROM tg_dialogs "
                "ORDER BY last_message_at DESC LIMIT 100"
            )
            rows = cur.fetchall()
            dialogs = [{'chatId': r[0], 'name': r[1], 'username': r[2], 'unread': r[3], 'lastAt': r[4]} for r in rows]
            return _resp(200, {'dialogs': dialogs})
        finally:
            conn.close()

    if method != 'POST':
        return _resp(405, {'error': 'Метод не поддерживается'})

    token = os.environ.get('TELEGRAM_BOT_TOKEN')
    if not token:
        return _resp(503, {'error': 'Бот не подключён', 'detail': 'Добавьте TELEGRAM_BOT_TOKEN'})

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return _resp(400, {'error': 'Некорректный JSON'})

    chat_id = body.get('chatId')
    text = (body.get('text') or '').strip()
    if not chat_id or not text:
        return _resp(400, {'error': 'Нужны chatId и text'})

    api = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({'chat_id': chat_id, 'text': text}).encode('utf-8')
    req = urllib.request.Request(api, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            tg = json.loads(r.read())
    except urllib.error.HTTPError as e:
        return _resp(502, {'error': 'Ошибка отправки', 'detail': e.read().decode('utf-8', 'ignore')})
    except urllib.error.URLError as e:
        return _resp(502, {'error': 'Нет связи с Telegram', 'detail': str(e)})

    conn = _db()
    try:
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO tg_messages (chat_id, direction, text) VALUES ({int(chat_id)}, 'out', '{_esc(text)}')"
        )
        cur.execute(f"UPDATE tg_dialogs SET last_message_at = now() WHERE chat_id = {int(chat_id)}")
        conn.commit()
    finally:
        conn.close()

    return _resp(200, {'ok': True, 'telegram': tg})
