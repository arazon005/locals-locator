import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import TournamentDetails from './pages/TournamentDetails';
import TournamentList from './pages/TournamentList';
import './App.css';
import './layout.css';
import TournamentForm from './pages/TournamentForm';
import { APIProvider } from '@vis.gl/react-google-maps';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route index element={<Home />} />
        <Route
          path="/tournaments"
          element={
            <APIProvider apiKey={'AIzaSyChDtIz2R4IQ29gvpWZyEJI-fgzE2V2y_I'}>
              <TournamentList />
            </APIProvider>
          }
        />
        <Route path="/tournaments/:id" element={<TournamentDetails />} />
        <Route path="/tournaments/edit/:id" element={<TournamentForm />} />
      </Route>
    </Routes>
  );
}
