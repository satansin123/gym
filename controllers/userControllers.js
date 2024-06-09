const User = require("../models/userModel");
const { setUser } = require("../services/userServiceToken");

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
    await User.create({ name, email, password });
    return res.render("login");
  } catch (error) {
    console.log("Error during sign up:", error);
    return res.status(500).send("Internal Server Error");
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      console.log("Invalid Username or Password");
      return res.render("login", { error: "Invalid Username or Password" });
    }

    const token = setUser(user);
    if (!token) {
      console.log("Token generation failed");
      return res.render("login", { error: "Internal Server Error" });
    }

    res.cookie("uid", token, { httpOnly: true, secure: true }); // Ensure cookie is set securely
    console.log("Login successful, token set in cookie");
    return res.redirect("/home"); // Ensure the path starts with '/'
  } catch (error) {
    console.log("Error during login:", error);
    return res.status(500).send("Internal Server Error");
  }
}

module.exports = { handleSignUp, handleLogin };
