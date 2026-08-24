const express = require("express");
const router = express.Router();

const Movie = require("../models/Movie");

// ===============================
// GET /movies
// Get all movies
// ===============================
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch movies",
      error: error.message
    });
  }
});

// ===============================
// GET /movies/:id
// Get one movie
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch movie",
      error: error.message
    });
  }
});

// ===============================
// POST /movies
// Create a new movie
// ===============================
router.post("/", async (req, res) => {
  try {
    const { title, genre, rating, watched } = req.body;

    const movie = await Movie.create({
      title,
      genre,
      rating,
      watched
    });

    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create movie",
      error: error.message
    });
  }
});

// ===============================
// PUT /movies/:id
// Update a movie
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update movie",
      error: error.message
    });
  }
});

// ===============================
// DELETE /movies/:id
// Delete a movie
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found"
      });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
      movie
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete movie",
      error: error.message
    });
  }
});

module.exports = router;
