const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "driver" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
