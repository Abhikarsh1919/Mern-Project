import mongoose from "mongoose";

const problemSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    title: { type: String, required: true },
    level: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    yt: { type: String },
    lc: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
