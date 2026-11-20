export interface League {
  id: number;
  name: string;
  localizedName: string;
  ccode: string;
  logo: string;
  nextMatch?: NextMatch;
  
  
  //id: number;
  //name: string;
  //country: string;
  //logoUrl: string;
  //logo: string | null; // ← base64
  //nextMatch?: NextMatch;
}

export interface NextMatch {
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  date: string;
}
