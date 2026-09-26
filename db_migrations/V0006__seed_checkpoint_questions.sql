INSERT INTO questions (questionnaire_id, position, question_code, text, hint, type, options_json, is_required, max_choices, conditional_logic_json)
SELECT q.id, v.position, v.question_code, v.text, v.hint, v.type, v.options_json::jsonb, v.is_required, v.max_choices::integer, v.conditional_logic_json::jsonb
FROM questionnaires q
CROSS JOIN (VALUES
(1, 'cp_satisfaction', 'Насколько вы довольны обучением сейчас?', NULL, 'SCALE', '{"min":1,"max":10}', true, NULL::text, NULL::text),
(2, 'cp_comprehension', 'Насколько хорошо понимаете материал?', NULL, 'SINGLE_CHOICE',
 '["Практически не понимаю","Понимаю частично","В основном понимаю","Понимаю уверенно","Могу объяснить другому"]', true, NULL, NULL),
(3, 'cp_activity', 'Как регулярно занимаетесь?', NULL, 'SINGLE_CHOICE',
 '["Практически не занимался","Реже одного раза в неделю","1–2 раза в неделю","3–4 раза в неделю","Почти каждый день"]', true, NULL, NULL),
(4, 'cp_applied', 'Применяли ли изученное на практике?', NULL, 'SINGLE_CHOICE',
 '["Нет","Только пробовал","Выполнил учебную задачу","Применил в своей работе","Сделал проект для бизнеса","Выполнил клиентскую задачу","Получил коммерческий результат"]', true, NULL, NULL),
(5, 'cp_applied_detail', 'Что удалось сделать и какой результат получить?', 'Коротко опишите, что именно сделали', 'LONG_TEXT', NULL, false, NULL,
 '{"depends_on":"cp_applied","not_equals":"Нет"}'),
(6, 'cp_blockers', 'Что мешает двигаться дальше?', 'Можно выбрать несколько вариантов', 'MULTIPLE_CHOICE',
 '["Не хватает времени","Сложный материал","Не понимаю, с чего начать","Не хватает практики","Технические сложности","Не хватает обратной связи","Потерял мотивацию","Не вижу практической пользы","Ничего не мешает","Другое"]', true, NULL, NULL),
(7, 'cp_continue', 'Планируете ли продолжать обучение?', NULL, 'SINGLE_CHOICE',
 '["Да, точно","Скорее да","Пока не уверен","Скорее нет","Планирую прекратить"]', true, NULL, NULL),
(8, 'cp_help', 'Что могло бы помочь вам продолжить?', 'Ответьте своими словами', 'LONG_TEXT', NULL, false, NULL,
 '{"depends_on":"cp_continue","in":["Пока не уверен","Скорее нет","Планирую прекратить"]}'),
(9, 'cp_self_score', 'Оцените свои навыки работы с AI от 1 до 10', '1 — совсем не умею, 10 — уверенно применяю', 'SCALE', '{"min":1,"max":10}', true, NULL, NULL)
) AS v(position, question_code, text, hint, type, options_json, is_required, max_choices, conditional_logic_json)
WHERE q.type = 'checkpoint'
  AND NOT EXISTS (SELECT 1 FROM questions x WHERE x.questionnaire_id = q.id);
