const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const app = express();
const port = 8000;
const userRoutes = require("./routes/userRoute");
const staticRouter = require("./routes/staticRouter");
const homeRoutes = require("./routes/homeRoute");
const connectDB = require("./connect-local");
const {
  restrictToLoggedInUsersOnly,
  checkAuth,
} = require("./middlewares/auth");

connectDB.once("open", () => {
  console.log("MongoDB connection established.");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/home", restrictToLoggedInUsersOnly, homeRoutes);
app.use("/users", userRoutes);
app.use("/", checkAuth, staticRouter);

app.listen(port, () => {
  console.log("Server running on port", port);
});
