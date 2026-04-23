const API_KEY = import.meta.env.VITE_SPORTSDB_KEY ?? "123";
const BASE = `https://www.thesportsdb.com/api/v1/json/${API_KEY}`;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API error ${res.status} on ${path}`);
  const text = await res.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export interface Sport {
  idSport: string;
  strSport: string;
  strFormat: string;
  strSportThumb: string;
  strSportIconGreen: string;
  strSportDescription: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strLeagueAlternate?: string;
  strSport: string;
  strCountry?: string;
  strCurrentSeason?: string;
  intFormedYear?: string;
  strGender?: string;
  strDescriptionEN?: string;
  strBadge?: string;
  strLogo?: string;
  strBanner?: string;
  strPoster?: string;
  strTrophy?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strWebsite?: string;
}

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamAlternate?: string;
  strTeamShort?: string;
  intFormedYear?: string;
  strSport: string;
  strLeague: string;
  idLeague: string;
  strStadium?: string;
  strStadiumLocation?: string;
  strStadiumThumb?: string;
  strCountry?: string;
  strDescriptionEN?: string;
  strBadge?: string;
  strLogo?: string;
  strBanner?: string;
  strEquipment?: string;
  strFanart1?: string;
  strFanart2?: string;
  strFanart3?: string;
  strFanart4?: string;
  strWebsite?: string;
  strKeywords?: string;
  strGender?: string;
}

export interface Player {
  idPlayer: string;
  idTeam: string;
  strPlayer: string;
  strNationality?: string;
  strTeam?: string;
  strSport?: string;
  strPosition?: string;
  strThumb?: string;
  strCutout?: string;
  strRender?: string;
  strBanner?: string;
  dateBorn?: string;
  strBirthLocation?: string;
  strHeight?: string;
  strWeight?: string;
  strDescriptionEN?: string;
  strEthnicity?: string;
  strNumber?: string;
  strWage?: string;
  strGender?: string;
  strStatus?: string;
}

export interface SportEvent {
  idEvent: string;
  strEvent: string;
  strEventAlternate?: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason?: string;
  strHomeTeam?: string;
  strAwayTeam?: string;
  idHomeTeam?: string;
  idAwayTeam?: string;
  intHomeScore?: string;
  intAwayScore?: string;
  dateEvent?: string;
  strTime?: string;
  strTimestamp?: string;
  strVenue?: string;
  strCountry?: string;
  strThumb?: string;
  strStatus?: string;
}

export const api = {
  allSports: () =>
    getJson<{ sports: Sport[] }>(`/all_sports.php`).then((d) => d.sports ?? []),

  leaguesBySport: (sport: string) =>
    getJson<{ countries: League[] | null }>(
      `/search_all_leagues.php?s=${encodeURIComponent(sport)}`
    ).then((d) => d.countries ?? []),

  lookupLeague: (id: string) =>
    getJson<{ leagues: League[] | null }>(
      `/lookupleague.php?id=${encodeURIComponent(id)}`
    ).then((d) => d.leagues?.[0]),

  teamsByLeague: (league: string) =>
    getJson<{ teams: Team[] | null }>(
      `/search_all_teams.php?l=${encodeURIComponent(league)}`
    ).then((d) => d.teams ?? []),

  lookupTeam: (id: string) =>
    getJson<{ teams: Team[] | null }>(
      `/lookupteam.php?id=${encodeURIComponent(id)}`
    ).then((d) => d.teams?.[0]),

  playersByTeam: (teamId: string) =>
    getJson<{ player: Player[] | null }>(
      `/lookup_all_players.php?id=${encodeURIComponent(teamId)}`
    ).then((d) => d.player ?? []),

  lookupPlayer: (id: string) =>
    getJson<{ players: Player[] | null }>(
      `/lookupplayer.php?id=${encodeURIComponent(id)}`
    ).then((d) => d.players?.[0]),

  nextLeagueEvents: (leagueId: string) =>
    getJson<{ events: SportEvent[] | null }>(
      `/eventsnextleague.php?id=${encodeURIComponent(leagueId)}`
    ).then((d) => d.events ?? []),

  pastLeagueEvents: (leagueId: string) =>
    getJson<{ events: SportEvent[] | null }>(
      `/eventspastleague.php?id=${encodeURIComponent(leagueId)}`
    ).then((d) => d.events ?? []),

  nextTeamEvents: (teamId: string) =>
    getJson<{ events: SportEvent[] | null }>(
      `/eventsnext.php?id=${encodeURIComponent(teamId)}`
    ).then((d) => d.events ?? []),

  lastTeamEvents: (teamId: string) =>
    getJson<{ results: SportEvent[] | null }>(
      `/eventslast.php?id=${encodeURIComponent(teamId)}`
    ).then((d) => d.results ?? []),

  searchTeams: (q: string) =>
    getJson<{ teams: Team[] | null }>(
      `/searchteams.php?t=${encodeURIComponent(q)}`
    ).then((d) => d.teams ?? []),

  searchEvents: (q: string) =>
    getJson<{ event: SportEvent[] | null }>(
      `/searchevents.php?e=${encodeURIComponent(q)}`
    ).then((d) => d.event ?? []),

  eventsDay: (date: string, sport?: string) =>
    getJson<{ events: SportEvent[] | null }>(
      `/eventsday.php?d=${date}${sport ? `&s=${encodeURIComponent(sport)}` : ""}`
    ).then((d) => d.events ?? []),

  lookupEvent: (id: string) =>
    getJson<{ events: SportEvent[] | null }>(
      `/lookupevent.php?id=${encodeURIComponent(id)}`
    ).then((d) => d.events?.[0]),

  playerHonours: (playerId: string) =>
    getJson<{ honours: Honour[] | null }>(
      `/lookuphonours.php?id=${encodeURIComponent(playerId)}`
    ).then((d) => d.honours ?? []),

  playerFormerTeams: (playerId: string) =>
    getJson<{ formerteams: FormerTeam[] | null }>(
      `/lookupformerteams.php?id=${encodeURIComponent(playerId)}`
    ).then((d) => d.formerteams ?? []),

  playerContracts: (playerId: string) =>
    getJson<{ contracts: Contract[] | null }>(
      `/lookupcontracts.php?id=${encodeURIComponent(playerId)}`
    ).then((d) => d.contracts ?? []),

  teamEquipment: (teamId: string) =>
    getJson<{ equipment: Equipment[] | null }>(
      `/lookupequipment.php?id=${encodeURIComponent(teamId)}`
    ).then((d) => d.equipment ?? []),
};

export interface Honour {
  id: string;
  idPlayer: string;
  idTeam: string;
  idLeague: string;
  idHonour: string;
  strSport: string;
  strPlayer: string;
  strTeam: string;
  strTeamBadge?: string;
  strHonour: string;
  strHonourLogo?: string;
  strSeason?: string;
}

export interface FormerTeam {
  id: string;
  idPlayer: string;
  idFormerTeam: string;
  strSport: string;
  strPlayer: string;
  strFormerTeam: string;
  strMoveType?: string;
  strBadge?: string;
  strJoined?: string;
  strDeparted?: string;
}

export interface Contract {
  id: string;
  idPlayer: string;
  idTeam: string;
  strSport: string;
  strPlayer: string;
  strTeam: string;
  strBadge?: string;
  strYearStart?: string;
  strYearEnd?: string;
  strWage?: string;
}

export interface Equipment {
  idEquipment: string;
  idTeam: string;
  date: string;
  strSeason: string;
  strEquipment: string;
  strType: string;
  strUsername: string;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
