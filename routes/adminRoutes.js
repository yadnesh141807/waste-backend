const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Waste = require("../models/Waste");
const Driver = require("../models/Driver"); // 🔥 ADDED (REQUIRED)

// 🔥 TEST ROUTE
router.get("/test", (req, res) => {
  res.json({ message: "Admin route working" });
});

// 🔁 TEMP RESET ADMIN PASSWORD (ONE TIME USE)
router.get("/reset-admin", async (req, res) => {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await Admin.updateOne(
    { email: "admin@gmail.com" },
    { $set: { password: hashedPassword, role: "admin" } }
  );

  res.json({
    message: "Admin password reset successful",
    email: "admin@gmail.com",
    password: "Admin@123",
  });
});

// 🔐 ADMIN LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email & Password required" });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid Admin Credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Admin Credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      role: "admin",
      admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 GET ALL DRIVERS (FOR DROPDOWN)
router.get("/drivers", async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 CREATE DRIVER (ADMIN ONLY)
router.post("/create-driver", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Driver.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Driver already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const driver = await Driver.create({
      name,
      email,
      password: hashed,
      role: "driver",
    });

    res.json({
      message: "Driver created successfully",
      driver,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 ASSIGN DRIVER TO WASTE ✅ FIXED
router.put("/assign-driver", async (req, res) => {
  try {
    const { wasteId, driverId } = req.body;

    if (!wasteId || !driverId) {
      return res.status(400).json({ message: "wasteId & driverId required" });
    }

    await Waste.findByIdAndUpdate(wasteId, {
        $set: {
      driverId: driverId, // ✅ SAME FIELD AS MODEL
       assignedDriver: driverId,
      status: "Assigned",
        }
    });

    res.json({ message: "Driver assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
