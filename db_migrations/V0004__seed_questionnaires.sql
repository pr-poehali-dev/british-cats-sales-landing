INSERT INTO questionnaires (title, type, period, status)
SELECT 'Входная анкета', 'entrance', NULL, 'available'
WHERE NOT EXISTS (SELECT 1 FROM questionnaires WHERE type = 'entrance');

INSERT INTO questionnaires (title, type, period, status)
SELECT 'Промежуточная анкета', 'checkpoint', 'Месяц 1', 'draft'
WHERE NOT EXISTS (SELECT 1 FROM questionnaires WHERE type = 'checkpoint');

INSERT INTO questionnaires (title, type, period, status)
SELECT 'Итоговая анкета', 'final', NULL, 'draft'
WHERE NOT EXISTS (SELECT 1 FROM questionnaires WHERE type = 'final');
