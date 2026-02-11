const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Driver = require("../models/Driver");
const Waste = require("../models/Waste");

const router = express.Router();

// 🔐 DRIVER LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const driver = await Driver.findOne({ email });
    if (!driver)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, driver.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: driver._id, role: "driver" },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({ token, role: "driver", driver });
  } catch (err) {
    console.error("DRIVER LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🚚 GET ASSIGNED WASTES
router.get("/wastes/:driverId", async (req, res) => {
  try {
    const wastes = await Waste.find({
      driverId: new mongoose.Types.ObjectId(req.params.driverId),
    });

    res.json(wastes);
  } catch (err) {
    console.error("FETCH DRIVER WASTES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ MARK AS COLLECTED (🔥 MISSING ROUTE - FINAL FIX)
router.put("/collect/:id", async (req, res) => {
  try {
    const updated = await Waste.findByIdAndUpdate(
      req.params.id,
      { status: "Collected" },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Waste not found" });
    }

    res.json({ message: "Status updated to Collected", updated });
  } catch (err) {
    console.error("MARK COLLECTED ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
