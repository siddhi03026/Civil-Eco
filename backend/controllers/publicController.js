import Issue from "../models/Issue.js";
import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getPublicStats = asyncHandler(async (req, res) => {
  const [totalUsers, resolvedIssues, activeIssues, pointsAgg] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    Issue.countDocuments({ status: "resolved" }),
    Issue.countDocuments(),
    UserProgress.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPoints" } } },
    ]),
  ]);

  const totalPoints = pointsAgg?.[0]?.total || 0;

  res.json({
    success: true,
    stats: {
      resolvedIssues,
      communities: totalUsers,
      totalPoints,
      activeIssues,
    },
  });
});
