import React from 'react'

const FilterMovies = ({givingRating,onRatingButtonClick,ratings}) => {
    return (
        <ul className="center_ele movie-filter">
            {ratings.map((rategiven)=>(
                <li 
                    key={rategiven}
                    className={givingRating===rategiven ?"movie-filter-item active":"movie-filter-item"}
                    onClick={()=>{
                        onRatingButtonClick(rategiven);
                    }}
                >
                    &nbsp;&nbsp;{rategiven}&nbsp;&nbsp;
                </li>
            ))}
        </ul>
    );
};

export default FilterMovies;