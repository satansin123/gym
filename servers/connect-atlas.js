const mongoose = require("mongoose");

// MongoDB connection string
const uri = process.env.UR;

// MongoDB connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
mongoose
  .connect(uri, options)
  .then(() => {
    console.log("Connected to MongoDB Atlas.");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

module.exports = mongoose.connection;
