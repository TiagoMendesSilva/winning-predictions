ALTER TABLE public.fixture
    ADD COLUMN external_id BIGINT;

ALTER TABLE public.fixture
    ADD CONSTRAINT uk_fixture_external_id
        UNIQUE (external_id);