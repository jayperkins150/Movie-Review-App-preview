import './WatchList.css'
import PropTypes from 'prop-types'
import RatingIcon from './images/RatingIcon.png'

export const WatchList = ({movie}) => {
  return (
    <a
        href={`https://www.themoviedb.org/movie/${movie.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="movie-catalogue"
    >
        <div className="image-wrapper">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                className="movie-img"
                alt="Movie details"
            />
        </div>

        <div className="movie-details">
            <h3 className="movie-details-h3">{movie.original_title}</h3>
            
            <div className="center_ele movie-date">
                <p>
                    {movie.release_date}
                </p>
                <p>
                    {movie.vote_average}
                    <img className="rating-class" alt="Rating icon" src={RatingIcon} />
                </p>
            </div>

            <p className="movie-description">
                {(movie.overview || 'No description available.').slice(0, 175) + "..."}
            </p>
        </div>
    </a>
  );
};

WatchList.propTypes={
    movie: PropTypes.shape({
        id: PropTypes.number.isRequired,
        poster_path: PropTypes.string,
        original_title: PropTypes.string.isRequired,
        release_date: PropTypes.string,
        vote_average: PropTypes.number,
        overview: PropTypes.string,
    }).isRequired,
}

