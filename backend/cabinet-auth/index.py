import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

import psycopg2
from psycopg2.extras import RealDictCursor

SESSION_DAYS = 30
MAX_ATTEMPTS = 8
ATTEMPT_WINDOW_MIN = 15

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Cabinet-Token',
    'Access-Control-Max-Age': '86400',
}


def db():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_value(raw: str) -> str:
    salt = os.environ.get('CABINET_SALT', 'hakni-neuro-salt')
    return hashlib.sha256((salt + raw).encode('utf-8')).hexdigest()


def resp(status: int, body: Dict[str, Any]) -> Dict[str, Any]:
    return {
        'statusCode': status,
        'headers': {**CORS, 'Content-Type': 'application/json'},
        'isBase64Encoded': False,
        'body': json.dumps(body, ensure_ascii=False, default=str),
    }


def client_ip(event: Dict[str, Any]) -> str:
    ctx = event.get('requestContext') or {}
    ident = ctx.get('identity') or {}
    return str(ident.get('sourceIp') or 'unknown')[:64]


def get_token(event: Dict[str, Any]) -> Optional[str]:
    headers = event.get('headers') or {}
    for key in ('X-Cabinet-Token', 'x-cabinet-token', 'X-Auth-Token', 'x-auth-token'):
        if headers.get(key):
            return headers[key]
    return None


def load_session(cur, token: str) -> Optional[Dict[str, Any]]:
    cur.execute(
        """
        SELECT s.id, s.access_code_id, s.role, s.expires_at,
               ac.status AS code_status, ac.group_name, ac.course_name, ac.period,
               p.id AS profile_id, p.first_name, p.last_name
        FROM sessions s
        JOIN access_codes ac ON ac.id = s.access_code_id
        LEFT JOIN student_profiles p ON p.access_code_id = ac.id
        WHERE s.token_hash = %s
        """,
        (hash_value(token),),
    )
    row = cur.fetchone()
    if not row:
        return None
    if row['expires_at'] < datetime.utcnow():
        return None
    if row['code_status'] == 'disabled':
        return None
    return dict(row)


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Авторизация в личном кабинете: вход по персональному коду, проверка сессии, выход"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'me')

    conn = db()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if action == 'login' and method == 'POST':
                return do_login(conn, cur, event)
            if action == 'me':
                return do_me(cur, event)
            if action == 'logout' and method == 'POST':
                return do_logout(conn, cur, event)
        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        conn.close()


def do_login(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body') or '{}')
    code = str(body.get('code', '')).strip()
    ip = client_ip(event)

    since = datetime.utcnow() - timedelta(minutes=ATTEMPT_WINDOW_MIN)
    cur.execute(
        "SELECT COUNT(*) AS c FROM login_attempts WHERE ip = %s AND success = false AND created_at > %s",
        (ip, since),
    )
    if cur.fetchone()['c'] >= MAX_ATTEMPTS:
        return resp(429, {'error': 'Слишком много попыток входа. Попробуйте через 15 минут.'})

    if not code:
        return resp(400, {'error': 'Введите персональный пароль'})

    cur.execute(
        "SELECT id, role, status, group_name, course_name, period FROM access_codes WHERE code_hash = %s",
        (hash_value(code),),
    )
    row = cur.fetchone()

    if not row or row['status'] == 'disabled':
        cur.execute("INSERT INTO login_attempts (ip, success) VALUES (%s, false)", (ip,))
        conn.commit()
        return resp(401, {'error': 'Неверный пароль или доступ отключён'})

    code_id = row['id']
    role = row['role']

    if row['status'] == 'new':
        cur.execute(
            "UPDATE access_codes SET status = 'activated', activated_at = NOW() WHERE id = %s",
            (code_id,),
        )

    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(days=SESSION_DAYS)
    cur.execute(
        "INSERT INTO sessions (token_hash, access_code_id, role, expires_at) VALUES (%s, %s, %s, %s)",
        (hash_value(token), code_id, role, expires),
    )
    cur.execute("INSERT INTO login_attempts (ip, success) VALUES (%s, true)", (ip,))
    cur.execute("DELETE FROM sessions WHERE expires_at < NOW()")

    cur.execute("SELECT id FROM student_profiles WHERE access_code_id = %s", (code_id,))
    profile = cur.fetchone()
    conn.commit()

    return resp(200, {
        'token': token,
        'role': role,
        'has_profile': bool(profile),
        'group_name': row['group_name'],
        'course_name': row['course_name'],
        'period': row['period'],
    })


def do_me(cur, event: Dict[str, Any]) -> Dict[str, Any]:
    token = get_token(event)
    if not token:
        return resp(401, {'error': 'Не авторизован'})
    sess = load_session(cur, token)
    if not sess:
        return resp(401, {'error': 'Сессия истекла'})

    profile = None
    if sess.get('profile_id'):
        cur.execute(
            """
            SELECT id, first_name, last_name, phone, email, city, industry,
                   profession, employment_type, consent_accepted_at
            FROM student_profiles WHERE id = %s
            """,
            (sess['profile_id'],),
        )
        found = cur.fetchone()
        profile = dict(found) if found else None

    return resp(200, {
        'role': sess['role'],
        'has_profile': profile is not None,
        'profile': profile,
        'group_name': sess.get('group_name'),
        'course_name': sess.get('course_name'),
        'period': sess.get('period'),
    })


def do_logout(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    token = get_token(event)
    if token:
        cur.execute("DELETE FROM sessions WHERE token_hash = %s", (hash_value(token),))
        conn.commit()
    return resp(200, {'ok': True})
