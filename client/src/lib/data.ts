export type Tournament = {
  id?: number;
  name: string;
  address: string;
  days: string;
  hours: string;
  notes?: string;
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
