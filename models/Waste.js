const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: String,
    description: String,
    location: String,
    weight: Number,
    quantity: Number,

    // 🔥 Image filename stored here (served via /uploads)
    image: {
      type: String,
    },

    // 🔥 ADDED FOR DRIVER ASSIGN
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },

    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },

    status: {
      type: String,
      default: "Pending", //Pending → Accepted → Assigned → Collected
    },

    pickupDate: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Waste", wasteSchema);
