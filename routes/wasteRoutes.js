const express = require("express");
const Waste = require("../models/Waste");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// ===============================
// SUBMIT WASTE (USER)
// ===============================
router.post(
  "/submit",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      const waste = new Waste({
        ...req.body,
        image: req.file ? req.file.filename : null,
        userId: req.userId,
      });

      await waste.save();
      res.status(201).json({ message: "Waste submitted", waste });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// ===============================
// GET ALL WASTE (ADMIN)
// ===============================
router.get("/", async (req, res) => {
  const waste = await Waste.find().sort({ createdAt: -1 });
  res.json(waste);
});

// ===============================
// GET USER WASTE
// ===============================
router.get("/my", auth, async (req, res) => {
  const waste = await Waste.find({ userId: req.userId }).sort({
    createdAt: -1,
  });
  res.json(waste);
});

// ===============================
// UPDATE STATUS
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.assignedDriver || req.body.driverId) {
      updateData.status = "Assigned";
    }

    const updated = await Waste.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===============================
// DELETE WASTE (ADMIN)
// ===============================
router.delete("/:id", auth, async (req, res) => {
  try {
    await Waste.findByIdAndDelete(req.params.id);
    res.json({ message: "Waste deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
