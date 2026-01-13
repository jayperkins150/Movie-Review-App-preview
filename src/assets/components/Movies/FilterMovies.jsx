import PropTypes from "prop-types";

const FilterMovies = ({ givingRating, onRatingButtonClick, ratings }) => {
  return (
    <div className="rating-filter">
      {ratings.map((rating) => (
        <button
          key={rating}
          onClick={() => onRatingButtonClick(rating)}
          className={givingRating === rating ? "active" : ""}
        >
          {rating}+
        </button>
      ))}
    </div>
  );
};

FilterMovies.propTypes = {
  givingRating: PropTypes.number.isRequired,
  onRatingButtonClick: PropTypes.func.isRequired,
  ratings: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default FilterMovies;
