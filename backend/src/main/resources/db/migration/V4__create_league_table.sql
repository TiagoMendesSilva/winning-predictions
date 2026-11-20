CREATE TABLE IF NOT EXISTS public.LEAGUE
(
    id         BIGINT                      NOT NULL,
    name       VARCHAR(100)                NOT NULL,
    country    VARCHAR(100),
    logo_url   VARCHAR(500),
    code       VARCHAR(10),
    flag       VARCHAR(500),
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),

    CONSTRAINT pk_league PRIMARY KEY (id)
    );

COMMENT ON TABLE public.LEAGUE IS 'Tabela de campeonatos sincronizada com a API externa';
COMMENT ON COLUMN public.LEAGUE.id IS 'ID originado da api-sports';
COMMENT ON COLUMN public.LEAGUE.logo_url IS 'URL do escudo do campeonato';
COMMENT ON COLUMN public.LEAGUE.flag IS 'URL da bandeira do país';