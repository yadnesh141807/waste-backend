const express = require("express");
const router = express.Router();
const Waste = require("../models/Waste");
const upload = require("../middleware/upload");
const jwt = require("jsonwebtoken"); // ✅ ADDED

// ✅ SUBMIT WASTE (FIXED WITH userId)
router.post("/submit", upload.single("image"), async (req, res) => {
  try {
    const { type, description, location, weight, quantity } = req.body;

    // 🔥 GET USER FROM TOKEN
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    const waste = await Waste.create({
      userId: decoded.id, // ✅ FIXED (IMPORTANT)
      type,
      description,
      location,
      weight,
      quantity,
      image: req.file ? req.file.filename : null,
      status: "Pending",
    });

    res.json({
      message: "Waste submitted successfully",
      waste,
    });

  } catch (err) {
    console.error("WASTE SUBMIT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ 🔥 NEW ROUTE (USER WASTE ONLY)
router.get("/my", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    const wastes = await Waste.find({ userId: decoded.id });
    res.json(wastes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET ALL WASTE
router.get("/", async (req, res) => {
  try {
    const wastes = await Waste.find();
    res.json(wastes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE WASTE (ACCEPT / REJECT)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Waste.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE WASTE
router.delete("/:id", async (req, res) => {
  try {
    await Waste.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;