import json
import os
import hashlib
import secrets
import string
from datetime import datetime
from typing import Dict, Any, Optional

import psycopg2
from psycopg2.extras import RealDictCursor

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token, X-Cabinet-Token',
    'Access-Control-Max-Age': '86400',
}

ALPHABET = string.ascii_uppercase.replace('O', '').replace('I', '') + '23456789'


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


def get_token(event: Dict[str, Any]) -> Optional[str]:
    headers = event.get('headers') or {}
    for key in ('X-Cabinet-Token', 'x-cabinet-token', 'X-Auth-Token', 'x-auth-token'):
        if headers.get(key):
            return headers[key]
    return None


def require_admin(cur, event: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    token = get_token(event)
    if not token:
        return None
    cur.execute(
        """
        SELECT s.access_code_id, s.role
        FROM sessions s
        JOIN access_codes ac ON ac.id = s.access_code_id
        WHERE s.token_hash = %s AND s.expires_at > NOW() AND ac.status <> 'disabled'
        """,
        (hash_value(token),),
    )
    row = cur.fetchone()
    if not row or row['role'] != 'admin':
        return None
    return dict(row)


def gen_code() -> str:
    parts = [''.join(secrets.choice(ALPHABET) for _ in range(4)) for _ in range(3)]
    return '-'.join(parts)


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Управление кодами доступа учеников: создание, список, отключение, замена"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'list')

    conn = db()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            admin = require_admin(cur, event)
            if not admin:
                return resp(403, {'error': 'Доступ запрещён'})

            if action == 'list':
                return list_codes(cur)
            if action == 'create' and method == 'POST':
                return create_code(conn, cur, event)
            if action == 'disable' and method == 'POST':
                return set_status(conn, cur, event, 'disabled')
            if action == 'enable' and method == 'POST':
                return set_status(conn, cur, event, None)
            if action == 'regenerate' and method == 'POST':
                return regenerate(conn, cur, event)
            if action == 'disable-all' and method == 'POST':
                return disable_all(conn, cur)
            if action == 'enable-all' and method == 'POST':
                return enable_all(conn, cur)
        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        conn.close()


def list_codes(cur) -> Dict[str, Any]:
    cur.execute(
        """
        SELECT ac.id, ac.code_hint, ac.group_name, ac.course_name, ac.period,
               ac.role, ac.status, ac.note, ac.activated_at, ac.created_at,
               p.id AS profile_id, p.first_name, p.last_name, p.email, p.phone
        FROM access_codes ac
        LEFT JOIN student_profiles p ON p.access_code_id = ac.id
        WHERE ac.role = 'student'
        ORDER BY ac.created_at DESC
        """
    )
    rows = [dict(r) for r in cur.fetchall()]
    stats = {
        'total': len(rows),
        'activated': sum(1 for r in rows if r['status'] == 'activated'),
        'with_profile': sum(1 for r in rows if r['profile_id']),
        'disabled': sum(1 for r in rows if r['status'] == 'disabled'),
    }
    return resp(200, {'codes': rows, 'stats': stats})


def create_code(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body') or '{}')
    count = min(int(body.get('count', 1)), 50)
    group_name = (body.get('group_name') or '').strip() or None
    course_name = (body.get('course_name') or '').strip() or None
    period = (body.get('period') or '').strip() or None
    note = (body.get('note') or '').strip() or None

    created = []
    for _ in range(count):
        code = gen_code()
        cur.execute(
            """
            INSERT INTO access_codes (code_hash, code_hint, group_name, course_name, period, note)
            VALUES (%s, %s, %s, %s, %s, %s) RETURNING id
            """,
            (hash_value(code), code[:4] + '…', group_name, course_name, period, note),
        )
        created.append({'id': cur.fetchone()['id'], 'code': code})
    conn.commit()
    return resp(200, {'created': created})


def set_status(conn, cur, event: Dict[str, Any], status: Optional[str]) -> Dict[str, Any]:
    body = json.loads(event.get('body') or '{}')
    code_id = int(body.get('id', 0))
    if not code_id:
        return resp(400, {'error': 'Не указан код'})

    if status == 'disabled':
        cur.execute("UPDATE access_codes SET status = 'disabled' WHERE id = %s", (code_id,))
        cur.execute("DELETE FROM sessions WHERE access_code_id = %s", (code_id,))
    else:
        cur.execute(
            """
            UPDATE access_codes
            SET status = CASE WHEN activated_at IS NULL THEN 'new' ELSE 'activated' END
            WHERE id = %s
            """,
            (code_id,),
        )
    conn.commit()
    return resp(200, {'ok': True})


def disable_all(conn, cur) -> Dict[str, Any]:
    cur.execute(
        "UPDATE access_codes SET status = 'disabled' WHERE role = 'student' AND status <> 'disabled'"
    )
    affected = cur.rowcount
    cur.execute(
        """
        DELETE FROM sessions
        WHERE access_code_id IN (SELECT id FROM access_codes WHERE role = 'student')
        """
    )
    conn.commit()
    return resp(200, {'ok': True, 'affected': affected})


def enable_all(conn, cur) -> Dict[str, Any]:
    cur.execute(
        """
        UPDATE access_codes
        SET status = CASE WHEN activated_at IS NULL THEN 'new' ELSE 'activated' END
        WHERE role = 'student' AND status = 'disabled'
        """
    )
    affected = cur.rowcount
    conn.commit()
    return resp(200, {'ok': True, 'affected': affected})


def regenerate(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    body = json.loads(event.get('body') or '{}')
    code_id = int(body.get('id', 0))
    if not code_id:
        return resp(400, {'error': 'Не указан код'})

    code = gen_code()
    cur.execute(
        "UPDATE access_codes SET code_hash = %s, code_hint = %s WHERE id = %s",
        (hash_value(code), code[:4] + '…', code_id),
    )
    cur.execute("DELETE FROM sessions WHERE access_code_id = %s", (code_id,))
    conn.commit()
    return resp(200, {'id': code_id, 'code': code})