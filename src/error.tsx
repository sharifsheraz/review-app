export function Error() {
  return (
    <div className="error-container">
      <img
        src="https://rickandmortyapi.com/api/character/avatar/234.jpeg"
        alt="a dead morty..."
      />
      {<h1>Error: {403}</h1>}
      <p>We are sorry! You have no access to see this resouce</p>
    </div>
  );
}
