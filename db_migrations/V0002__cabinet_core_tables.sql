CREATE TABLE IF NOT EXISTS access_codes (
    id SERIAL PRIMARY KEY,
    code_hash VARCHAR(255) NOT NULL,
    code_hint VARCHAR(50) NOT NULL,
    group_name VARCHAR(200),
    course_name VARCHAR(200),
    period VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'activated', 'disabled')),
    note TEXT,
    activated_at TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_access_codes_status ON access_codes(status);
CREATE INDEX IF NOT EXISTS idx_access_codes_hash ON access_codes(code_hash);

CREATE TABLE IF NOT EXISTS student_profiles (
    id SERIAL PRIMARY KEY,
    access_code_id INTEGER NOT NULL UNIQUE REFERENCES access_codes(id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(200) NOT NULL,
    city VARCHAR(100),
    industry VARCHAR(200) NOT NULL,
    profession VARCHAR(200),
    employment_type VARCHAR(100) NOT NULL,
    consent_accepted_at TIMESTAMP NULL,
    name_history JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    access_code_id INTEGER NOT NULL REFERENCES access_codes(id),
    role VARCHAR(20) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS login_attempts (
    id SERIAL PRIMARY KEY,
    ip VARCHAR(64) NOT NULL,
    success BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_ip_time ON login_attempts(ip, created_at);

CREATE TABLE IF NOT EXISTS questionnaires (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('entrance', 'checkpoint', 'final')),
    period VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'available', 'closed')),
    available_from TIMESTAMP NULL,
    available_to TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    questionnaire_id INTEGER NOT NULL REFERENCES questionnaires(id),
    position INTEGER NOT NULL,
    question_code VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    hint TEXT,
    type VARCHAR(40) NOT NULL,
    options_json JSONB,
    is_required BOOLEAN NOT NULL DEFAULT false,
    max_choices INTEGER NULL,
    correct_answer_json JSONB NULL,
    conditional_logic_json JSONB NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_qid ON questions(questionnaire_id, position);

CREATE TABLE IF NOT EXISTS questionnaire_assignments (
    id SERIAL PRIMARY KEY,
    student_profile_id INTEGER NOT NULL REFERENCES student_profiles(id),
    questionnaire_id INTEGER NOT NULL REFERENCES questionnaires(id),
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'completed', 'locked')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP NULL,
    UNIQUE (student_profile_id, questionnaire_id)
);

CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    assignment_id INTEGER NOT NULL UNIQUE REFERENCES questionnaire_assignments(id),
    student_profile_id INTEGER NOT NULL REFERENCES student_profiles(id),
    answers_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    current_question INTEGER NOT NULL DEFAULT 0,
    test_correct INTEGER NULL,
    test_total INTEGER NULL,
    score DECIMAL(5,2) NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    started_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_responses_profile ON responses(student_profile_id);
