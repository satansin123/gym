const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const userRoutes = require("./routes/userRoute");
const homeRoutes = require("./routes/homeRoute");
const connectDB = require("./connect-local");
const workoutRoutes = require("./routes/workoutRoutes");
const cors = require("cors");
const {
  restrictToLoggedInUsersOnly,
  checkAuth,
} = require("./middlewares/auth");

connectDB.once("open", () => {
  console.log("MongoDB connection established.");
});

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", userRoutes);
app.use("/workouts", restrictToLoggedInUsersOnly, workoutRoutes);
app.use("/joinClan", require("./routes/joinClan"));
app.use("/createClan", require("./routes/createClan"));
app.use("/", restrictToLoggedInUsersOnly, homeRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
