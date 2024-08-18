const { getUser } = require("../services/userServiceToken");

function restrictToLoggedInUsersOnly(req, res, next) {
  const token = req.cookies?.uid;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const user = getUser(token);
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.user = user;
  next();
}

function checkAuth(req, res, next) {
  const token = req.cookies?.uid;

  if (token) {
    const user = getUser(token);
    if (user) {
      req.user = user;
    }
  }

  next();
}

module.exports = { restrictToLoggedInUsersOnly, checkAuth };