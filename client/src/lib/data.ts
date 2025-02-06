export type Tournament = {
  id?: number;
  name: string;
  address: string;
  days: string;
  hours: string;
  games?: string;
  notes?: string;
  lat: number;
  lng: number;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

type Games = {
  games: string;
};
//gets the details of a tournament
export async function readTournament(id: number): Promise<Tournament> {
  const req = {
    method: 'GET',
  };
  const res = await fetch(`/api/tournaments/${id}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Tournament;
}

//returns an array of tournaments
export async function readTournaments(): Promise<Tournament[]> {
  const req = {
    method: 'GET',
  };
  const res = await fetch(`/api/tournaments`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  return (await res.json()) as Tournament[];
}

export async function readTournamentGames(id: number): Promise<string[]> {
  const req = {
    method: 'GET',
  };
  const res = await fetch(`/api/games/${id}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  const result = (await res.json()) as Games;
  const resString = result.games.split(' ');
  return resString as string[];
}

export async function addTournament(
  tournament: Tournament
): Promise<Tournament> {
  const req = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tournament),
  };
  const res = await fetch('/api/tournaments', req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  const result = (await res.json()) as Tournament;
  console.log(result);
  return result;
}

export async function updateTournament(
  tournament: Tournament
): Promise<Tournament> {
  const req = {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tournament),
  };
  const res = await fetch(`/api/tournaments/${tournament.id}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
  const result = (await res.json()) as Tournament;
  console.log(result);
  return result;
}

export async function deleteTournament(id: number): Promise<void> {
  const req = {
    method: 'DELETE',
  };
  const res = await fetch(`/api/tournaments/${id}`, req);
  if (!res.ok) throw new Error(`fetch Error ${res.status}`);
}
