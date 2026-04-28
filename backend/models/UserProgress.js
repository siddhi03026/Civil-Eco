import mongoose from "mongoose";

const userProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedChallenges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Challenge" }],
    totalPoints: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastCompletedAt: { type: Date },
  },
  { timestamps: true }
);

const UserProgress = mongoose.model("UserProgress", userProgressSchema);
export default UserProgress;
