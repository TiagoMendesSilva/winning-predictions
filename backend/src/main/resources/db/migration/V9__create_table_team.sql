CREATE TABLE public.team (
     id BIGSERIAL PRIMARY KEY,
     external_id BIGINT NOT NULL UNIQUE,
     name VARCHAR(255) NOT NULL,
     logo_url TEXT,
     logo BYTEA,
     country VARCHAR(255),
     created_at TIMESTAMP,
     updated_at TIMESTAMP
);

CREATE INDEX idx_team_external_id
    ON public.team (external_id);