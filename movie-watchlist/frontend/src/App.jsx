import { useEffect, useState } from "react";

const API_URL = "http://localhost:5002/movies";

export default function App() {
  const [movies, setMovies] = useState([]);

  const [form, setForm] = useState({
    title: "",
    genre: "",
    rating: "",
    userName: "",
    comment: "",
    watched: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Movies
  const loadMovies = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load movies");
      }

      const data = await response.json();
      setMovies(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Add Movie
  const addMovie = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: form.title,
          genre: form.genre,
          rating: Number(form.rating),
          userName: form.userName,
          comment: form.comment,
          watched: form.watched,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not add movie");
      }

      setMovies([...movies, data]);

      setForm({
        title: "",
        genre: "",
        rating: "",
        userName: "",
        comment: "",
        watched: false,
      });

      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Movie
  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Could not delete movie");
      }

      setMovies(movies.filter((movie) => movie._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="App">
      <h1>Movie Watchlist</h1>

      <form onSubmit={addMovie}>

        <input
          type="text"
          name="title"
          placeholder="Movie Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={form.genre}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          min="1"
          max="10"
          value={form.rating}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={form.userName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="comment"
          placeholder="Comment"
          value={form.comment}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="watched"
            checked={form.watched}
            onChange={handleChange}
          />
          Watched
        </label>

        <button type="submit">Add Movie</button>

      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : movies.length === 0 ? (
        <p>No movies added yet.</p>
      ) : (
        <div>
          {movies.map((movie) => (
            <div
              key={movie._id}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <h3>{movie.title}</h3>

              <p><b>Genre:</b> {movie.genre}</p>

              <p><b>Rating:</b> {movie.rating}/10</p>

              <p><b>User:</b> {movie.userName}</p>

              <p><b>Comment:</b> {movie.comment}</p>

              <p>
                <b>Watched:</b> {movie.watched ? "Yes" : "No"}
              </p>

              <button onClick={() => deleteMovie(movie._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}