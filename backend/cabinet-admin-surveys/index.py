import json
import os
import hashlib
from typing import Dict, Any, Optional

import psycopg2
from psycopg2.extras import RealDictCursor

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


def get_token(event: Dict[str, Any]) -> Optional[str]:
    headers = event.get('headers') or {}
    for key in ('X-Cabinet-Token', 'x-cabinet-token', 'X-Auth-Token', 'x-auth-token'):
        if headers.get(key):
            return headers[key]
    return None


def require_admin(cur, event: Dict[str, Any]) -> bool:
    token = get_token(event)
    if not token:
        return False
    cur.execute(
        """
        SELECT s.role FROM sessions s
        JOIN access_codes ac ON ac.id = s.access_code_id
        WHERE s.token_hash = %s AND s.expires_at > NOW() AND ac.status <> 'disabled'
        """,
        (hash_value(token),),
    )
    row = cur.fetchone()
    return bool(row and row['role'] == 'admin')


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Администрирование анкет: открытие и закрытие анкет, просмотр ответов и аналитика"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'list')

    conn = db()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            if not require_admin(cur, event):
                return resp(403, {'error': 'Доступ запрещён'})

            if action == 'list':
                return list_surveys(cur)
            if action == 'set-status' and method == 'POST':
                return set_status(conn, cur, event)
            if action == 'students':
                return students(cur)
            if action == 'student':
                return student_card(cur, params)
            if action == 'analytics':
                return analytics(cur)
        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        conn.close()


def list_surveys(cur) -> Dict[str, Any]:
    cur.execute(
        """
        SELECT q.id, q.title, q.type, q.period, q.status, q.created_at,
               (SELECT COUNT(*) FROM questions x WHERE x.questionnaire_id = q.id) AS questions_count,
               (SELECT COUNT(*) FROM questionnaire_assignments a WHERE a.questionnaire_id = q.id) AS assigned,
               (SELECT COUNT(*) FROM questionnaire_assignments a
                 WHERE a.questionnaire_id = q.id AND a.status = 'completed') AS completed
        FROM questionnaires q
        ORDER BY CASE q.type WHEN 'entrance' THEN 1 WHEN 'checkpoint' THEN 2 ELSE 3 END, q.id
        """
    )
    return resp(200, {'surveys': [dict(r) for r in cur.fetchall()]})


def set_status(conn, cur, event: Dict[str, Any]) -> Dict[str, Any]:
    b = json.loads(event.get('body') or '{}')
    sid = int(b.get('id', 0))
    status = b.get('status')
    if status not in ('draft', 'available', 'closed'):
        return resp(400, {'error': 'Недопустимый статус'})

    cur.execute("UPDATE questionnaires SET status = %s WHERE id = %s", (status, sid))

    if status == 'available':
        cur.execute(
            """
            INSERT INTO questionnaire_assignments (student_profile_id, questionnaire_id, status)
            SELECT p.id, %s, 'available'
            FROM student_profiles p
            WHERE NOT EXISTS (
                SELECT 1 FROM questionnaire_assignments a
                WHERE a.student_profile_id = p.id AND a.questionnaire_id = %s
            )
            """,
            (sid, sid),
        )
    conn.commit()
    return resp(200, {'ok': True})


def students(cur) -> Dict[str, Any]:
    cur.execute(
        """
        SELECT p.id, p.first_name, p.last_name, p.email, p.phone, p.city,
               p.industry, p.profession, p.employment_type, p.created_at,
               ac.group_name, ac.course_name, ac.period,
               (SELECT COUNT(*) FROM questionnaire_assignments a
                 WHERE a.student_profile_id = p.id AND a.status = 'completed') AS completed_count,
               (SELECT r.score FROM responses r
                 JOIN questionnaire_assignments a ON a.id = r.assignment_id
                 JOIN questionnaires q ON q.id = a.questionnaire_id
                 WHERE r.student_profile_id = p.id AND q.type = 'entrance' AND r.status = 'completed'
                 LIMIT 1) AS entrance_score,
               (SELECT r.score FROM responses r
                 JOIN questionnaire_assignments a ON a.id = r.assignment_id
                 JOIN questionnaires q ON q.id = a.questionnaire_id
                 WHERE r.student_profile_id = p.id AND q.type = 'final' AND r.status = 'completed'
                 LIMIT 1) AS final_score,
               (SELECT (r.answers_json->>'cp_satisfaction')::int FROM responses r
                 JOIN questionnaire_assignments a ON a.id = r.assignment_id
                 JOIN questionnaires q ON q.id = a.questionnaire_id
                 WHERE r.student_profile_id = p.id AND q.type = 'checkpoint' AND r.status = 'completed'
                 ORDER BY r.completed_at DESC LIMIT 1) AS last_csat,
               (SELECT r.answers_json->>'cp_continue' FROM responses r
                 JOIN questionnaire_assignments a ON a.id = r.assignment_id
                 JOIN questionnaires q ON q.id = a.questionnaire_id
                 WHERE r.student_profile_id = p.id AND q.type = 'checkpoint' AND r.status = 'completed'
                 ORDER BY r.completed_at DESC LIMIT 1) AS last_continue
        FROM student_profiles p
        JOIN access_codes ac ON ac.id = p.access_code_id
        ORDER BY p.created_at DESC
        """
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        csat = r.get('last_csat')
        cont = r.get('last_continue') or ''
        r['attention'] = bool(
            (csat is not None and csat <= 5)
            or cont in ('Пока не уверен', 'Скорее нет', 'Планирую прекратить')
        )
    return resp(200, {'students': rows})


def student_card(cur, params: Dict[str, Any]) -> Dict[str, Any]:
    pid = int(params.get('id', 0))
    cur.execute(
        """
        SELECT p.*, ac.group_name, ac.course_name, ac.period, ac.status AS code_status
        FROM student_profiles p
        JOIN access_codes ac ON ac.id = p.access_code_id
        WHERE p.id = %s
        """,
        (pid,),
    )
    prof = cur.fetchone()
    if not prof:
        return resp(404, {'error': 'Ученик не найден'})

    cur.execute(
        """
        SELECT q.id AS questionnaire_id, q.title, q.type, q.period,
               a.status, r.answers_json, r.score, r.test_correct, r.test_total, r.completed_at
        FROM questionnaire_assignments a
        JOIN questionnaires q ON q.id = a.questionnaire_id
        LEFT JOIN responses r ON r.assignment_id = a.id
        WHERE a.student_profile_id = %s
        ORDER BY CASE q.type WHEN 'entrance' THEN 1 WHEN 'checkpoint' THEN 2 ELSE 3 END, q.id
        """,
        (pid,),
    )
    responses = [dict(r) for r in cur.fetchall()]

    cur.execute(
        """
        SELECT q.id AS questionnaire_id, x.question_code, x.text, x.type, x.position
        FROM questions x
        JOIN questionnaires q ON q.id = x.questionnaire_id
        ORDER BY q.id, x.position
        """
    )
    questions = [dict(r) for r in cur.fetchall()]

    return resp(200, {'profile': dict(prof), 'responses': responses, 'questions': questions})


def analytics(cur) -> Dict[str, Any]:
    cur.execute("SELECT COUNT(*) AS c FROM access_codes WHERE role = 'student'")
    total_codes = cur.fetchone()['c']
    cur.execute("SELECT COUNT(*) AS c FROM access_codes WHERE role = 'student' AND status = 'activated'")
    activated = cur.fetchone()['c']
    cur.execute("SELECT COUNT(*) AS c FROM student_profiles")
    profiles = cur.fetchone()['c']

    cur.execute(
        """
        SELECT q.type,
               COUNT(*) FILTER (WHERE a.status = 'completed') AS completed,
               COUNT(*) AS assigned,
               AVG(r.score) FILTER (WHERE r.status = 'completed') AS avg_score
        FROM questionnaire_assignments a
        JOIN questionnaires q ON q.id = a.questionnaire_id
        LEFT JOIN responses r ON r.assignment_id = a.id
        GROUP BY q.type
        """
    )
    by_type = {r['type']: dict(r) for r in cur.fetchall()}

    cur.execute(
        """
        SELECT AVG((r.answers_json->>'cp_satisfaction')::numeric) AS avg_csat,
               COUNT(*) AS n
        FROM responses r
        JOIN questionnaire_assignments a ON a.id = r.assignment_id
        JOIN questionnaires q ON q.id = a.questionnaire_id
        WHERE q.type = 'checkpoint' AND r.status = 'completed'
          AND r.answers_json ? 'cp_satisfaction'
        """
    )
    csat = dict(cur.fetchone())

    return resp(200, {
        'total_codes': total_codes,
        'activated': activated,
        'profiles': profiles,
        'by_type': by_type,
        'csat': csat,
    })
