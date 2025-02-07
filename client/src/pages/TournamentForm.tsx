import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  addTournament,
  Coordinates,
  deleteTournament,
  readTournament,
  readTournamentGames,
  Tournament,
  updateTournament,
} from '../lib/data';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

export default function TournamentForm() {
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  const [tournament, setTournament] = useState<Tournament>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [tournamentDays, setTournamentDays] = useState<string[]>([]);
  const [tournamentHours, setTournamentHours] = useState<string[]>([]);
  const [tournamentGames, setTournamentGames] = useState<string[]>([]);
  const [defaultStartValue, setDefaultStartValue] = useState<
    string | undefined
  >(undefined);
  const [defaultEndValue, setDefaultEndValue] = useState<string | undefined>(
    undefined
  );
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const navigate = useNavigate();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const times = [
    '1AM',
    '2AM',
    '3AM',
    '4AM',
    '5AM',
    '6AM',
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
    '7PM',
    '8PM',
    '9PM',
    '10PM',
    '11PM',
    '12AM',
  ];
  const games = ['UNI2', 'T8', 'SF6', 'GGST', 'MBTL', 'MK1'];
  useEffect(() => {
    async function load(id: number) {
      setIsLoading(true);
      try {
        const tournament = await readTournament(id);
        if (!tournament)
          throw new Error(`Tournament with ID ${id} could not be found`);
        setTournament(tournament);
        setTournamentDays(tournament.days.split(' '));
        setTournamentHours(tournament.hours.split(' '));
        const tournamentGames = await readTournamentGames(id);
        setTournamentGames(tournamentGames);
        console.log(tournamentGames);
        if (geocodingLib) {
          console.log('geocodingLib loaded');
        }
      } catch (err) {
        setError(err);
      } finally {
        if (!geocoder) {
          setGeocoder(new window.google.maps.Geocoder());
        }
        setIsLoading(false);
      }
    }
    async function loadGeocoder() {
      if (!geocoder) {
        setGeocoder(new window.google.maps.Geocoder());
      }
    }
    if (isEditing) load(+id);
    else loadGeocoder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geocoder]);

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <div>Error Loading Tournament</div>;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const tournamentData = Object.fromEntries(formData) as any;
    const days = formData.getAll('days') as string[];
    const daysString = days.join(' ');
    console.log('before geocoding');
    const coordinates = await geocodeAddress(tournamentData.address);
    console.log('after geocoding');
    const hours = tournamentData.startingHour + ' ' + tournamentData.endingHour;
    const games = formData.getAll('games') as string[];
    const gamesString = games.join(' ');
    const newTournament: Tournament = {
      name: tournamentData.name,
      address: tournamentData.address,
      days: daysString,
      hours: hours,
      games: gamesString,
      notes: tournamentData.notes,
      lat: coordinates.lat,
      lng: coordinates.lng,
    };
    if (isEditing) {
      newTournament.id = Number(id);
      console.log(newTournament);
      console.log(await updateTournament(newTournament));
    } else {
      console.log(await addTournament(newTournament));
    }
    navigate('/tournaments');
  }
  async function handleDelete() {
    await deleteTournament(Number(id));
    navigate('/tournaments');
  }
  async function geocodeAddress(address: string): Promise<Coordinates> {
    const coordinates = { lat: 0, lng: 0 };
    if (!geocoder) throw new Error('this broke');
    await geocoder.geocode({ address }, (results, status) => {
      if (results && status === 'OK') {
        coordinates.lat = results[0].geometry.location.lat();
        coordinates.lng = results[0].geometry.location.lng();
      }
    });
    return coordinates;
  }

  return (
    <div className="form bg-white">
      <h1>{isEditing ? 'Edit Tournament' : 'New Tournament'}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          <h1>Name</h1>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Tournament name here"
          defaultValue={isEditing ? tournament?.name : ''}
        />
        <label htmlFor="address">
          <h1>Address</h1>
        </label>
        <input
          type="text"
          name="address"
          placeholder="1234 Address Way Los Angeles, CA 90000"
          defaultValue={isEditing ? tournament?.address : ''}
        />
        <h1>Days</h1>
        <div>
          {days.map((day) => (
            <DayProps key={day} day={day} />
          ))}
        </div>
        <div>
          <h1>Hours</h1>
          <select name="startingHour" defaultValue={defaultStartValue}>
            {times.map((hour) => (
              <Hours key={hour} hour={hour} comparison={0} />
            ))}
          </select>{' '}
          to{' '}
          <select name="endingHour" defaultValue={defaultEndValue}>
            {times.map((hour) => (
              <Hours key={hour} hour={hour} comparison={1} />
            ))}
          </select>
        </div>
        <div>
          <h1>Games</h1>
          {games.map((game) => (
            <Games key={game} game={game} />
          ))}
        </div>
        <div>
          <textarea
            name="notes"
            defaultValue={isEditing ? tournament?.notes : ''}
          />
        </div>
        <div>
          <input type="submit" value={isEditing ? 'Save' : 'Submit'} />
          {isEditing && (
            <button type="button" onDoubleClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      </form>
    </div>
  );

  type DayProps = {
    day: string;
  };
  function DayProps({ day }: DayProps) {
    return (
      <label>
        <input
          type="checkbox"
          name="days"
          value={day}
          defaultChecked={
            isEditing && tournamentDays.includes(day) ? true : false
          }
        />
        {day}
      </label>
    );
  }

  type HourProps = {
    hour: string;
    comparison: number;
  };
  function Hours({ hour, comparison }: HourProps) {
    useEffect(() => {
      if (comparison === 0 && isEditing && tournamentHours[0] === hour) {
        setDefaultStartValue(hour);
      } else if (comparison === 1 && isEditing && tournamentHours[1] === hour) {
        setDefaultEndValue(hour);
      }
    }, []);
    return <option value={hour}>{hour}</option>;
  }

  type GameProps = {
    game: string;
  };
  function Games({ game }: GameProps) {
    return (
      <label>
        <input
          type="checkbox"
          value={game}
          name="games"
          defaultChecked={
            isEditing && tournamentGames.includes(game) ? true : false
          }
        />
        {game}
      </label>
    );
  }
}
