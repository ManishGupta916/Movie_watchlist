const express = require("express");
const router = express.Router();

const Movie = require("../models/Movie");

// =============================
// GET All Movies
// =============================
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =============================
// GET Movie By ID
// =============================
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// =============================
// POST Add New Movie
// =============================
router.post("/", async (req, res) => {
  try {
    const movie = new Movie({
      title: req.body.title,
      genre: req.body.genre,
      rating: req.body.rating,
      watched: req.body.watched,
      userName: req.body.userName,
      comment: req.body.comment,
    });

    const savedMovie = await movie.save();

    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =============================
// PUT Update Movie
// =============================
router.put("/:id", async (req, res) => {
  try {
    const updatedMovie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        genre: req.body.genre,
        rating: req.body.rating,
        watched: req.body.watched,
        userName: req.body.userName,
        comment: req.body.comment,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// =============================
// DELETE Movie
// =============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndDelete(req.params.id);

    if (!deletedMovie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;