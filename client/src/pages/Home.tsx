export default function Home() {
  return (
    <>
      <div className="home">
        <p className="home-image">
          <img src="https://images.start.gg/images/tournament/652424/image-7c939694691834c4596238b1b7a11421.jpg?ehk=2Ekej1j36z3e7fgtrYFJvQLZ%2FZfCVpy%2BmEKQy41mCQ8%3D&ehkOptimized=AQA96pAo7BPb1DLepSFx7KfDro7Hg59wgWekBtVL%2FvI%3D" />
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
