import json
import os
import base64
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


def handler(event: dict, context) -> dict:
    '''Транскрибация телефонных звонков через Yandex SpeechKit.
    Принимает ссылку на аудиозапись, распознаёт речь и возвращает текст.
    Требует секреты YANDEX_API_KEY и YANDEX_FOLDER_ID.'''
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': _cors_headers(), 'body': ''}

    api_key = os.environ.get('YANDEX_API_KEY')
    folder_id = os.environ.get('YANDEX_FOLDER_ID')

    if method == 'GET':
        return _resp(200, {
            'service': 'transcribe',
            'ready': bool(api_key and folder_id),
            'message': 'Готово к работе' if (api_key and folder_id) else 'Добавьте секреты YANDEX_API_KEY и YANDEX_FOLDER_ID',
        })

    if method != 'POST':
        return _resp(405, {'error': 'Метод не поддерживается'})

    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return _resp(400, {'error': 'Некорректный JSON'})

    audio_url = body.get('audioUrl', '').strip()
    if not audio_url:
        return _resp(400, {'error': 'Не указана ссылка на запись (audioUrl)'})

    if not api_key or not folder_id:
        return _resp(503, {
            'error': 'Транскрибация не настроена',
            'detail': 'Нужно добавить секреты YANDEX_API_KEY и YANDEX_FOLDER_ID в настройках проекта, а также подключить API МегаФона для доступа к записям.',
        })

    try:
        req = urllib.request.Request(audio_url, headers={'User-Agent': 'khakni-crm'})
        with urllib.request.urlopen(req, timeout=25) as r:
            audio_data = r.read()
    except (urllib.error.URLError, ValueError) as e:
        return _resp(502, {'error': 'Не удалось скачать запись', 'detail': str(e)})

    stt_url = 'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize'
    params = f'?topic=general&folderId={folder_id}&lang=ru-RU'
    try:
        stt_req = urllib.request.Request(
            stt_url + params,
            data=audio_data,
            headers={'Authorization': f'Api-Key {api_key}', 'Content-Type': 'application/octet-stream'},
            method='POST',
        )
        with urllib.request.urlopen(stt_req, timeout=30) as r:
            result = json.loads(r.read())
        text = result.get('result', '')
    except urllib.error.HTTPError as e:
        return _resp(502, {'error': 'Ошибка SpeechKit', 'detail': e.read().decode('utf-8', 'ignore')})
    except urllib.error.URLError as e:
        return _resp(502, {'error': 'Ошибка соединения с SpeechKit', 'detail': str(e)})

    return _resp(200, {'transcript': text or '(речь не распознана)'})
