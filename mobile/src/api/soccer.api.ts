import axios from 'axios';
import { HomeLeague } from '../types/HomeLeague';
import { api } from './api';

/*
const footballApi = axios.create({
  baseURL: 'https://v3.football.api-sports.io',
  headers: {
    'x-apisports-key': '554f6bddffd095d228cf250ac2d559bc',
  },
});
*/

export const footballApi = axios.create({
  baseURL: 'https://free-api-live-football-data.p.rapidapi.com',
  headers: {
    'Content-Type': 'application/json',
    'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
    'x-rapidapi-key': process.env.EXPO_PUBLIC_RAPIDAPI_KEY,
  },
});


export async function getHomeScreen(): Promise<HomeLeague[]> {
  const response = await api.get<HomeLeague[]>('/home');

  return response.data;
}


export interface FootballLeague {
  id: number;
  name: string;
  localizedName: string;
  ccode: string;
  logo: string;
}

export const getAllLeagues = async (): Promise<FootballLeague[]> => {
  const { data } = await footballApi.get(
    '/football-get-all-leagues'
  );

  console.log(
    'LEAGUES:',
    JSON.stringify(data, null, 2)
  );

  return data.response.leagues;
};

export interface NextMatch {
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  date: string;
}

const LEAGUE_MAP: Record<number, (leagueId: number) => boolean> = {
  1: (id) => id >= 894790 && id <= 894830, // Copa do Mundo
  13: (id) => id === 78,                   // Mundial de Clubes
  71: (id) => id === 268,                  // Brasileirão
  73: (id) => id === 9067,                 // Copa do Brasil
};

export const getNextFixture = async (
  leagueId: number
): Promise<NextMatch | null> => {
  try {
    const date = new Date()
      .toISOString()
      .split('T')[0]
      .replaceAll('-', '');

    const { data } = await footballApi.get(
      '/football-get-matches-by-date',
      {
        params: { date },
      }
    );

    const matches = data.response.matches;

    const leagueMatches = matches.filter(
      (m: any) =>
        LEAGUE_MAP[leagueId]?.(m.leagueId) &&
        !m.status.cancelled
    );

    if (!leagueMatches.length) {
      return null;
    }

    const match = leagueMatches[0];

    const fixtureDate = new Date(
      match.status.utcTime
    );

    const timeStr = fixtureDate.toLocaleTimeString(
      'pt-BR',
      {
        hour: '2-digit',
        minute: '2-digit',
      }
    );

    return {
      homeTeam: match.home.name,
      awayTeam: match.away.name,

      // API não possui logo
      homeLogo: '',
      awayLogo: '',

      date: `Hoje • ${timeStr}`,
    };
  } catch (error) {
    console.error(error);
    return null;
  }
};

export interface Prediction {
  id:number;
  fixtureId: number;
  homeGoals: number;
  awayGoals: number;
  createdAt: string;
}

export async function getUserPredictions(): Promise<Prediction[]> {
  const response = await api.get<Prediction[]>('/predictions/user');
  return response.data;
}


/*
export const getNextFixture = async (leagueId: number): Promise<NextMatch | null> => {
  try {

    const today = new Date();
    const tomorrow = new Date(today.getTime() + 86400000);

    const from = today.toISOString().split('T')[0];       // "2025-06-15"
    const to = tomorrow.toISOString().split('T')[0];      // "2025-06-16"
    const { data } = await footballApi.get('/fixtures', {
      params: { league: leagueId, 
        season: SEASON, 
        from, to, 
        //status: 'NS'// NS = Not Started, só jogos ainda não iniciados 
    },
    });
  
    console.log(`FIXTURE [${leagueId}] total: ${data.results}`);
    console.log(`FIXTURE [${leagueId}] errors:`, JSON.stringify(data.errors));
    // Loga o primeiro fixture cru pra ver a estrutura
    console.log(`FIXTURE [${leagueId}] primeiro:`, JSON.stringify(data.response?.[0]?.fixture));  

    const fixture = data.response?.[0];
    if (!fixture) return null;

    const fixtureDate = new Date(fixture.fixture.date);
    const now = new Date();

    const isToday = fixtureDate.toDateString() === now.toDateString();
    const isTomorrow =
      fixtureDate.toDateString() ===
      new Date(now.getTime() + 86400000).toDateString();

    const timeStr = fixtureDate.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    let dayLabel: string;
    if (isToday) dayLabel = `Hoje • ${timeStr}`;
    else if (isTomorrow) dayLabel = `Amanhã • ${timeStr}`;
    else {
      const weekday = fixtureDate.toLocaleDateString('pt-BR', { weekday: 'short' });
      dayLabel = `${weekday.charAt(0).toUpperCase()}${weekday.slice(1, 3)} • ${timeStr}`;
    }

    return {
      homeTeam: fixture.teams.home.name,
      awayTeam: fixture.teams.away.name,
      homeLogo: fixture.teams.home.logo,
      awayLogo: fixture.teams.away.logo,
      date: dayLabel,
    };
  } catch (error) {
    console.error(`Erro ao buscar fixture da liga ${leagueId}:`, error);
    return null;
  }
};
*/