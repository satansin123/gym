const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const userRoutes = require("./routes/userRoute");
const homeRoutes = require("./routes/homeRoute");
const connectDB = require("./connect-local");
const cors = require('cors'); // Import cors middleware

const {
  restrictToLoggedInUsersOnly,
  checkAuth,
} = require("./middlewares/auth");

connectDB.once("open", () => {
  console.log("MongoDB connection established.");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  credentials: true, // Enable CORS credentials (cookies, authorization headers)
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", checkAuth, (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  } else {
    return res.redirect("/login");
  }
});

app.use("/", userRoutes);

app.use("/", restrictToLoggedInUsersOnly, homeRoutes);

app.use("/joinClan", require("./routes/joinClan"));
app.use("/createClan", require("./routes/createClan"));

app.listen(port, () => {
  console.log("Server running on port", port);
});
