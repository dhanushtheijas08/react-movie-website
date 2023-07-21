import { useEffect, useState } from "react";
import Star from "./Star";

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

function MovieCard({ movie, handleSelectedId, handleSelectedMovie }) {
  return (
    <li
      onClick={() => {
        handleSelectedId(movie.imdbID);
        // handleSelectedMovie(movie.imdbID);
      }}
    >
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

function SearchedMovies({
  movies,
  isLoading,
  error,
  handleSelectedId,
  handleSelectedMovie,
}) {
  const [isOpen1, setIsOpen1] = useState(true);
  const renderMoviesCard = movies?.map((movie) => (
    <MovieCard
      movie={movie}
      key={movie.imdbID}
      handleSelectedId={handleSelectedId}
      handleSelectedMovie={handleSelectedMovie}
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

function WatchedMovies({ watched }) {
  const [isOpen2, setIsOpen2] = useState(true);

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

function SelectedMovieDetial({
  selectedMovieId,
  handleMovieDetialClose,
  setWatched,
}) {
  const [movieDetials, setMovieDetials] = useState("");
  const [userRating, setUserRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
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

  const changePageTitle = function () {
    if (!title) return;
    document.title = title;

    return function () {
      document.title = "usePopcorn";
    };
  };

  useEffect(changePageTitle, [title]);
  function findFirstTrueElement(arr, watchedMovieID) {
    for (const obj of arr) {
      if (obj.imdbID === watchedMovieID) return true;
    }
  }
  useEffect(() => {
    async function fetchMovieDetials() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?i=${selectedMovieId}&apikey=${key}`
        );
        const data = await res.json();
        setMovieDetials(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    }
    fetchMovieDetials();
  }, [selectedMovieId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
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
            <div className="rating">
              <Star maxRating={10} handleSetUserRating={setUserRating} />
              {userRating > 0 && (
                <button
                  className="btn-add"
                  onClick={() =>
                    setWatched((prev) => {
                      if (findFirstTrueElement(prev, movieDetials.imdbID))
                        return [...prev];

                      return [...prev, movieDetials];
                    })
                  }
                >
                  + Add to list
                </button>
              )}
            </div>
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
      )}
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
  const [watched, setWatched] = useState(function () {
    const storedMovieList = localStorage.getItem("watchedMoviesList");
    const moviesList = JSON.parse(storedMovieList);
    console.log(moviesList.Title);

    return moviesList;
  });
  // const [isWatched, setIsWatched] = useState(false);
  const handleMovieDetialClose = function () {
    setSelectedMovieID(null);
  };

  const handleSelectedMovie = function (id) {
    for (const watchedMovieList of watched) {
      console.log(watchedMovieList.imdbID === id);
    }
  };
  const handleSelectedId = function (id) {
    setSelectedMovieID((prevSelectedId) => (id === prevSelectedId ? null : id));
  };
  useEffect(() => {
    function escapeKey(event) {
      if (event.key !== "Escape") return;
      handleMovieDetialClose();
    }
    document.addEventListener("keydown", escapeKey);

    return function () {
      document.removeEventListener("keydown", escapeKey);
    };
  }, []);
  useEffect(
    function searchMoviRequest() {
      async function callMovie() {
        const controller = new AbortController();
        try {
          if (!tempMovieName) return "";
          setIsLoading(true);
          setError(null);
          let res = await fetch(
            `https://www.omdbapi.com/?s=${tempMovieName}&apikey=${key}`,
            { signal: controller.signal }
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

        return function () {
          controller.abort();
        };
      }
      callMovie();
    },
    [tempMovieName]
  );

  useEffect(
    function () {
      const moviesList = JSON.stringify(watched);
      localStorage.setItem("watchedMoviesList", moviesList);
    },
    [watched]
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
            handleSelectedMovie={handleSelectedMovie}
          />
        </Box>
        <Box>
          {selectedMovieID ? (
            <SelectedMovieDetial
              setWatched={setWatched}
              selectedMovieId={selectedMovieID}
              handleMovieDetialClose={handleMovieDetialClose}
            />
          ) : (
            <WatchedMovies watched={watched} />
          )}
        </Box>
      </Main>
    </>
  );
}
