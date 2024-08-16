const { getUser } = require("../services/userServiceToken");

const PUBLIC_ROUTES = ["/login", "/signup", "/auth/login", "/auth/signup"];

async function restrictToLoggedInUsersOnly(req, res, next) {
  if (PUBLIC_ROUTES.includes(req.path)) {
    return next();
  }

  const token = req.cookies?.uid;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = user;
  next();
}

function checkAuth(req, res, next) {
  if (PUBLIC_ROUTES.includes(req.path)) {
    return next();
  }

  const token = req.cookies?.uid;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Invalid token" });
  }

  req.user = user;
  next();
}

module.exports = { restrictToLoggedInUsersOnly, checkAuth };
