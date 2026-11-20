
import { NavigatorScreenParams } from '@react-navigation/native';

export type ChampionshipsStackParamList = {
  Home: undefined;

  ChampionshipFixtures: {
    leagueId: number;
    leagueName: string;
    season: number;
  };

  MakePrediction: {
    fixtureId: number;
    leagueName: string;
    kickoffDate: string;
    homeTeam: string;
    awayTeam: string;
    homeTeamLogo: string | null;
    awayTeamLogo: string | null;
  };
};

export type MainTabParamList = {
  Campeonatos:
    | NavigatorScreenParams<ChampionshipsStackParamList>
    | undefined;

  Palpites: undefined;

  Ranking: undefined;

  Perfil: undefined;
};

export type RootStackParamList = {
  Login: undefined;

  MainTabs: NavigatorScreenParams<MainTabParamList> | undefined;
};
