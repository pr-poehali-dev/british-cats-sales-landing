import json
import os
import hashlib
from datetime import datetime
from typing import Dict, Any, Optional, List

import psycopg2
from psycopg2.extras import RealDictCursor, Json

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


def current_student(cur, event: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    token = get_token(event)
    if not token:
        return None
    cur.execute(
        """
        SELECT s.access_code_id, s.role, ac.group_name, ac.course_name, ac.period,
               p.id AS profile_id
        FROM sessions s
        JOIN access_codes ac ON ac.id = s.access_code_id
        LEFT JOIN student_profiles p ON p.access_code_id = ac.id
        WHERE s.token_hash = %s AND s.expires_at > NOW() AND ac.status <> 'disabled'
        """,
        (hash_value(token),),
    )
    row = cur.fetchone()
    if not row or row['role'] != 'student':
        return None
    return dict(row)


def handler(event: Dict[str, Any], context) -> Dict[str, Any]:
    """Личный кабинет ученика: профиль, список анкет, прохождение и завершение анкеты"""
    method = event.get('httpMethod', 'GET')
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'isBase64Encoded': False, 'body': ''}

    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'dashboard')

    conn = db()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            me = current_student(cur, event)
            if not me:
                return resp(403, {'error': 'Доступ запрещён'})

            if action == 'profile-create' and method == 'POST':
                return profile_create(conn, cur, event, me)
            if action == 'profile-update' and method == 'POST':
                return profile_update(conn, cur, event, me)

            if not me.get('profile_id'):
                return resp(409, {'error': 'Сначала создайте профиль'})

            if action == 'dashboard':
                return dashboard(conn, cur, me)
            if action == 'survey-get':
                return survey_get(conn, cur, me, params)
            if action == 'answer-save' and method == 'POST':
                return answer_save(conn, cur, event, me)
            if action == 'survey-complete' and method == 'POST':
                return survey_complete(conn, cur, event, me)
            if action == 'progress':
                return progress(cur, me)
            if action == 'report':
                return report(cur, me)
        return resp(400, {'error': 'Неизвестное действие'})
    finally:
        conn.close()


def profile_create(conn, cur, event: Dict[str, Any], me: Dict[str, Any]) -> Dict[str, Any]:
    if me.get('profile_id'):
        return resp(409, {'error': 'Профиль уже создан'})

    b = json.loads(event.get('body') or '{}')
    required = ['first_name', 'last_name', 'phone', 'email', 'industry', 'employment_type']
    for f in required:
        if not str(b.get(f, '')).strip():
            return resp(400, {'error': 'Заполните все обязательные поля'})
    if not b.get('consent'):
        return resp(400, {'error': 'Необходимо согласие на обработку данных'})

    cur.execute(
        """
        INSERT INTO student_profiles
            (access_code_id, first_name, last_name, phone, email, city, industry,
             profession, employment_type, consent_accepted_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, NOW())
        RETURNING id
        """,
        (
            me['access_code_id'],
            b['first_name'].strip()[:100], b['last_name'].strip()[:100],
            b['phone'].strip()[:50], b['email'].strip()[:200],
            (b.get('city') or '').strip()[:100] or None,
            b['industry'].strip()[:200],
            (b.get('profession') or '').strip()[:200] or None,
            b['employment_type'].strip()[:100],
        ),
    )
    profile_id = cur.fetchone()['id']
    conn.commit()
    return resp(200, {'profile_id': profile_id})


def profile_update(conn, cur, event: Dict[str, Any], me: Dict[str, Any]) -> Dict[str, Any]:
    if not me.get('profile_id'):
        return resp(409, {'error': 'Профиль не создан'})
    b = json.loads(event.get('body') or '{}')

    cur.execute("SELECT first_name, last_name, name_history FROM student_profiles WHERE id = %s", (me['profile_id'],))
    old = cur.fetchone()
    history = list(old['name_history'] or [])
    new_first = (b.get('first_name') or old['first_name']).strip()[:100]
    new_last = (b.get('last_name') or old['last_name']).strip()[:100]
    if new_first != old['first_name'] or new_last != old['last_name']:
        history.append({
            'from': f"{old['first_name']} {old['last_name']}",
            'to': f"{new_first} {new_last}",
            'at': datetime.utcnow().isoformat(),
        })

    cur.execute(
        """
        UPDATE student_profiles
        SET first_name = %s, last_name = %s, phone = %s, email = %s, city = %s,
            industry = %s, profession = %s, employment_type = %s,
            name_history = %s, updated_at = NOW()
        WHERE id = %s
        """,
        (
            new_first, new_last,
            (b.get('phone') or '').strip()[:50],
            (b.get('email') or '').strip()[:200],
            (b.get('city') or '').strip()[:100] or None,
            (b.get('industry') or '').strip()[:200],
            (b.get('profession') or '').strip()[:200] or None,
            (b.get('employment_type') or '').strip()[:100],
            Json(history), me['profile_id'],
        ),
    )
    conn.commit()
    return resp(200, {'ok': True})


def sync_assignments(conn, cur, profile_id: int) -> None:
    cur.execute(
        """
        INSERT INTO questionnaire_assignments (student_profile_id, questionnaire_id, status)
        SELECT %s, q.id, 'available'
        FROM questionnaires q
        WHERE q.status = 'available'
          AND NOT EXISTS (
            SELECT 1 FROM questionnaire_assignments a
            WHERE a.student_profile_id = %s AND a.questionnaire_id = q.id
          )
        """,
        (profile_id, profile_id),
    )
    conn.commit()


def dashboard(conn, cur, me: Dict[str, Any]) -> Dict[str, Any]:
    pid = me['profile_id']
    sync_assignments(conn, cur, pid)

    cur.execute(
        """
        SELECT a.id AS assignment_id, a.status, a.completed_at,
               q.id AS questionnaire_id, q.title, q.type, q.period,
               r.current_question, r.score, r.test_correct, r.test_total,
               (SELECT COUNT(*) FROM questions qq WHERE qq.questionnaire_id = q.id) AS total_questions,
               (SELECT COUNT(*) FROM jsonb_object_keys(COALESCE(r.answers_json, '{}'::jsonb))) AS answered
        FROM questionnaire_assignments a
        JOIN questionnaires q ON q.id = a.questionnaire_id
        LEFT JOIN responses r ON r.assignment_id = a.id
        WHERE a.student_profile_id = %s
        ORDER BY CASE q.type WHEN 'entrance' THEN 1 WHEN 'checkpoint' THEN 2 ELSE 3 END, q.id
        """,
        (pid,),
    )
    items = [dict(r) for r in cur.fetchall()]

    cur.execute(
        """
        SELECT first_name, last_name, phone, email, city, industry, profession, employment_type
        FROM student_profiles WHERE id = %s
        """,
        (pid,),
    )
    profile = dict(cur.fetchone())

    return resp(200, {
        'profile': profile,
        'group_name': me.get('group_name'),
        'course_name': me.get('course_name'),
        'period': me.get('period'),
        'assignments': items,
    })


def load_questions(cur, questionnaire_id: int, include_answers: bool = False) -> List[Dict[str, Any]]:
    cur.execute(
        """
        SELECT id, position, question_code, text, hint, type, options_json,
               is_required, max_choices, conditional_logic_json
        FROM questions WHERE questionnaire_id = %s ORDER BY position
        """,
        (questionnaire_id,),
    )
    return [dict(r) for r in cur.fetchall()]


def survey_get(conn, cur, me: Dict[str, Any], params: Dict[str, Any]) -> Dict[str, Any]:
    aid = int(params.get('assignment_id', 0))
    cur.execute(
        """
        SELECT a.id, a.status, a.questionnaire_id, q.title, q.type, q.period
        FROM questionnaire_assignments a
        JOIN questionnaires q ON q.id = a.questionnaire_id
        WHERE a.id = %s AND a.student_profile_id = %s
        """,
        (aid, me['profile_id']),
    )
    row = cur.fetchone()
    if not row:
        return resp(404, {'error': 'Анкета не найдена'})

    cur.execute("SELECT * FROM responses WHERE assignment_id = %s", (aid,))
    r = cur.fetchone()
    if not r:
        cur.execute(
            "INSERT INTO responses (assignment_id, student_profile_id) VALUES (%s, %s) RETURNING *",
            (aid, me['profile_id']),
        )
        r = cur.fetchone()
        cur.execute(
            "UPDATE questionnaire_assignments SET status = 'in_progress' WHERE id = %s AND status = 'available'",
            (aid,),
        )
        conn.commit()

    return resp(200, {
        'assignment': dict(row),
        'questions': load_questions(cur, row['questionnaire_id']),
        'response': {
            'answers': r['answers_json'] or {},
            'current_question': r['current_question'],
            'status': r['status'],
            'score': r['score'],
            'test_correct': r['test_correct'],
            'test_total': r['test_total'],
        },
    })


def answer_save(conn, cur, event: Dict[str, Any], me: Dict[str, Any]) -> Dict[str, Any]:
    b = json.loads(event.get('body') or '{}')
    aid = int(b.get('assignment_id', 0))
    code = str(b.get('question_code', ''))
    value = b.get('value')
    current = int(b.get('current_question', 0))

    cur.execute(
        "SELECT id, status FROM responses WHERE assignment_id = %s AND student_profile_id = %s",
        (aid, me['profile_id']),
    )
    r = cur.fetchone()
    if not r:
        return resp(404, {'error': 'Анкета не найдена'})
    if r['status'] == 'completed':
        return resp(409, {'error': 'Анкета уже завершена'})

    cur.execute(
        """
        UPDATE responses
        SET answers_json = jsonb_set(COALESCE(answers_json, '{}'::jsonb), %s, %s, true),
            current_question = %s, updated_at = NOW()
        WHERE id = %s
        """,
        ('{' + code + '}', Json(value), current, r['id']),
    )
    conn.commit()
    return resp(200, {'ok': True})


def survey_complete(conn, cur, event: Dict[str, Any], me: Dict[str, Any]) -> Dict[str, Any]:
    b = json.loads(event.get('body') or '{}')
    aid = int(b.get('assignment_id', 0))

    cur.execute(
        """
        SELECT r.id, r.status, r.answers_json, a.questionnaire_id
        FROM responses r
        JOIN questionnaire_assignments a ON a.id = r.assignment_id
        WHERE r.assignment_id = %s AND r.student_profile_id = %s
        """,
        (aid, me['profile_id']),
    )
    r = cur.fetchone()
    if not r:
        return resp(404, {'error': 'Анкета не найдена'})
    if r['status'] == 'completed':
        return resp(200, {'already': True})

    answers = r['answers_json'] or {}

    cur.execute(
        """
        SELECT question_code, is_required, type, correct_answer_json
        FROM questions WHERE questionnaire_id = %s ORDER BY position
        """,
        (r['questionnaire_id'],),
    )
    questions = [dict(q) for q in cur.fetchall()]

    missing = [
        q['question_code'] for q in questions
        if q['is_required'] and (
            answers.get(q['question_code']) in (None, '', [])
        )
    ]
    if missing:
        return resp(400, {'error': 'Заполнены не все обязательные вопросы', 'missing': missing})

    test_qs = [q for q in questions if q['type'] == 'TEST_SINGLE_CHOICE']
    test_total = len(test_qs)
    test_correct = 0
    for q in test_qs:
        correct = q['correct_answer_json']
        if correct is not None and answers.get(q['question_code']) == correct:
            test_correct += 1
    score = round(test_correct / test_total * 100, 2) if test_total else None

    cur.execute(
        """
        UPDATE responses
        SET status = 'completed', completed_at = NOW(), updated_at = NOW(),
            test_correct = %s, test_total = %s, score = %s
        WHERE id = %s
        """,
        (test_correct if test_total else None, test_total or None, score, r['id']),
    )
    cur.execute(
        "UPDATE questionnaire_assignments SET status = 'completed', completed_at = NOW() WHERE id = %s",
        (aid,),
    )
    conn.commit()

    return resp(200, {
        'test_correct': test_correct if test_total else None,
        'test_total': test_total or None,
        'score': score,
    })


FREQ_ORDER = [
    'Не использую', 'Пробовал несколько раз', 'Использую время от времени',
    'Использую каждую неделю', 'Использую почти ежедневно',
]
RESULT_ORDER = [
    'Пока никакого', 'Сэкономил время', 'Улучшил качество работы', 'Сделал учебный проект',
    'Применил в рабочей задаче', 'Выполнил задачу для клиента', 'Получил доход с помощью AI',
]


def fetch_completed(cur, profile_id: int) -> List[Dict[str, Any]]:
    cur.execute(
        """
        SELECT q.type, q.title, q.period, r.score, r.test_correct, r.test_total,
               r.answers_json, r.completed_at
        FROM responses r
        JOIN questionnaire_assignments a ON a.id = r.assignment_id
        JOIN questionnaires q ON q.id = a.questionnaire_id
        WHERE r.student_profile_id = %s AND r.status = 'completed'
        ORDER BY r.completed_at
        """,
        (profile_id,),
    )
    return [dict(r) for r in cur.fetchall()]


def progress(cur, me: Dict[str, Any]) -> Dict[str, Any]:
    items = fetch_completed(cur, me['profile_id'])

    timeline = []
    for it in items:
        a = it['answers_json'] or {}
        timeline.append({
            'type': it['type'],
            'title': it['title'],
            'period': it['period'],
            'completed_at': it['completed_at'],
            'score': float(it['score']) if it['score'] is not None else None,
            'self_score': a.get('ai_self_score') or a.get('cp_self_score'),
            'satisfaction': a.get('cp_satisfaction') or a.get('fin_satisfaction'),
            'ai_frequency': a.get('ai_frequency'),
            'applied': a.get('cp_applied') or a.get('ai_result'),
            'comprehension': a.get('cp_comprehension'),
            'activity': a.get('cp_activity'),
        })

    has_enough = len(timeline) >= 2
    return resp(200, {'items': timeline, 'has_enough': has_enough})


def level_change(order: List[str], before: Optional[str], after: Optional[str]) -> Optional[int]:
    if before in order and after in order:
        return order.index(after) - order.index(before)
    return None


def report(cur, me: Dict[str, Any]) -> Dict[str, Any]:
    items = fetch_completed(cur, me['profile_id'])
    entrance = next((i for i in items if i['type'] == 'entrance'), None)
    final = next((i for i in items if i['type'] == 'final'), None)
    checkpoints = [i for i in items if i['type'] == 'checkpoint']

    if not entrance or not final:
        return resp(200, {'ready': False, 'has_entrance': bool(entrance), 'has_final': bool(final)})

    ea = entrance['answers_json'] or {}
    fa = final['answers_json'] or {}

    e_score = float(entrance['score']) if entrance['score'] is not None else None
    f_score = float(final['score']) if final['score'] is not None else None
    score_delta = round(f_score - e_score, 1) if e_score is not None and f_score is not None else None

    e_self = ea.get('ai_self_score')
    f_self = fa.get('ai_self_score')
    self_delta = (f_self - e_self) if isinstance(e_self, int) and isinstance(f_self, int) else None

    rows = [
        {
            'label': 'Результат теста',
            'before': f'{e_score:.0f}%' if e_score is not None else '—',
            'after': f'{f_score:.0f}%' if f_score is not None else '—',
            'delta': f'{score_delta:+.0f} п.п.' if score_delta is not None else None,
            'positive': score_delta is not None and score_delta > 0,
        },
        {
            'label': 'Самооценка навыков (1–10)',
            'before': str(e_self) if e_self is not None else '—',
            'after': str(f_self) if f_self is not None else '—',
            'delta': f'{self_delta:+d}' if self_delta is not None else None,
            'positive': self_delta is not None and self_delta > 0,
        },
        {
            'label': 'Частота применения AI',
            'before': ea.get('ai_frequency') or '—',
            'after': fa.get('ai_frequency') or '—',
            'delta': None,
            'positive': (level_change(FREQ_ORDER, ea.get('ai_frequency'), fa.get('ai_frequency')) or 0) > 0,
        },
        {
            'label': 'Практический результат',
            'before': ea.get('ai_result') or '—',
            'after': fa.get('ai_result') or '—',
            'delta': None,
            'positive': (level_change(RESULT_ORDER, ea.get('ai_result'), fa.get('ai_result')) or 0) > 0,
        },
        {
            'label': 'Готовых проектов',
            'before': 'Не было',
            'after': fa.get('fin_projects_count') or '—',
            'delta': None,
            'positive': fa.get('fin_projects_count') not in (None, 'Ни одного'),
        },
        {
            'label': 'Клиентские задачи',
            'before': 'Не выполнял' if ea.get('ai_result') != 'Выполнил задачу для клиента' else 'Выполнял',
            'after': fa.get('fin_client_tasks') or '—',
            'delta': None,
            'positive': fa.get('fin_client_tasks') not in (None, 'Нет'),
        },
    ]

    tasks_before = ea.get('ai_tasks') or []
    tasks_after = fa.get('ai_tasks') or []
    new_tasks = [t for t in tasks_after if t not in tasks_before] if isinstance(tasks_after, list) else []

    dynamics = [
        {
            'period': c['period'] or c['title'],
            'satisfaction': (c['answers_json'] or {}).get('cp_satisfaction'),
            'self_score': (c['answers_json'] or {}).get('cp_self_score'),
            'applied': (c['answers_json'] or {}).get('cp_applied'),
            'completed_at': c['completed_at'],
        }
        for c in checkpoints
    ]

    return resp(200, {
        'ready': True,
        'rows': rows,
        'goal': {
            'text': ea.get('goal_result'),
            'task': ea.get('goal_task'),
            'reached': fa.get('fin_goal_reached'),
            'task_solved': fa.get('fin_task_solved'),
        },
        'main_result': fa.get('fin_main_result'),
        'changes': fa.get('fin_changes'),
        'next_plans': fa.get('fin_next'),
        'satisfaction': fa.get('fin_satisfaction'),
        'new_tasks': new_tasks,
        'dynamics': dynamics,
        'completed_at': final['completed_at'],
    })