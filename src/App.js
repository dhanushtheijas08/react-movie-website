import { useEffect, useState } from "react";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ handleMovieChange }) {
  const [query, setQuery] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleMovieChange(query);
      }}
    >
      <input
        className="search"
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </form>
  );
}

function MovieCount({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function NavBar({ children, handleMovieChange }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search handleMovieChange={handleMovieChange} />
      {children}
    </nav>
  );
}

function MovieCard({ movie }) {
  return (
    <li>
      <img src={movie.Poster} alt="Not Found" />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function ToggleBtn({ children, setIsOpen }) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
      {children}
    </button>
  );
}

function SearchedMovies({ movies, isLoading }) {
  const [isOpen1, setIsOpen1] = useState(true);

  const renderMoviesCard = movies?.map((movie) => (
    <MovieCard movie={movie} key={movie.imdbID} />
  ));

  if (isLoading)
    return (
      <div className="boc">
        <p>isLoading</p>
      </div>
    );
  return (
    <div className="box">
      <ToggleBtn setIsOpen={setIsOpen1}>{isOpen1 ? "–" : "+"}</ToggleBtn>
      {isOpen1 && <ul className="list">{renderMoviesCard}</ul>}
    </div>
  );
}
function WatchedMoviesSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovies() {
  const [isOpen2, setIsOpen2] = useState(true);
  const [watched, setWatched] = useState(tempWatchedData);

  const renderWatchedMovies = watched?.map((movie) => (
    <MovieCard movie={movie} key={movie.imdbID} />
  ));
  return (
    <div className="box">
      <ToggleBtn setIsOpen={setIsOpen2}>{isOpen2 ? "–" : "+"}</ToggleBtn>
      {isOpen2 && (
        <>
          <WatchedMoviesSummary watched={watched} />
          <ul className="list">{renderWatchedMovies}</ul>
        </>
      )}
    </div>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const key = "ec57ae9c";
export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempMovieName, setTempMovieName] = useState("");
  const handleMovieChange = function (newMovieName) {
    setTempMovieName(newMovieName);
  };
  useEffect(
    () =>
      async function () {
        try {
          if (!tempMovieName) return "";
          setIsLoading(true);
          let res = await fetch(
            `https://www.omdbapi.com/?s=${tempMovieName}&apikey=${key}`
          );
          if (!res.ok) throw new Error("Somthing Went Wrong");
          let data = await res.json();
          if (data.Responce === "False") throw new Error("Movies Not Found");
          setMovies(data.Search);
          setIsLoading(false);
        } catch (error) {
          console.log(error.message);
        }
      },
    [tempMovieName]
  );
  return (
    <>
      <NavBar handleMovieChange={handleMovieChange}>
        <MovieCount movies={movies} />
      </NavBar>

      <Main>
        <SearchedMovies movies={movies} isLoading={isLoading} />
        <WatchedMovies />
      </Main>
    </>
  );
}
