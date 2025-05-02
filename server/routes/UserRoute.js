const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const verifyToken = require('../middleware/auth');

// Get user by MongoDB ID
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id)
      .populate("savedCafeterias preferences");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get user by Firebase UID
router.get("/firebase/:firebaseId", verifyToken, async (req, res) => {
  try {
    if (req.user.uid !== req.params.firebaseId) {
      return res.status(403).json({ error: "Not authorized to access this user data" });
    }

    const user = await UserModel.findOne({ firebaseId: req.params.firebaseId })
      .populate("savedCafeterias preferences");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update user
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.uid !== user.firebaseId) {
      return res.status(403).json({ error: "Not authorized to update this account" });
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("savedCafeterias preferences");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete user
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (req.user.uid !== user.firebaseId) {
      return res.status(403).json({ error: "Not authorized to delete this account" });
    }

    await UserModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
