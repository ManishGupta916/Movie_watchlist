const express = require("express");
const mongoose = require("mongoose");
const movieRoutes = require("./Routes/movieRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  "mongodb://127.0.0.1:27017/movie-manager";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Movie watchlist API is running" });
});

app.use("/movies", movieRoutes);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  });
