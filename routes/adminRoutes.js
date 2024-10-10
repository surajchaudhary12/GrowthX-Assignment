// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  getAssignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Protected routes (Admin)
router.get("/assignments", protect, authorize(["admin"]), getAssignments);
router.post(
  "/assignments/:id/accept",
  protect,
  authorize(["admin"]),
  acceptAssignment
);
router.post(
  "/assignments/:id/reject",
  protect,
  authorize(["admin"]),
  rejectAssignment
);

module.exports = router;
