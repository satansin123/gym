const ClanUser = require("../models/clanUserModel");
const User = require("../models/userModel");
const { setUser, getUser } = require("../services/userServiceToken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

async function handleSignUp(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).send("Email already in use");
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({ name, email, password: hashedPassword });
    console.log("user added")

    const token = setUser(user);
    if (!token) {
      console.log("Token generation failed");
      return res.render("login", { error: "Internal Server Error" });
    }

    res.cookie("uid", token);

    
    return res.render("login");
  } catch (error) {
    console.log("Error during sign up:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("Invalid Username or Password");
      return res.render("login", { error: "Invalid Username or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Invalid Username or Password");
      return res.render("login", { error: "Invalid Username or Password" });
    }
    
    console.log(user);
    const token = setUser(user);
    if (!token) {
      console.log("Token generation failed");
      return res.render("login", { error: "Internal Server Error" });
    }

    res.cookie("uid", token);
    console.log("Login successful, token set in cookie");
    return res.redirect("/home");
  } catch (error) {
    console.log("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function handleSignOut(req, res) {
  res.clearCookie("uid");
  console.log("Logout successful, token removed from cookie");
  return res.redirect("/login");
}

async function deleteUser(req, res) {
  try {
    console.log("Delete user route accessed.");
    const token = req.cookies?.uid;
    if (!token) {
      console.log("No token found, redirecting to login");
      return res.redirect("/login");
    }

    const user = getUser(token);

    if (!user) {
      console.log("Token verification failed, redirecting to login");
      return res.redirect("/login");
    }

    await User.findByIdAndDelete(user.id);

    res.clearCookie("uid", { httpOnly: true, secure: false });

    console.log("User deleted successfully");
    return res.redirect("/login");
  } catch (error) {
    console.log("Error deleting user:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = { handleSignUp, handleLogin, handleSignOut, deleteUser };
