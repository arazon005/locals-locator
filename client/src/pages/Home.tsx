export default function Home() {
  return (
    <>
      <div className="home">
        <p className="home-image">
          <img src="./images/riversideMegaMonthly.jpg" />
        </p>
        <p className="home-intro">
          Welcome to my web app, which helps for fighting game players to find
          locals in SoCal (currently, functionality to filter by region will be
          added!) and plots them on a map for your convenience. The database of
          locals are currently user-uploaded and maintained.
          <br />
          <br />
          Image from Riverside Mega Monthly via{' '}
          <a href="https://x.com/PlusFramesGG">PlusFramesGG</a>
        </p>
      </div>
    </>
  );
}
