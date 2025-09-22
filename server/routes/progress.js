import express from "express";
import User from "../models/User.js";
import Problem from "../models/Problem.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete/:problemId", authMiddleware, async (req, res) => {
  try {
    const { problemId } = req.params;
    const user = await User.findById(req.user.id);

    if (!user.progress.includes(problemId)) {
      user.progress.push(problemId);
      await user.save();
    }

    res.json({ message: "Problem marked as completed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const total = await Problem.countDocuments();
    const user = await User.findById(req.user.id);
    const completed = user.progress.length;

    res.json({
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
