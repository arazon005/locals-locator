import { Link, Outlet } from 'react-router-dom';

export default function Header() {
  return (
    <>
      <header>
        <Link to="/">
          <h2>Home</h2>
        </Link>
        <Link to="/tournaments">
          <h2>Tournaments</h2>
        </Link>
      </header>
      <Outlet />
    </>
  );
}
