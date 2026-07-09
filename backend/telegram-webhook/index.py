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
    return {'statusCode': status, 'headers': _cors(), 'body': json.dumps(body, ensure_ascii=False), 'isBase64Encoded': False}


def _db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def _esc(s):
    return str(s).replace("'", "''")


def handler(event: dict, context) -> dict:
    '''Webhook Telegram: принимает входящие сообщения от клиентов и сохраняет их в базу.
    GET с ?action=setup — регистрирует webhook на этот адрес.
    GET с ?action=status — показывает статус подключения бота.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors(), 'body': ''}

    token = os.environ.get('TELEGRAM_BOT_TOKEN')

    if method == 'GET':
        params = event.get('queryStringParameters') or {}
        action = params.get('action', 'status')

        if not token:
            return _resp(503, {'error': 'Не задан TELEGRAM_BOT_TOKEN'})

        if action == 'setup':
            self_url = params.get('url', '').strip()
            if not self_url:
                return _resp(400, {'error': 'Укажите ?url= адрес этой функции'})
            api = f'https://api.telegram.org/bot{token}/setWebhook?url={self_url}'
            try:
                with urllib.request.urlopen(api, timeout=15) as r:
                    res = json.loads(r.read())
                return _resp(200, {'setup': True, 'telegram': res})
            except urllib.error.URLError as e:
                return _resp(502, {'error': 'Не удалось установить webhook', 'detail': str(e)})

        try:
            with urllib.request.urlopen(f'https://api.telegram.org/bot{token}/getMe', timeout=15) as r:
                me = json.loads(r.read())
            with urllib.request.urlopen(f'https://api.telegram.org/bot{token}/getWebhookInfo', timeout=15) as r:
                wh = json.loads(r.read())
            return _resp(200, {'connected': True, 'bot': me.get('result', {}), 'webhook': wh.get('result', {})})
        except urllib.error.URLError as e:
            return _resp(502, {'error': 'Ошибка связи с Telegram', 'detail': str(e)})

    try:
        update = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return _resp(200, {'ok': True})

    msg = update.get('message') or update.get('edited_message')
    if not msg:
        return _resp(200, {'ok': True})

    chat = msg.get('chat', {})
    chat_id = chat.get('id')
    if chat_id is None:
        return _resp(200, {'ok': True})

    name = (chat.get('first_name', '') + ' ' + chat.get('last_name', '')).strip() or chat.get('title', '') or 'Гость'
    username = chat.get('username', '')
    text = msg.get('text', '') or msg.get('caption', '') or ('[вложение]' if msg.get('document') or msg.get('photo') else '')

    conn = _db()
    try:
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO tg_dialogs (chat_id, name, username, unread, last_message_at) "
            f"VALUES ({int(chat_id)}, '{_esc(name)}', '{_esc(username)}', 1, now()) "
            f"ON CONFLICT (chat_id) DO UPDATE SET unread = tg_dialogs.unread + 1, "
            f"name = '{_esc(name)}', username = '{_esc(username)}', last_message_at = now()"
        )
        cur.execute(
            f"INSERT INTO tg_messages (chat_id, direction, text) "
            f"VALUES ({int(chat_id)}, 'in', '{_esc(text)}')"
        )
        conn.commit()
    finally:
        conn.close()

    return _resp(200, {'ok': True})
