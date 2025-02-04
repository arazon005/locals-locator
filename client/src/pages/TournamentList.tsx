import { useEffect, useState } from 'react';
import { Tournament, readTournaments } from '../lib/data';
import { Link } from 'react-router-dom';
import { Map, useMapsLibrary } from '@vis.gl/react-google-maps';

export interface Coordinates {
  lat: number;
  lng: number;
}

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const [center, setCenter] = useState<Coordinates>({
    lat: 34.06264734617613,
    lng: -118.12956656534173,
  });
  const [locations, setLocations] = useState<Coordinates[]>([]);

  useEffect(() => {
    async function load() {
      async function geocodeTournaments(
        tournaments: Tournament[]
      ): Promise<void> {
        console.log('this also works');
        const coordinates: Coordinates[] = [];
        for (let i = 0; i < tournaments.length; i++) {
          const location = await geocodeAddress(tournaments[i].address);
          console.log(location);
          coordinates.push(location);
        }
        console.log(
          'coordinates value within geocodeTournaments(): ',
          coordinates
        );
        setLocations(coordinates);
      }
      try {
        if (!tournaments.length) {
          const tournaments = (await readTournaments()) as Tournament[];
          setTournaments(tournaments);
        }
        if (!geocoder) {
          setGeocoder(new window.google.maps.Geocoder());
        }
        await geocodeTournaments(tournaments);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
        console.log('useState locations array: ', locations);
      }
    }
    load();
  }, [geocoder]);

  useEffect(() => {});

  async function geocodeAddress(address: string): Promise<Coordinates> {
    const coordinates = { lat: 0, lng: 0 };
    await geocoder?.geocode({ address }, (results, status) => {
      if (results && status === 'OK') {
        coordinates.lat = results[0].geometry.location.lat();
        coordinates.lng = results[0].geometry.location.lng();
      }
    });
    return coordinates;
  }

  if (isLoading) return <div>Loading...</div>;
  if (error) {
    return (
      <div>
        Error Loading Tournaments:{' '}
        {error instanceof Error ? error.message : 'Unknown Error'}{' '}
      </div>
    );
  }

  return (
    <div className="main container">
      <div className="map-container">
        <Map
          defaultZoom={10}
          defaultCenter={center}
          // onCameraChanged={(ev: MapCameraChangedEvent) =>
          //   console.log(
          //     'camera changed:',
          //     ev.detail.center,
          //     'zoom:',
          //     ev.detail.zoom
          //   )
          // }
        ></Map>
      </div>
      <div className="tournament-list">
        <div className="tournament-card">
          <h2>
            <Link to="./edit/new">NEW</Link>
          </h2>
        </div>
        {tournaments.map((tournament) => (
          <TournamentCard key={tournament.name} tournament={tournament} />
        ))}
      </div>
    </div>
  );

  type TournamentProps = {
    tournament: Tournament;
  };
  function TournamentCard({ tournament }: TournamentProps) {
    async function handleCardClick() {
      const location = await geocodeAddress(tournament.address);
      console.log(location);
      setCenter(location);
    }
    return (
      <div className="tournament-card">
        <Link to={`./${tournament.id}`}>
          <h2>{tournament.name}</h2>
        </Link>
        <p onClick={handleCardClick}>{tournament.address}</p>
      </div>
    );
  }
}
