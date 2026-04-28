import User from "../models/User.js";
import Issue from "../models/Issue.js";
import UserProgress from "../models/UserProgress.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: { $ne: "admin" } })
    .select("-password")
    .sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Admin users cannot be deleted");
  }

  await Promise.all([
    Issue.deleteMany({ userId: user._id }),
    UserProgress.deleteOne({ userId: user._id }),
    user.deleteOne(),
  ]);

  res.json({ success: true, message: "User and related data deleted" });
});

export const getAllIssuesAdmin = asyncHandler(async (req, res) => {
  const issues = await Issue.aggregate([
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
    { $sort: { createdAt: -1 } },
    {
      $project: {
        _id: 1,
        description: 1,
        issueType: 1,
        severity: 1,
        status: 1,
        createdAt: 1,
        location: 1,
        responses: 1,
        userId: {
          name: "$user.name",
          email: "$user.email",
          city: "$user.city",
          state: "$user.state",
          country: "$user.country",
          areaType: "$user.areaType",
          role: "$user.role",
        },
      },
    },
  ]);

  res.json({ success: true, count: issues.length, issues });
});
