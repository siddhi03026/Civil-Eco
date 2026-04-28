import Challenge from "../models/Challenge.js";
import UserProgress from "../models/UserProgress.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const dayDiff = (a, b) => {
  const oneDay = 24 * 60 * 60 * 1000;
  const d1 = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const d2 = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.floor((d1 - d2) / oneDay);
};

export const getChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find({ isActive: true }).sort({ createdAt: 1 });
  res.json({ success: true, count: challenges.length, challenges });
});

export const completeChallenge = asyncHandler(async (req, res) => {
  const { challengeId } = req.body;
  if (!challengeId) {
    res.status(400);
    throw new Error("challengeId is required");
  }

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) {
    res.status(404);
    throw new Error("Challenge not found");
  }

  let progress = await UserProgress.findOne({ userId: req.user._id });
  if (!progress) {
    progress = await UserProgress.create({
      userId: req.user._id,
      completedChallenges: [],
      totalPoints: 0,
      streak: 0,
    });
  }

  const alreadyDone = progress.completedChallenges.some(
    (id) => id.toString() === challenge._id.toString()
  );

  if (alreadyDone) {
    return res.json({
      success: true,
      message: "Challenge already completed",
      progress,
    });
  }

  const now = new Date();
  if (!progress.lastCompletedAt) {
    progress.streak = 1;
  } else {
    const diff = dayDiff(now, progress.lastCompletedAt);
    if (diff === 1) progress.streak += 1;
    else if (diff > 1) progress.streak = 1;
  }

  progress.completedChallenges.push(challenge._id);
  progress.totalPoints += challenge.points;
  progress.lastCompletedAt = now;

  await progress.save();

  res.status(201).json({
    success: true,
    message: "Challenge completed",
    earnedPoints: challenge.points,
    progress,
  });
});
