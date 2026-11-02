import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  async function searchMovies(e, page = 1) { 
  if (e) e.preventDefault()

  if (!search.trim()) return
    

    setLoading(true)
    setError('')
    setMovies([])
    setHasSearched(false)

    try {
      const apiKey = import.meta.env.VITE_TMDB_API_KEY

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(search)}&page=${page}`
      )

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()
setMovies(data.results || [])
setTotalPages(data.total_pages || 1)
setHasSearched(true)
      
    } catch (err) {
      setError('Movies not loaded. Check API key.')
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  if (search.trim()) {
    searchMovies(null, currentPage)
  }
}, [currentPage])
  return (
    <div className="app">
      <header>
        <h1>🎬 Movie Search</h1>
        <p>Find your next favourite movie</p>
      </header>

      <form
  className="search-box"
  onSubmit={(e) => {
    e.preventDefault()
    setCurrentPage(1)
    searchMovies(null, 1)
  }}
>
  <input
    type="text"
    placeholder="Search movies..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
  <button type="submit">Search</button>
</form>
      {loading && <p className="message">Loading movies...</p>}
      {error && <p className="message">{error}</p>}

      <div className="movie-grid">
        {movies.map((movie) => (
          <div
  className="movie-card"
  key={movie.id}
  onClick={() => setSelectedMovie(movie)}
>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No poster available</div>
            )}

            <h3>{movie.title}</h3>
            <p>
              {movie.release_date
                ? movie.release_date.slice(0, 4)
                : 'Release year unknown'}
            </p>
            <p>⭐ {movie.vote_average?.toFixed(1) ?? 'N/A'}</p>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
  <div className="pagination">
    <button
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      Previous
    </button>

    {Array.from(
      { length: Math.min(totalPages, 5) },
      (_, i) => i + 1
    ).map((page) => (
      <button
        key={page}
        className={currentPage === page ? 'active' : ''}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    <button
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      Next
    </button>
  </div>
)}
      {selectedMovie && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedMovie(null)}
  >
    <div
      className="modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="close-button"
        onClick={() => setSelectedMovie(null)}
      >
        ✕
      </button>

      <h2>{selectedMovie.title}</h2>

      <p>
        Release date: {selectedMovie.release_date || 'Unknown'}
      </p>

      <p>
        ⭐ {selectedMovie.vote_average?.toFixed(1) ?? 'N/A'}
      </p>

      <h3>Overview</h3>
      <p>
        {selectedMovie.overview || 'No overview available.'}
      </p>
    </div>
  </div>
)}
      {!loading && hasSearched && movies.length === 0 && (
  <p className="message">
    No movies found. Try another title!
  </p>
)}

{!loading && !hasSearched && (
  <p className="message">
    Search for a movie to get started
  </p>
)}

     

    </div>
  )
}

export default App