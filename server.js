const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path"); // 🔥 ADDED
require("dotenv").config();

const Admin = require("./models/Admin");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes"); // 🔥 ADDED

const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json());

// 🔥🔥🔥 IMAGE STATIC SERVE (MOST IMPORTANT)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===================== TEST ROUTE =====================
app.get("/", (req, res) => {
  res.send("Waste Backend is running 🚀");
});

// ===================== ROUTES =====================
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/driver", driverRoutes); // 🔥 ADDED

// ===================== AUTO CREATE ADMIN =====================
const createDefaultAdmin = async () => {
  try {
    const admin = await Admin.findOne({ email: "admin@gmail.com" });

    if (!admin) {
      const hashedPassword = await bcrypt.hash("Admin@123", 10);

      await Admin.create({
        email: "admin@gmail.com",
        password: hashedPassword,
      });

      console.log("✅ Default admin created (admin@gmail.com / Admin@123)");
    }
  } catch (err) {
    console.log("❌ Error creating admin:", err.message);
  }
};

// ===================== DATABASE CONNECT =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");
    await createDefaultAdmin();
  })
  .catch((err) => {
    console.log("❌ MongoDB error:", err.message);
  });

// ===================== SERVER START =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
