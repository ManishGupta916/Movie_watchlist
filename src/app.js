import { useEffect, useState } from "react";
import axios from "axios";
import "./app.css";

const API_URL = "http://localhost:5001/movies";

function App() {
  // Movie form state
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    rating: "",
    watched: false,
  });

  // Fetched movie list
  const [movies, setMovies] = useState([]);

  // ID of movie currently being edited
  const [editingId, setEditingId] = useState(null);

  // Error/success messages
  const [message, setMessage] = useState("");

  // Get all movies when component loads
  useEffect(() => {
    fetchMovies();
  }, []);

  // GET /movies
  const fetchMovies = async () => {
    try {
      const response = await axios.get(API_URL);
      setMovies(response.data);
    } catch (error) {
      setMessage("Failed to fetch movies.");
      console.error(error);
    }
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // POST /movies or PUT /movies/:id
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const movieData = {
        title: formData.title,
        genre: formData.genre,
        rating: Number(formData.rating),
        watched: formData.watched,
      };

      if (editingId) {
        // Update movie
        const response = await axios.put(
          `${API_URL}/${editingId}`,
          movieData
        );

        // Update state with server response
        setMovies((previousMovies) =>
          previousMovies.map((movie) =>
            movie._id === editingId ? response.data : movie
          )
        );

        setMessage("Movie updated successfully.");
      } else {
        // Create movie
        const response = await axios.post(API_URL, movieData);

        // Add newly created movie to state
        setMovies((previousMovies) => [
          response.data,
          ...previousMovies,
        ]);

        setMessage("Movie added successfully.");
      }

      resetForm();
    } catch (error) {
      setMessage(
        error.response?.data?.error || "Failed to save movie."
      );
      console.error(error);
    }
  };

  // Start editing a movie
  const handleEdit = (movie) => {
    setEditingId(movie._id);

    setFormData({
      title: movie.title,
      genre: movie.genre,
      rating: movie.rating,
      watched: movie.watched,
    });

    setMessage("");
  };

  // DELETE /movies/:id
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      // Remove deleted movie from state
      setMovies((previousMovies) =>
        previousMovies.filter((movie) => movie._id !== id)
      );

      // If deleting the movie currently being edited
      if (editingId === id) {
        resetForm();
      }

      setMessage("Movie deleted successfully.");
    } catch (error) {
      setMessage("Failed to delete movie.");
      console.error(error);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      genre: "",
      rating: "",
      watched: false,
    });

    setEditingId(null);
  };

  return (
    <div className="container">
      <h1>Movie Manager</h1>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="movie-form">
        <h2>{editingId ? "Edit Movie" : "Add Movie"}</h2>

        <input
          type="text"
          name="title"
          placeholder="Movie title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={formData.genre}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="rating"
          placeholder="Rating"
          min="0"
          max="10"
          step="0.1"
          value={formData.rating}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="watched"
            checked={formData.watched}
            onChange={handleChange}
          />

          Watched
        </label>

        <div className="form-buttons">
          <button type="submit">
            {editingId ? "Update Movie" : "Add Movie"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <section>
        <h2>Movies</h2>

        {movies.length === 0 ? (
          <p>No movies found.</p>
        ) : (
          <div className="movie-list">
            {movies.map((movie) => (
              <div className="movie-card" key={movie._id}>
                <h3>{movie.title}</h3>

                <p>
                  <strong>Genre:</strong> {movie.genre}
                </p>

                <p>
                  <strong>Rating:</strong> {movie.rating}/10
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  {movie.watched ? "Watched" : "Not watched"}
                </p>

                <div className="card-buttons">
                  <button onClick={() => handleEdit(movie)}>
                    Edit
                  </button>

                  <button
                    className="delete"
                    onClick={() => handleDelete(movie._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
