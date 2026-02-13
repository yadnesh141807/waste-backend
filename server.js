const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const Admin = require("./models/Admin");

// Routes
const adminRoutes = require("./routes/adminRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const authRoutes = require("./routes/authRoutes");
const driverRoutes = require("./routes/driverRoutes");

const app = express();

// ===================== MIDDLEWARE =====================
app.use(cors());
app.use(express.json());

// 🔥 Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===================== ROOT TEST ROUTE =====================
app.get("/", (req, res) => {
  res.status(200).send("Waste Backend is running 🚀");
});

// ===================== API ROUTES =====================
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/driver", driverRoutes);

// ===================== 404 FALLBACK =====================
app.use((req, res) => {
  res.status(404).send("Route not found ❌");
});

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
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
