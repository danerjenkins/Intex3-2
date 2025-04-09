import { useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { Movie } from '../types/Movie';
import { MovieList } from '../components/MovieList';
import { getMovieWithId } from '../api/MoviesApi';

export default function MovieDescription(show_id: string) {
  const imgUrl = 'https://intexs3g2.blob.core.windows.net/movieposters/';
  const { showId } = useParams();
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
      getMovieWithId(show_id).then((movie) => {
         setMovie(movie);
         });
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <div className="movieInfo">
        <div className="movieInfoImage">
          <img
            // src={imgUrl + encodeURIComponent(movie.title)}
            // alt={movie.title + ' poster'}
          />
        </div>
        <div className="movieInfoText">
          <h2>Title: </h2>
          {/* <p>{movie.title}</p> */}
          <h2>Director: </h2>
          {/* <p>{movie.director}</p> */}
          <h2>Type: </h2>
          {/* <p>{movie.type}</p> */}
          <h2>Released: </h2>
          {/* <p>{movie.release_year}</p> */}
          <h2>Rating: </h2>
          {/* <p>{movie.rating}</p> */}
          <h2>Duration: </h2>
          {/* <p>{movie.duration}</p> */}
          <h2>Cast: </h2>
          {/* <p>{movie.cast}</p> */}
          <h2>Description: </h2>
          {/* <p>{movie.description}</p> */}
          <h2>Genres: </h2>
          {/* <p>{movie.genre}</p> */}
        </div>
      </div>
      <div className="d-flex flex-column min-vh-100">
        {/* <MovieList movie=movieId genre={movie.genre} type={movie.type}/> */}
      </div>

      <Footer />
    </div>
  );
}
