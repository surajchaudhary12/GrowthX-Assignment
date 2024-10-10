const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
  createAssignment,
  getAssignments,
  getAssignment,
  updateAssignment,
  deleteAssignment,
} = require("../controllers/assignmentController");

router
  .route("/")
  .post(protect, authorize(["user"]), createAssignment)
  .get(protect, getAssignments);

router
  .route("/:id")
  .get(protect, getAssignment)
  .put(protect, authorize(["admin"]), updateAssignment)
  .delete(protect, authorize(["admin"]), deleteAssignment);

module.exports = router;
