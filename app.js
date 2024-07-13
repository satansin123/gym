const express = require("express");
const http = require('http');
const path = require("path");
const cookieParser = require("cookie-parser");
const socketIo = require('socket.io');
const connectDB = require("./connect-local");
const cors = require('cors');

const {
  restrictToLoggedInUsersOnly,
  checkAuth,
} = require("./middlewares/auth");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = 8000;

connectDB.once("open", () => {
  console.log("MongoDB connection established.");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Example middleware to redirect based on authentication
app.get("/", checkAuth, (req, res) => {
  if (req.user) {
    return res.redirect("/home");
  } else {
    return res.redirect("/login");
  }
});

// Routes setup
const userRoutes = require("./routes/userRoute");
const homeRoutes = require("./routes/homeRoute");
const clanRoutes = require("./routes/clanRoute");

app.use("/", userRoutes);
app.use("/", restrictToLoggedInUsersOnly, homeRoutes);
app.use("/", restrictToLoggedInUsersOnly, clanRoutes);

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('A user connected');
  io.emit('a user joined')

  socket.on('chat message', (msg) => {
    console.log('Message from client: ' + msg);
    io.emit('chat message', msg); // Broadcast message to all clients
  });

  socket.on('disconnect', () => {
    io.emit("disconnected")
    console.log('User disconnected');
  });
});

// Start server
server.listen(port, () => {
  console.log("Server running on port", port);
});
