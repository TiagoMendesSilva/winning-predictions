ALTER TABLE fixture
DROP COLUMN team_home_id;

ALTER TABLE fixture
DROP COLUMN team_home_name;

ALTER TABLE fixture
DROP COLUMN team_home_logo;


ALTER TABLE fixture
DROP COLUMN team_away_id;

ALTER TABLE fixture
DROP COLUMN team_away_name;

ALTER TABLE fixture
DROP COLUMN team_away_logo;


ALTER TABLE fixture
    ADD COLUMN team_home_id BIGINT;


ALTER TABLE fixture
    ADD COLUMN team_away_id BIGINT;


ALTER TABLE fixture
    ADD CONSTRAINT fk_fixture_home_team
        FOREIGN KEY(team_home_id)
            REFERENCES team(id);


ALTER TABLE fixture
    ADD CONSTRAINT fk_fixture_away_team
        FOREIGN KEY(team_away_id)
            REFERENCES team(id);