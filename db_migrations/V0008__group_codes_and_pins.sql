ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS is_group BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE access_codes ADD COLUMN IF NOT EXISTS max_students INTEGER NULL;

ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS pin_hash VARCHAR(255) NULL;
ALTER TABLE student_profiles ADD COLUMN IF NOT EXISTS pin_hint VARCHAR(10) NULL;

ALTER TABLE student_profiles DROP CONSTRAINT IF EXISTS student_profiles_access_code_id_key;

CREATE INDEX IF NOT EXISTS idx_profiles_code ON student_profiles(access_code_id);
CREATE INDEX IF NOT EXISTS idx_profiles_code_pin ON student_profiles(access_code_id, pin_hash);

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS student_profile_id INTEGER NULL REFERENCES student_profiles(id);

UPDATE access_codes SET status = 'disabled' WHERE role = 'student' AND is_group = false;
