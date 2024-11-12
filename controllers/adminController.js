// controllers/adminController.js
const Assignment = require("../models/Assignment");
const User = require("../models/User");

// @desc    Register a new admin
// @route   POST /api/admins/register
// @access  Public
exports.registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const adminExists = await User.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await User.create({
      username,
      password,
      role: "admin",
    });

    res.status(201).json({
      _id: admin._id,
      username: admin.username,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Login admin
// @route   POST /api/admins/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await User.findOne({ username, role: "admin" });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        username: admin.username,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Get assignments for admin
// @route   GET /api/admins/assignments
// @access  Private (Admin)
exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ admin: req.user._id })
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Accept an assignment
// @route   POST /api/admins/assignments/:id/accept
// @access  Private (Admin)
exports.acceptAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to accept this assignment" });
    }

    assignment.status = "accepted";
    await assignment.save();

    res.json({ message: "Assignment accepted", assignment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Reject an assignment
// @route   POST /api/admins/assignments/:id/reject
// @access  Private (Admin)
exports.rejectAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.admin.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to reject this assignment" });
    }

    assignment.status = "rejected";
    await assignment.save();

    res.json({ message: "Assignment rejected", assignment });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Helper function to generate token
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};
