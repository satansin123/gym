const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ClanUser = require("../models/clanUserModel");
const { setUser, getUser } = require("../services/userServiceToken");

const saltRounds = 12;

async function getUsername(req, res) {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch user from the database (replace User with your Mongoose model)
    const user2 = await User.findById(userId).select("email"); // Only select the 'name' field

    // Check if user exists
    if (!user2) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the username
    return res.json({ username: user2.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function fetchAllUsers(req, res) {
  try {
    const users = await User.find({});
    if (!users || users.length === 0) {
      return res.status(409).json({ error: "No users registered" });
    }

    // Process each user to attach clan information
    for (const user of users) {
      const id = user._id;
      const clans = (await ClanUser.find({ uid: id })) || []; // Fetch clans associated with the user ID

      let temp;

      if (clans.length > 0) {
        const clanData = clans[0]; // Access the first ClanUser document
        temp = {
          clanIds: clanData.clanIds,
          clanNames: clanData.clanNames,
        };
      } else {
        temp = {
          clanIds: [],
          clanNames: [],
        };
      }

      // Attach clan data to user object (temporary, not saved to DB)
      user._doc.clans = temp; // Use _doc to avoid schema restrictions
    }

    console.log(users); // Log the users array with clan data
    return res.json({ users }); // Send the updated users array as response
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
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

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Don't set a token or cookie here, just return success
    return res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (error) {
    console.error("Error during sign up:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function handleLogin(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = setUser(user);
    if (!token) {
      return res.status(500).json({ error: "Error generating token" });
    }

    res.cookie("uid", token, {
      httpOnly: true,
      secure: true, // Use true if your frontend is served over HTTPS
      sameSite: "None", // Important for cross-site cookies
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(200).json({
      message: "Login successful",
      user: { email: user.email, id: user._id, name: user.name },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

async function verifyToken(req, res) {
  const token = req.cookies?.uid || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    return res.json({
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: "Invalid token" });
  }
}

async function handleSignOut(req, res) {
  res.clearCookie("uid", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json({ message: "Logout successful" });
}

async function deleteUser(req, res) {
  try {
    const token = req.cookies?.uid;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = getUser(token);
    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const deletedUser = await User.findByIdAndDelete(user.id);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.clearCookie("uid", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
async function fetchAllUsers(req, res) {
  try {
    const users = await User.find({}).select("-password");
    if (!users || users.length === 0) {
      return res.status(409).json({ error: "No users registered" });
    }

    // Process each user to attach clan information
    for (const user of users) {
      const id = user._id;
      const clans = (await ClanUser.find({ uid: id })) || [];

      let temp = {
        clanIds: clans.length > 0 ? clans[0].clanIds : [],
        clanNames: clans.length > 0 ? clans[0].clanNames : [],
      };

      user._doc.clans = temp;
    }

    return res.json({ users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}

// New function to promote user to admin
async function promoteToAdmin(req, res) {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "admin" },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User promoted to admin", user: updatedUser });
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// New function to demote admin to user
async function demoteToUser(req, res) {
  try {
    const { userId } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: "user" },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "Admin demoted to user", user: updatedUser });
  } catch (error) {
    console.error("Error demoting admin to user:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// New function to get user counts
async function getUserCounts(req, res) {
  try {
    const userCount = await User.countDocuments({ role: "user" });
    const adminCount = await User.countDocuments({ role: "admin" });
    return res.json({ userCount, adminCount });
  } catch (error) {
    console.error("Error getting user counts:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  handleSignUp,
  handleLogin,
  handleSignOut,
  deleteUser,
  verifyToken,
  fetchAllUsers,
  getUsername,
  promoteToAdmin,
  demoteToUser,
  getUserCounts,
};
