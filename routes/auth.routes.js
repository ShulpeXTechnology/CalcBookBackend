const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  forgotPassword,
} = require("../controllers/auth.controller");

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/me", authMiddleware, getCurrentUser);
router.post("/forgot-password", forgotPassword);

module.exports = router;
