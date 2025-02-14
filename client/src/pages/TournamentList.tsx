import { useEffect, useState } from 'react';
import { Coordinates, Tournament, readTournaments } from '../lib/data';
import { Link } from 'react-router-dom';
import { Map, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapMarkers } from '../components/MapMarkers';

export default function TournamentList() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();
  const geocodingLib = useMapsLibrary('geocoding');
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder>();
  const map = useMap();

  useEffect(() => {
    async function load() {
      try {
        const tournaments = (await readTournaments()) as Tournament[];
        setTournaments(tournaments);
        if (!geocoder) {
          setGeocoder(new window.google.maps.Geocoder());
        }
        setIsLoading(false);
        if (geocodingLib) {
          console.log('geocodingLib loaded');
        }
      } catch (err) {
        setError(err);
      }
    }
    load();
  }, [geocoder]);

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
          mapId="12"
          defaultZoom={10}
          defaultCenter={{
            lat: 34.06264734617613,
            lng: -117.8295665653417,
          }}>
          <MapMarkers tournaments={tournaments} />
        </Map>
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
      map?.panTo(
        new google.maps.LatLng({ lat: location.lat, lng: location.lng })
      );
    }
    return (
      <div className="tournament-card">
        <Link to={`./edit/${tournament.id}`}>
          <h2>{tournament.name}</h2>
        </Link>
        <p onClick={handleCardClick}>{tournament.address}</p>
      </div>
    );
  }
}
