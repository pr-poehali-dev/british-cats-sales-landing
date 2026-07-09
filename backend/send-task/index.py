import json
import os
import urllib.request
import urllib.error


def _cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
        'Access-Control-Max-Age': '86400',
        'Content-Type': 'application/json',
    }


def _resp(status, body):
    return {'statusCode': status, 'headers': _cors_headers(), 'body': json.dumps(body, ensure_ascii=False), 'isBase64Encoded': False}


def _send_telegram(token, chat_id, text):
    url = f'https://api.telegram.org/bot{token}/sendMessage'
    payload = json.dumps({'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


def _send_max(token, chat_id, text):
    url = f'https://botapi.max.ru/messages?access_token={token}'
    payload = json.dumps({'chat_id': chat_id, 'text': text}).encode('utf-8')
    req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read())


CHANNEL_CONFIG = {
    'telegram': {'secret': 'TELEGRAM_BOT_TOKEN', 'sender': _send_telegram, 'label': 'Telegram'},
    'max': {'secret': 'MAX_BOT_TOKEN', 'sender': _send_max, 'label': 'MAX'},
}


def handler(event: dict, context) -> dict:
    '''Отправка задачи менеджеру в мессенджер.
    Принимает канал, контакт менеджера и текст задачи, доставляет через бота.
    Требует секрет с токеном бота для выбранного канала (например TELEGRAM_BOT_TOKEN).'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    if method == 'GET':
        ready = {ch: bool(os.environ.get(cfg['secret'])) for ch, cfg in CHANNEL_CONFIG.items()}
        return _resp(200, {'service': 'send-task', 'channelsReady': ready})

    if method != 'POST':
        return _resp(405, {'error': 'Метод не поддерживается'})

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return _resp(400, {'error': 'Некорректный JSON'})

    channel = (body.get('channel') or '').strip()
    contact = (body.get('contact') or '').strip()
    text = (body.get('text') or '').strip()

    if not channel or not contact or not text:
        return _resp(400, {'error': 'Нужны поля channel, contact и text'})

    cfg = CHANNEL_CONFIG.get(channel)
    if not cfg:
        return _resp(400, {
            'error': f'Канал «{channel}» пока не поддерживается для отправки',
            'detail': 'Доступны: Telegram, MAX. Остальные подключим по мере готовности их API.',
        })

    token = os.environ.get(cfg['secret'])
    if not token:
        return _resp(503, {
            'error': f'Бот {cfg["label"]} не подключён',
            'detail': f'Добавьте секрет {cfg["secret"]} с токеном бота, чтобы отправлять задачи в {cfg["label"]}.',
        })

    try:
        result = cfg['sender'](token, contact, text)
    except urllib.error.HTTPError as e:
        return _resp(502, {'error': f'Ошибка отправки в {cfg["label"]}', 'detail': e.read().decode('utf-8', 'ignore')})
    except urllib.error.URLError as e:
        return _resp(502, {'error': f'Не удалось связаться с {cfg["label"]}', 'detail': str(e)})

    return _resp(200, {'ok': True, 'channel': channel, 'result': result})
