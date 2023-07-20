import { useEffect, useState } from "react";

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

const key = "ec57ae9c";

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function Search({ handleMovieChange, tempMovieName }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      onChange={(e) => {
        handleMovieChange(e.target.value);
      }}
      value={tempMovieName}
    />
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function MovieCount({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length || 0}</strong> results
    </p>
  );
}

function NavBar({ children, handleMovieChange, tempMovieName }) {
  return (
    <nav className="nav-bar">
      <Logo />
      <Search
        handleMovieChange={handleMovieChange}
        tempMovieName={tempMovieName}
      />
      {children}
    </nav>
  );
}

function MovieCard({ movie, handleSelectedId }) {
  return (
    <li onClick={() => handleSelectedId(movie.imdbID)}>
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

function SearchedMovies({ movies, isLoading, error, handleSelectedId }) {
  const [isOpen1, setIsOpen1] = useState(true);
  const renderMoviesCard = movies?.map((movie) => (
    <MovieCard
      movie={movie}
      key={movie.imdbID}
      handleSelectedId={handleSelectedId}
    />
  ));
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMsg errorMessage={error} />
      ) : (
        <>
          <ToggleBtn setIsOpen={setIsOpen1}>{isOpen1 ? "–" : "+"}</ToggleBtn>
          {isOpen1 && <ul className="list list-movies">{renderMoviesCard}</ul>}
        </>
      )}
    </>
  );
}

function Box({ children }) {
  return <div className="box">{children}</div>;
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
    <>
      <ToggleBtn setIsOpen={setIsOpen2}>{isOpen2 ? "–" : "+"}</ToggleBtn>
      {isOpen2 && (
        <>
          <WatchedMoviesSummary watched={watched} />
          <ul className="list">{renderWatchedMovies}</ul>
        </>
      )}
    </>
  );
}

function SelectedMovieDetial({ selectedMovieId, handleMovieDetialClose }) {
  const [movieDetials, setMovieDetials] = useState("");
  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movieDetials;
  useEffect(() => {
    async function fetchMovieDetials() {
      const res = await fetch(
        `https://www.omdbapi.com/?i=${selectedMovieId}&apikey=${key}`
      );
      const data = await res.json();
      setMovieDetials(data);
    }
    fetchMovieDetials();
  }, [selectedMovieId]);

  return (
    <div className="details">
      {/* {isLoading ? (
        <Loader />
      ) :  */}
      (
      <>
        <header>
          <button className="btn-back" onClick={handleMovieDetialClose}>
            &larr;
          </button>
          <img src={poster} alt="movie poster" />
          <div className="details-overview">
            <h2>{title}</h2>
            <p>
              {released} &bull; {runtime}
            </p>
            <p>{genre}</p>
            <p>
              <span>⭐️</span>
              {imdbRating} IMDb rating
            </p>
          </div>
        </header>
        <section>
          {/* <div className="rating">
            {!isWatched ? (
              <>
                <StarRating
                  maxRating={10}
                  size={24}
                  onSetRating={setUserRating}
                />
                {userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to list
                  </button>
                )}
              </>
            ) : (
              <p>
                You rated with movie {watchedUserRating} <span>⭐️</span>
              </p>
            )}
          </div> */}
          <p>
            <em>{plot}</em>
          </p>
          <p>Starring {actors}</p>
          <p>Directed by {director}</p>
        </section>
      </>
      ){/* } */}
    </div>
  );
}

function ErrorMsg({ errorMessage }) {
  return <p className="error">{errorMessage}</p>;
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [tempMovieName, setTempMovieName] = useState("");
  const [error, setError] = useState(null);
  const [selectedMovieID, setSelectedMovieID] = useState(null);
  const handleMovieDetialClose = function () {
    setSelectedMovieID(null);
  };
  const handleSelectedId = function (id) {
    setSelectedMovieID((prevSelectedId) => (id === prevSelectedId ? null : id));
  };
  useEffect(
    () =>
      async function () {
        try {
          if (!tempMovieName) return "";
          setIsLoading(true);
          setError(null);
          let res = await fetch(
            `https://www.omdbapi.com/?s=${tempMovieName}&apikey=${key}`
          );
          if (!res.ok) throw new Error("Somthing Went Wrong");

          let data = await res.json();
          if (data.Response === "True") {
            setMovies(data.Search);
          } else throw new Error("⛔ Movies Not Found");
        } catch (err) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      },
    [tempMovieName]
  );
  return (
    <>
      <NavBar
        handleMovieChange={setTempMovieName}
        tempMovieName={tempMovieName}
      >
        <MovieCount movies={movies} />
      </NavBar>

      <Main>
        <Box>
          <SearchedMovies
            movies={movies}
            isLoading={isLoading}
            error={error}
            handleSelectedId={handleSelectedId}
          />
        </Box>
        <Box>
          {selectedMovieID ? (
            <SelectedMovieDetial
              selectedMovieId={selectedMovieID}
              handleMovieDetialClose={handleMovieDetialClose}
            />
          ) : (
            <WatchedMovies />
          )}
        </Box>
      </Main>
    </>
  );
}
