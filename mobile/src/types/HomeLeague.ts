export interface NextFixture {
    id: number;
    date: string;
    homeTeamId: number;
    homeTeam: string;
    homeTeamLogo: string;

    awayTeamId: number;
    awayTeam: string;
    awayTeamLogo: string;    
}

export interface HomeLeague {
    id: number;
    name: string;
    country: string;
    logo: string;
    nextFixture?: NextFixture;
}