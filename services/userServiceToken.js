const jwt = require("jsonwebtoken");
const secret = "asdfghjkl";

function setUser(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    secret
  );
}

function getUser(token) {
  if (!token) return null;
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
}

module.exports = {
  setUser,
  getUser,
};
