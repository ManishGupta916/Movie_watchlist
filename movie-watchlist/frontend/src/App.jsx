import { useEffect, useState } from "react";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5002"}/movies`;

export default function App() {
  const [movies, setMovies] = useState([]);
  const [form, setForm] = useState({ title: "", genre: "", rating: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMovies = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load movies");
      setMovies(await response.json());
    } catch (requestError) {
      setError(`${requestError.message}. Is the backend running on port 5002?`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMovies(); }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const addMovie = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating: Number(form.rating) }),
      });
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Could not add movie");
      }
      setForm({ title: "", genre: "", rating: "" });
      await loadMovies();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Could not delete movie");
      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="App">
      <main>
        <p className="eyebrow">Your screen, curated</p>
        <h1>Movie Watchlist</h1>
        <form onSubmit={addMovie}>
          <input name="title" placeholder="Movie title" value={form.title} onChange={handleChange} required />
          <input name="genre" placeholder="Genre" value={form.genre} onChange={handleChange} required />
          <input name="rating" type="number" min="0" max="10" step="0.1" placeholder="Rating / 10" value={form.rating} onChange={handleChange} required />
          <button type="submit">Add movie</button>
        </form>
        {error && <p role="alert">{error}</p>}
        {loading ? <p>Loading movies...</p> : movies.length === 0 ? <p className="empty">Your watchlist is ready for its first feature.</p> : (
          <ul>
            {movies.map((movie) => (
              <li key={movie._id}>
                <div><strong>{movie.title}</strong><span>{movie.genre} · {movie.rating}/10</span></div>
                <button className="delete" type="button" onClick={() => deleteMovie(movie._id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
