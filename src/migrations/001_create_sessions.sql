-- Create sessions table
CREATE TABLE sessions (
    sid VARCHAR NOT NULL COLLATE "default",
    sess JSON NOT NULL,
    expire TIMESTAMP(6) NOT NULL,
    CONSTRAINT sessions_pkey PRIMARY KEY (sid)
);

  CREATE INDEX idx_sessions_expire ON sessions (expire);