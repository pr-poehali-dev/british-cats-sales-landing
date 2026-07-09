CREATE TABLE IF NOT EXISTS tg_dialogs (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT UNIQUE NOT NULL,
    name TEXT NOT NULL DEFAULT '',
    username TEXT DEFAULT '',
    unread INTEGER NOT NULL DEFAULT 0,
    last_message_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tg_messages (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    direction TEXT NOT NULL DEFAULT 'in',
    text TEXT NOT NULL DEFAULT '',
    file_url TEXT DEFAULT '',
    file_name TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tg_messages_chat ON tg_messages(chat_id, created_at);
