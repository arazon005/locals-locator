/* eslint-disable @typescript-eslint/no-unused-vars */
import { FormEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { readTournament, Tournament } from '../lib/data';

export default function TournamentForm() {
  const { id } = useParams();
  const isEditing = id && id !== 'new';
  const [tournament, setTournament] = useState<Tournament>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [tournamentDays, setTournamentDays] = useState<string[]>([]);
  const [tournamentHours, setTournamentHours] = useState<string[]>([]);
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Sat'];
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
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    if (isEditing) load(+id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return <div>Error Loading Tournament</div>;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTournament = Object.fromEntries(formData);
    console.log(newTournament);
  }

  return (
    <div className="form">
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
            <DayProps day={day} dayComparison={tournamentDays} />
          ))}
        </div>
        <div>
          <h1>Hours</h1>
          <select name="startingHour">
            {times.map((hour) => (
              <Hours hour={hour} comparison={0} />
            ))}
          </select>{' '}
          to{' '}
          <select name="endingHour">
            {times.map((hour) => (
              <Hours hour={hour} comparison={1} />
            ))}
          </select>
        </div>
        <div>
          <h1>Games</h1>
        </div>
        <div>
          <input type="submit" value={isEditing ? 'Save' : 'Submit'} />
        </div>
      </form>
    </div>
  );

  type DayProps = {
    day: string;
    dayComparison: string[];
  };
  function DayProps({ day }: DayProps) {
    return (
      <label>
        <input
          type="checkbox"
          name={day}
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
    return (
      <option
        value={hour}
        selected={
          isEditing && tournamentHours[comparison] === hour ? true : false
        }>
        {hour}
      </option>
    );
  }
}
