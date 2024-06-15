const { getUser } = require("../services/userServiceToken");

async function restrictToLoggedInUsersOnly(req, res, next) {
  const token = req.cookies?.uid;
  console.log("Token from cookies:", token); // Debugging statement
  if (!token) {
    console.log("No token found, redirecting to login");
    return res.redirect("/login");
  }

  const user = getUser(token);
  console.log("Decoded user:", user); // Debugging statement
  if (!user) {
    console.log("Token verification failed, redirecting to login");
    return res.redirect("/login");
  }

  req.user = user;
  next();
}

async function checkAuth(req, res, next) {
  const token = req.cookies?.uid;
  if (!token) {
    console.log("No token found in cookies.");
    return res.redirect("/login");
  }

  const user = getUser(token);
  if (!user) {
    console.log("Token verification failed.");
    return res.redirect("/login");
  }

  req.user = user;
  next();
}

module.exports = { restrictToLoggedInUsersOnly, checkAuth };
