import { Tournament } from '../lib/data';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
  useMap,
} from '@vis.gl/react-google-maps';
import { useState } from 'react';

type Props = {
  tournaments: Tournament[];
};

export function MapMarkers({ tournaments }: Props) {
  return (
    <>
      {tournaments.map((tournament) => {
        return <MapMarker key={tournament.id} tournament={tournament} />;
      })}
    </>
  );
}
type MarkerProp = {
  tournament: Tournament;
};

function MapMarker({ tournament }: MarkerProp) {
  const [infoWindowOpen, setInfoWindowOpen] = useState<boolean>(false);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const map = useMap();
  return (
    <>
      <AdvancedMarker
        position={{
          lat: Number(tournament.lat),
          lng: Number(tournament.lng),
        }}
        ref={markerRef}
        onClick={() => {
          setInfoWindowOpen(true);
          console.log('clicked marker');
          map?.panTo({
            lat: Number(tournament.lat),
            lng: Number(tournament.lng),
          });
        }}
      />
      {infoWindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={150}
          onCloseClick={() => setInfoWindowOpen(false)}>
          <h2>{tournament.name}</h2>
          <h4>{tournament.address}</h4>
          {tournament.days}
          <br />
          {tournament.hours}
        </InfoWindow>
      )}
    </>
  );
}
