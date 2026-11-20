CREATE TABLE if not exists public.fixture (
    id BIGINT PRIMARY KEY,

-- Info
    referee VARCHAR(255),
    timezone VARCHAR(50),
    date VARCHAR(50),
    timestamp BIGINT,

-- Period
    first BIGINT,
    second BIGINT,

-- Venue
    venue_id BIGINT,
    venue_name VARCHAR(255),
    city VARCHAR(255),

-- Status
    long_field VARCHAR(100),
    short_field VARCHAR(20),
    elapsed INTEGER,
    extra INTEGER,

-- League
    league_id BIGINT,
    name_league VARCHAR(255),
    country VARCHAR(100),
    logo TEXT,
    flag TEXT,
    season INTEGER,
    round VARCHAR(255),

-- Home Team
    team_home_id BIGINT,
    team_home_name VARCHAR(255),
    team_home_logo TEXT,
    team_home_winner BOOLEAN,

-- Away Team
    team_away_id BIGINT,
    team_away_name VARCHAR(255),
    team_away_logo TEXT,
    team_away_winner BOOLEAN,

-- Goals
    home_goals INTEGER,
    away_goals INTEGER,

-- Score - Half Time
    half_time_home INTEGER,
    half_time_away INTEGER,

-- Score - Full Time
    full_time_home INTEGER,
    full_time_away INTEGER,

-- Score - Extra Time
    extra_time_home INTEGER,
    extra_time_away INTEGER,

-- Score - Penalty
    penalty_home INTEGER,
    penalty_away INTEGER,

    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE INDEX idx_fixture_league_id
    ON public.fixture (league_id);

CREATE INDEX idx_fixture_date
    ON public.fixture (date);

CREATE INDEX idx_fixture_team_home
    ON public.fixture (team_home_id);

CREATE INDEX idx_fixture_team_away
    ON public.fixture (team_away_id);