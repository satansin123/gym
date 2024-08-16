const jwt = require("jsonwebtoken");

function setUser(user) {
  try {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return null;
  }
}

function getUser(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error("Error verifying token:", error);
    return null;
  }
}

module.exports = { setUser, getUser };
