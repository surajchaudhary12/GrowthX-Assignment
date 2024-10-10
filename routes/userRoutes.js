// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  uploadAssignment,
  getAllAdmins,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes (User)
router.post("/upload", protect, authorize(["user"]), uploadAssignment);
router.get("/admins", protect, authorize(["user"]), getAllAdmins);

module.exports = router;
