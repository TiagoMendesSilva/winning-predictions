create table if not exists public.user (
     id BIGSERIAL PRIMARY KEY,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL UNIQUE,
     picture_url VARCHAR(500),
     provider VARCHAR(100) NOT NULL,
     created_at TIMESTAMP NOT NULL
);