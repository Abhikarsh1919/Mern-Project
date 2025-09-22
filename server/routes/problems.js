import express from "express";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().lean();
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

router.get("/progress", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const total = await Problem.countDocuments();
    const completed = user.progress.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      progress: user.progress || [],
      total,
      completed,
      percentage,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});

router.post("/progress", authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.progress = progress;
    await user.save();

    const total = await Problem.countDocuments();
    const completed = user.progress.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({
      progress: user.progress,
      total,
      completed,
      percentage,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
