const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    genre: { type: String, required: [true, "Genre is required"], trim: true },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be below 0"],
      max: [10, "Rating cannot be above 10"],
    },
    watched: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
