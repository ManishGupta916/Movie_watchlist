const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  watched: {
    type: Boolean,
    default: false,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  comment: {
    type: String,
    default: "",
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);