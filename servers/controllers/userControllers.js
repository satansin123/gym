
const User = require("../models/userModel");
const { setUser, getUser } = require("../services/userServiceToken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function fetchAllUsers(req, res) {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(409).json({ error: "No users registered" });
    }
    return res.json({users});
  } 
  catch (error) {
    console.error("Error during fetch up:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function handleSignUp(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    console.log("Received login request for email:", email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    console.log("User found:", user);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch for user:", email);
      return res.status(401).json({ error: "Invalid Username or Password" });
    }

    const token = setUser(user);
    if (!token) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    res.cookie("uid", token, { httpOnly: true });
    return res.status(200).json({
      message: "Login successful",
      token, // Send the token in the response
      user: { email: user.email, id: user._id, name: user.name }, // Send the user data in the response
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleSignOut(req, res) {
  res.clearCookie("uid", { httpOnly: true });
  return res.status(200).json({ message: "Logout successful" });
}

async function deleteUser(req, res) {
  try {
    const token = req.cookies?.uid;
    if (!token) {
      console.log("No token found in cookies.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = getUser(token);
    if (!user) {
      console.log("Token verification failed.");
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("Deleting user with ID:", user.id);
    await User.findByIdAndDelete(user.id);
    res.clearCookie("uid", { httpOnly: true });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = { handleSignUp, handleLogin, handleSignOut, deleteUser,fetchAllUsers };
