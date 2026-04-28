import Issue from "../models/Issue.js";
import User from "../models/User.js";
import UserProgress from "../models/UserProgress.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const isAdmin = req.user.role === "admin";
  const filter = isAdmin ? {} : { userId: req.user._id };

  let adminIssueStats = null;
  if (isAdmin) {
    const stats = await Issue.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $match: { "user.role": { $ne: "admin" } } },
      {
        $facet: {
          total: [{ $count: "count" }],
          resolved: [{ $match: { status: "resolved" } }, { $count: "count" }],
          pending: [{ $match: { status: "pending" } }, { $count: "count" }],
          inProgress: [{ $match: { status: "in-progress" } }, { $count: "count" }],
        },
      },
    ]);

    const row = stats[0] || {};
    adminIssueStats = {
      total: row.total?.[0]?.count || 0,
      resolved: row.resolved?.[0]?.count || 0,
      pending: row.pending?.[0]?.count || 0,
      inProgress: row.inProgress?.[0]?.count || 0,
    };
  }

  const [
    totalIssues,
    resolvedIssues,
    pendingIssues,
    inProgressIssues,
    progress,
    totalUsers,
  ] = await Promise.all([
    isAdmin ? Promise.resolve(adminIssueStats?.total ?? 0) : Issue.countDocuments(filter),
    isAdmin ? Promise.resolve(adminIssueStats?.resolved ?? 0) : Issue.countDocuments({ ...filter, status: "resolved" }),
    isAdmin ? Promise.resolve(adminIssueStats?.pending ?? 0) : Issue.countDocuments({ ...filter, status: "pending" }),
    isAdmin ? Promise.resolve(adminIssueStats?.inProgress ?? 0) : Issue.countDocuments({ ...filter, status: "in-progress" }),
    UserProgress.findOne({ userId: req.user._id }).populate("completedChallenges", "title points"),
    isAdmin ? User.countDocuments({ role: { $ne: "admin" } }) : Promise.resolve(undefined),
  ]);

  res.json({
    success: true,
    dashboard: {
      totalIssues,
      issueStatus: {
        resolved: resolvedIssues,
        pending: pendingIssues,
        inProgress: inProgressIssues,
      },
      userProgress: progress || {
        completedChallenges: [],
        totalPoints: 0,
        streak: 0,
      },
      ...(req.user.role === "admin" ? { totalUsers } : {}),
    },
  });
});
