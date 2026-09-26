import json
import os
import hashlib
import secrets
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

import psycopg2
from psycopg2.extras import RealDictCursor

SESSION_DAYS = 30
MAX_ATTEMPTS = 10
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


def throttled(cur, ip: str) -> bool:
    since = datetime.utcnow() - timedelta(minutes=ATTEMPT_WINDOW_MIN)
    cur.execute(
        "SELECT COUNT(*) AS c FROM login_attempts WHERE ip = %s AND success = false AND created_at > %s",
        (ip, since),
    )
    return cur.fetchone()['c'] >= MAX_ATTEMPTS


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Авторизация в кабинете: пароль группы, затем личный PIN ученика. Админ входит одним паролем"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'me')

    conn = db()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if action == 'check-code' and method == 'POST':
                return check_code(conn, cur, event)
            if action == 'login-pin' and method == 'POST':
                return login_pin(conn, cur, event)
            if action == 'me':
                return do_me(cur, event)
            if action == 'logout' and method == 'POST':
                return do_logout(conn, cur, event)
        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        conn.close()


def issue_session(conn, cur, code_id: int, role: str, profile_id: Optional[int]) -> str:
    token = secrets.token_urlsafe(32)
    expires = datetime.utcnow() + timedelta(days=SESSION_DAYS)
    cur.execute(
        """
        INSERT INTO sessions (token_hash, access_code_id, role, student_profile_id, expires_at)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (hash_value(token), code_id, role, profile_id, expires),
    )
    cur.execute("DELETE FROM sessions WHERE expires_at < NOW()")
    conn.commit()
    return token


def check_code(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body') or '{}')
    code = str(body.get('code', '')).strip()
    ip = client_ip(event)

    if throttled(cur, ip):
        return resp(429, {'error': 'Слишком много попыток входа. Попробуйте через 15 минут.'})
    if not code:
        return resp(400, {'error': 'Введите пароль'})

    cur.execute(
        """
        SELECT id, role, status, group_name, course_name, period, is_group, max_students
        FROM access_codes WHERE code_hash = %s
        """,
        (hash_value(code),),
    )
    row = cur.fetchone()

    if not row or row['status'] == 'disabled':
        cur.execute("INSERT INTO login_attempts (ip, success) VALUES (%s, false)", (ip,))
        conn.commit()
        return resp(401, {'error': 'Неверный пароль или доступ закрыт'})

    code_id = row['id']
    if row['status'] == 'new':
        cur.execute(
            "UPDATE access_codes SET status = 'activated', activated_at = NOW() WHERE id = %s",
            (code_id,),
        )
    cur.execute("INSERT INTO login_attempts (ip, success) VALUES (%s, true)", (ip,))
    conn.commit()

    if row['role'] == 'admin':
        token = issue_session(conn, cur, code_id, 'admin', None)
        return resp(200, {'step': 'done', 'token': token, 'role': 'admin'})

    cur.execute("SELECT COUNT(*) AS c FROM student_profiles WHERE access_code_id = %s", (code_id,))
    taken = cur.fetchone()['c']

    ticket = secrets.token_urlsafe(24)
    expires = datetime.utcnow() + timedelta(minutes=30)
    cur.execute(
        """
        INSERT INTO sessions (token_hash, access_code_id, role, student_profile_id, expires_at)
        VALUES (%s, %s, 'pending', NULL, %s)
        """,
        (hash_value(ticket), code_id, expires),
    )
    conn.commit()

    full = bool(row['max_students'] and taken >= row['max_students'])

    return resp(200, {
        'step': 'pin',
        'ticket': ticket,
        'group_name': row['group_name'],
        'course_name': row['course_name'],
        'period': row['period'],
        'students_count': taken,
        'group_full': full,
    })


def login_pin(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body') or '{}')
    ticket = str(body.get('ticket', ''))
    pin = str(body.get('pin', '')).strip()
    ip = client_ip(event)

    if throttled(cur, ip):
        return resp(429, {'error': 'Слишком много попыток. Попробуйте через 15 минут.'})

    cur.execute(
        """
        SELECT s.id, s.access_code_id, ac.status AS code_status
        FROM sessions s
        JOIN access_codes ac ON ac.id = s.access_code_id
        WHERE s.token_hash = %s AND s.role = 'pending' AND s.expires_at > NOW()
        """,
        (hash_value(ticket),),
    )
    tk = cur.fetchone()
    if not tk or tk['code_status'] == 'disabled':
        return resp(401, {'error': 'Сессия входа истекла. Введите пароль заново.'})

    if not pin.isdigit() or not (4 <= len(pin) <= 6):
        return resp(400, {'error': 'PIN — от 4 до 6 цифр'})

    code_id = tk['access_code_id']
    cur.execute(
        """
        SELECT id, first_name, last_name FROM student_profiles
        WHERE access_code_id = %s AND pin_hash = %s
        """,
        (code_id, hash_value(pin)),
    )
    profile = cur.fetchone()

    if not profile:
        cur.execute("INSERT INTO login_attempts (ip, success) VALUES (%s, false)", (ip,))
        conn.commit()
        return resp(404, {'error': 'Профиль с таким PIN не найден', 'can_create': True})

    cur.execute("DELETE FROM sessions WHERE id = %s", (tk['id'],))
    cur.execute("INSERT INTO login_attempts (ip, success) VALUES (%s, true)", (ip,))
    token = issue_session(conn, cur, code_id, 'student', profile['id'])

    return resp(200, {
        'step': 'done',
        'token': token,
        'role': 'student',
        'has_profile': True,
        'first_name': profile['first_name'],
    })


def do_me(cur, event: Dict[str, Any]) -> Dict[str, Any]:
    token = get_token(event)
    if not token:
        return resp(401, {'error': 'Не авторизован'})

    cur.execute(
        """
        SELECT s.role, s.access_code_id, s.student_profile_id, s.expires_at,
               ac.status AS code_status, ac.group_name, ac.course_name, ac.period
        FROM sessions s
        JOIN access_codes ac ON ac.id = s.access_code_id
        WHERE s.token_hash = %s
        """,
        (hash_value(token),),
    )
    sess = cur.fetchone()
    if not sess or sess['expires_at'] < datetime.utcnow() or sess['code_status'] == 'disabled':
        return resp(401, {'error': 'Сессия истекла'})
    if sess['role'] == 'pending':
        return resp(401, {'error': 'Вход не завершён'})

    profile = None
    if sess['student_profile_id']:
        cur.execute(
            """
            SELECT id, first_name, last_name, phone, email, city, industry,
                   profession, employment_type, consent_accepted_at
            FROM student_profiles WHERE id = %s
            """,
            (sess['student_profile_id'],),
        )
        found = cur.fetchone()
        profile = dict(found) if found else None

    return resp(200, {
        'role': sess['role'],
        'has_profile': profile is not None,
        'profile': profile,
        'group_name': sess['group_name'],
        'course_name': sess['course_name'],
        'period': sess['period'],
    })


def do_logout(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    token = get_token(event)
    if token:
        cur.execute("DELETE FROM sessions WHERE token_hash = %s", (hash_value(token),))
        conn.commit()
    return resp(200, {'ok': True})
