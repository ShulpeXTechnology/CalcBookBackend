const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const db = require("../config/db.config");
const logger = require("../utils/logger");

// // Signup
// exports.registerUser = async (req, res) => {
//   const { name, mobileNo, password } = req.body;

//   logger.info(`Register attempt for mobileNo: ${mobileNo}`);

//   try {
//     const [rows] = await db.execute("SELECT * FROM users WHERE mobileNo = ?", [
//       mobileNo,
//     ]);
//     if (rows.length > 0) {
//       logger.warn(
//         `Registration failed: Mobile No ${mobileNo} already registered`
//       );
//       return res.status(400).json({ message: "Mobile No already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await db.execute(
//       "INSERT INTO users (name, mobileNo, password, created_at) VALUES (?, ?, ?, NOW())",
//       [name, mobileNo, hashedPassword]
//     );

//     const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     logger.info(`User registered successfully: ${mobileNo}`);

//     res
//       .status(201)
//       .json({ token, user: { id: result.insertId, name, mobileNo } });
//   } catch (error) {
//     logger.error(`Register Error: ${error.message}`, { error });
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// // Signin
// exports.loginUser = async (req, res) => {
//   const { mobileNo, password } = req.body;

//   try {
//     const [user] = await db.execute("SELECT * FROM users WHERE mobileNo = ?", [
//       mobileNo,
//     ]);
//     if (user.length == 0) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.json({
//       token,
//       user: { id: user[0].id, name: user[0].name, mobileNo: user[0].mobileNo },
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Get current user
// exports.getCurrentUser = async (req, res) => {
//   try {
//     const user = await userModel.findUserById(req.user.id);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // Forgot Password
// exports.forgotPassword = async (req, res) => {
//   const { mobileNo, newPassword } = req.body;
//   if (!mobileNo || !newPassword)
//     return res.status(400).json({ message: "All fields are required" });

//   try {
//     const user = await userModel.findUserByMobileNo(mobileNo);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     await userModel.updateUserPassword(mobileNo, hashedPassword);

//     res.json({ message: "Password reset successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// REGISTER USER
exports.registerUser = async (req, res) => {
  const { name, mobileNo, password } = req.body;

  logger.info(`Register attempt for mobileNo: ${mobileNo}`);

  try {
    // Check if the mobile number is already registered
    const [rows] = await db.execute("SELECT * FROM users WHERE mobileNo = ?", [
      mobileNo,
    ]);
    if (rows.length > 0) {
      logger.warn(
        `Registration failed: Mobile No ${mobileNo} already registered`
      );
      return res.status(400).json({ message: "Mobile No already registered" });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    const [result] = await db.execute(
      "INSERT INTO users (name, mobileNo, password, created_at) VALUES (?, ?, ?, NOW())",
      [name, mobileNo, hashedPassword]
    );

    // Generate JWT token
    const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    logger.info(`User registered successfully: ${mobileNo}`);

    res
      .status(201)
      .json({ token, user: { id: result.insertId, name, mobileNo } });
  } catch (error) {
    logger.error(`Register Error for ${mobileNo}: ${error.message}`, { error });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  const { mobileNo, password } = req.body;

  logger.info(`Login attempt for mobileNo: ${mobileNo}`);

  try {
    // Check if the user exists
    const [user] = await db.execute("SELECT * FROM users WHERE mobileNo = ?", [
      mobileNo,
    ]);
    if (user.length === 0) {
      logger.warn(`Login failed: User with mobileNo ${mobileNo} not found`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      logger.warn(`Login failed: Incorrect password for ${mobileNo}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    logger.info(`User logged in successfully: ${mobileNo}`);
    res.json({
      token,
      user: { id: user[0].id, name: user[0].name, mobileNo: user[0].mobileNo },
    });
  } catch (err) {
    logger.error(`Login Error for ${mobileNo}: ${err.message}`, { err });
    res.status(500).json({ message: "Server error" });
  }
};

// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {
  logger.info(`Fetching current user details for userId: ${req.user.id}`);

  try {
    const user = await userModel.findUserById(req.user.id);
    if (!user) {
      logger.warn(`User not found: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    logger.info(`Fetched current user details for userId: ${req.user.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user ${req.user.id}: ${err.message}`, { err });
    res.status(500).json({ message: err.message });
  }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  const { mobileNo, newPassword } = req.body;

  if (!mobileNo || !newPassword) {
    logger.warn(`Forgot Password request missing fields: ${mobileNo}`);
    return res.status(400).json({ message: "All fields are required" });
  }

  logger.info(`Password reset attempt for mobileNo: ${mobileNo}`);

  try {
    // Find user by mobile number
    const user = await userModel.findUserByMobileNo(mobileNo);
    if (!user) {
      logger.warn(`Forgot Password: User not found for mobileNo: ${mobileNo}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userModel.updateUserPassword(mobileNo, hashedPassword);

    logger.info(`Password reset successfully for mobileNo: ${mobileNo}`);
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    logger.error(`Error resetting password for ${mobileNo}: ${err.message}`, {
      err,
    });
    res.status(500).json({ message: "Server error" });
  }
};
