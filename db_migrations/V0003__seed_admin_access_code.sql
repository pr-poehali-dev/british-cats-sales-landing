INSERT INTO access_codes (code_hash, code_hint, role, status, note)
SELECT '23bb166276b190cb945b9dbefe314444b3de9a11971d055fafecc57695b7233a',
       'ADMI…', 'admin', 'new', 'Администратор школы'
WHERE NOT EXISTS (SELECT 1 FROM access_codes WHERE role = 'admin');
