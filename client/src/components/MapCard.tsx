/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  useAdvancedMarkerRef,
} from '@vis.gl/react-google-maps';
import { Tournament } from '../lib/data';
import { Coordinates } from '../pages/TournamentList';

type Props = {
  tournament: Tournament;
  coordinates: Coordinates;
};
