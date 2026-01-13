import { useEffect, useMemo, useRef, useState } from "react";
import "./Movies.css";
import { WatchList } from "./WatchList";
import FilterMovies from "./FilterMovies";

const Movies = () => {
  const [allMovies, setAllMovies] = useState([]); // Raw fetched movies (multi-page)
  const [givingRating, setRating] = useState(0);
  const [sortCriteria, setSortCriteria] = useState("");
  const [sortOrder, setSortOrder] = useState("ascending");

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);

  // Fetch first page on mount
  useEffect(() => {
    fetchMovies(1, { replace: true });
    // Eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMovies = async (pageToFetch = 1, { replace = false } = {}) => {
    const apiKey = import.meta.env.VITE_TMDB_API_KEY;

    if (!apiKey) {
      setError("Missing VITE_TMDB_API_KEY in .env");
      return;
    }

    // Different loading flags for first page vs load more
    if (pageToFetch === 1 && replace) setLoading(true);
    else setLoadingMore(true);

    setError("");

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${pageToFetch}`
      );

      if (!res.ok) throw new Error("Failed to fetch movies");

      const data = await res.json();

      const cleaned = (data.results || []).map((movie) => ({
        ...movie,
        vote_average: movie.vote_average || 0,
      }));

      // TMDB returns total_pages; using it to determine hasMore
      const totalPages = data.total_pages || pageToFetch;
      setHasMore(pageToFetch < totalPages);
      setPage(pageToFetch);

      setAllMovies((prev) => {
        if (replace) return cleaned;

        // prevent duplicates
        const existingIds = new Set(prev.map((m) => m.id));
        const merged = [...prev];
        for (const m of cleaned) {
          if (!existingIds.has(m.id)) merged.push(m);
        }
        return merged;
      });
    } catch (err) {
      console.error(err);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Derived list: rating -> search -> sort
  const displayMovies = useMemo(() => {
    let list = [...allMovies];

    // Rating filter
    if (givingRating > 0) {
      list = list.filter(
        (movie) =>
          movie.vote_average >= givingRating &&
          movie.vote_average < givingRating + 1
      );
    }

    // Search filter (local on loaded pages)
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter((movie) =>
        (movie.title || "").toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortCriteria) {
      list.sort((a, b) => {
        let comparison = 0;

        if (sortCriteria === "vote_average") {
          comparison = (a.vote_average || 0) - (b.vote_average || 0);
        } else if (sortCriteria === "release_date") {
          const dateA = new Date(a.release_date || "1970-01-01").getTime();
          const dateB = new Date(b.release_date || "1970-01-01").getTime();
          comparison = dateA - dateB;
        }

        return sortOrder === "ascending" ? comparison : comparison * -1;
      });
    }

    return list;
  }, [allMovies, givingRating, searchTerm, sortCriteria, sortOrder]);

  const handleFilter = (rating) => {
    if (rating === givingRating) setRating(0);
    else setRating(rating);
  };

  const handleClearFilter = () => {
    setRating(0);
    setSearchTerm("");
    setSortCriteria("");
    setSortOrder("ascending");
  };

  const handleSortCriteriaChange = (e) => setSortCriteria(e.target.value || "");
  const handleSortOrderChange = (e) => setSortOrder(e.target.value);

  const handleLoadMore = () => {
    if (loadingMore || loading || !hasMore) return;
    fetchMovies(page + 1, { replace: false });
  };

  const handleRefresh = () => {
    setAllMovies([]);
    setHasMore(true);
    setPage(1);
    fetchMovies(1, { replace: true });
  };
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
        (entries) => {
            const first = entries[0];
            if (first.isIntersecting) {
                handleLoadMore();
            }
        },
        {
            root: null,
            rootMargin: "300px", // start loading early
            threshold: 0,
        }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
}, [page, hasMore, loadingMore, loading, error]);


  return (
    <section className="movie-list">
      <header className="movie-header">
        <h2 className="center_ele movie-h2">Popular Movies</h2>

        <div className="center_ele movie-list-add">
          <input
            type="text"
            className="movie-search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            aria-label="Search movies by title"
          />

          <p className="sort-text">&nbsp;&nbsp;&nbsp;Filter by average score:&nbsp;</p>

          <FilterMovies
            givingRating={givingRating}
            onRatingButtonClick={handleFilter}
            ratings={[8, 7, 6]}
          />

          <p>&nbsp;&nbsp;&nbsp;</p>

          <select
            name="sortCriteria"
            id="sortCriteria"
            className="movie-sorting"
            onChange={handleSortCriteriaChange}
            value={sortCriteria}
            disabled={loading}
          >
            <option value="">Sort by</option>
            <option value="release_date">Release date</option>
            <option value="vote_average">Rating</option>
          </select>

          <select
            name="sortOrder"
            id="sortOrder"
            className="movie-sorting"
            onChange={handleSortOrderChange}
            value={sortOrder}
            disabled={loading}
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>

          <p>&nbsp;&nbsp;&nbsp;</p>

          <button onClick={handleClearFilter} disabled={loading}>
            Clear filters
          </button>

          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>

          <button type="button" onClick={handleRefresh} disabled={loading}>
            Refresh
          </button>

        </div>
      </header>

      <div className="movie-gallery">
        {loading ? (
          <p className="movie-h2" role="status" aria-live="polite">
            Loading movies...
          </p>
        ) : error ? (
          <p className="movie-h2" role="alert">
            {error}
          </p>
        ) : displayMovies.length > 0 ? (
          displayMovies.map((movie) => <WatchList key={movie.id} movie={movie} />)
        ) : (
          <p className="movie-h2">
            {searchTerm.trim() ? "No matches for your search." : "No movies to display"}
          </p>
        )}
      </div>

      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Load more pagination */}
      {!loading && !error && (
        <div style={{ display: "flex", justifyContent: "center", padding: "1.5rem 0" }}>
          <button
            onClick={handleLoadMore}
            disabled={!hasMore || loadingMore}
          >
            {loadingMore ? "Loading more..." : hasMore ? "Load more" : "No more movies"}
          </button>
        </div>
      )}

    </section>
  );
};

export default Movies;
