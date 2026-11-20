CREATE TABLE if not exists public.prediction (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    fixture_id BIGINT NOT NULL,
    home_goals INTEGER NOT NULL,
    away_goals INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_prediction_user FOREIGN KEY (user_id) REFERENCES public.user (id),
    CONSTRAINT fk_prediction_fixture FOREIGN KEY (fixture_id) REFERENCES public.fixture (id),
    CONSTRAINT uk_prediction_user_fixture UNIQUE (user_id, fixture_id)
);
