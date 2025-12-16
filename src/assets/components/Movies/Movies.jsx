import React, { useEffect, useState } from 'react'
import './Movies.css'
import { WatchList } from './WatchList'
import FilterMovies from './FilterMovies'

const Movies = () => {
    const [movies, setMovies] = useState([])
    const [allMoviesFiltered, setAllMoviesFiltered] = useState([])
    const [givingRating, setRating] = useState(0)
    const [sortCriteria, setSortCriteria] = useState(''); // 'release_date' or 'vote_average'
    const [sortOrder, setSortOrder] = useState('ascending'); // 'ascending' or 'descending'

    useEffect(()=>{
        fetchMovies();
    },[])
    
    // Run sorting whenever sort state or the filtered list changes
    useEffect(() => {
        applySorting();
    }, [sortCriteria, sortOrder, allMoviesFiltered]); // Re-sort when criteria changes or initial data loads

    const fetchMovies = async()=>{
        const res = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=0c7c8bda1603ada46b0f0479a3095e06")
        const data = await res.json()
        
        // Ensure vote_average is a number for sorting
        const cleanedMovies = data.results.map(movie => ({
            ...movie,
            vote_average: movie.vote_average || 0 // Default to 0 if undefined
        }));
        
        setMovies(cleanedMovies);
        setAllMoviesFiltered(cleanedMovies);
    };

    // Sorting logic function
    const applySorting = () => {
        if (!sortCriteria) {
            // If no criteria, simply reset to the full filtered list (after any rating filter)
            // If no rating filter is applied (givingRating === 0), the current movies state is already based on allMoviesFiltered
            if (givingRating === 0) {
                 setMovies(allMoviesFiltered);
            } else {
                 handleFilter(givingRating); // Re-apply rating filter to ensure current state is based on it
            }
            return;
        }

        // Get the list currently being displayed and create a shallow copy
        const moviesToSort = [...movies]; 
        
        moviesToSort.sort((a, b) => {
            let comparison = 0;
            
            if (sortCriteria === 'vote_average') {
                // Sort numbers
                comparison = a.vote_average - b.vote_average;
            } else if (sortCriteria === 'release_date') {
                // Sort dates using Date objects
                const dateA = new Date(a.release_date);
                const dateB = new Date(b.release_date);
                comparison = dateA.getTime() - dateB.getTime();
            }

            // Apply ascending or descending order
            return sortOrder === 'ascending' ? comparison : comparison * -1;
        });

        setMovies(moviesToSort);
    };
    
    const handleFilter = (rating) => {
        let filtered;
        if (rating === givingRating) { // Reset filter
            setRating(0)
            filtered = allMoviesFiltered
        } else {
            setRating(rating);
            filtered = allMoviesFiltered.filter(
                (movie) => 
                    movie.vote_average >= rating &&
                    movie.vote_average < rating + 1
            );
        }
        
        // Update movies state based on rating filter
        setMovies(filtered);
    };

    const handleClearFilter = () => {
        setRating(0);
        // This will trigger the applySorting useEffect via allMoviesFiltered change (if sorting is active)
        // or reset the movies list if no sorting is applied
        setMovies(allMoviesFiltered); 
    };

    // Handler for drowpdown menus
    const handleSortCriteriaChange = (e) => {
        // Set criteria. If value is empty, it means "Sort by" was selected, so clear it
        setSortCriteria(e.target.value === 'Sort by' ? '' : e.target.value);
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
    };
    
    return (
        <section className="movie-list">
            <header className="movie-header">
                <h2 className="center_ele movie-h2">Popular</h2>
                <div className="center_ele movie-list-add">
                    <p className="sort-text" >Filter by average score:&nbsp;&nbsp;</p>
                    <FilterMovies givingRating={givingRating}
                    onRatingButtonClick={handleFilter} ratings={[8,7,6]} />
                    
                    {/* Sort Criteria Dropdown */}
                    <select 
                        name="sortCriteria" 
                        id="sortCriteria" 
                        className="movie-sorting" 
                        onChange={handleSortCriteriaChange} 
                        value={sortCriteria}
                    >
                        <option value="">Sort by</option>
                        <option value="release_date">Release date</option>
                        <option value="vote_average">Rating</option>
                    </select>
                    
                    {/* Sort Order Dropdown */}
                    <select 
                        name="sortOrder" 
                        id="sortOrder" 
                        className="movie-sorting" 
                        onChange={handleSortOrderChange}
                        value={sortOrder}
                    >
                        <option value="ascending">Ascending</option>
                        <option value="descending">Descending</option>
                    </select>

                    <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>

                    {/* Button to clear all filters */}
                    <button onClick={handleClearFilter}>
                        Clear filters
                    </button>
                </div>
            </header>
            <div className="movie-gallery">
                { movies.length>0 ? (
                    movies.map((movie)=>(
                        <WatchList key={movie.id} movie={movie}/>
                    ))
                ) : (
                    <p className="movie-h2">No movies to display</p>
                )}  
            </div>
        </section>
    );
};

export default Movies;