// IMPORTING MODULES
require("dotenv").config();
require("./models/user"); 
require("./models/blog"); 
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require('path');
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes"); 
const requireAuth = require("./middleware/requiredToken");
const cors = require("cors");

const app = express();

// Middleware for allowing cross-origin HTTP requests
app.use(cors());

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Registering authentication routes
app.use(authRoutes);

// Registering blog routes
app.use('/api/blog', blogRoutes);

// Connecting to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

// Event handler for successful MongoDB connection
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Event handler for MongoDB connection error
db.on("error", function (err) {
  console.error("DB Error:", err);
});

// Starting the server
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
