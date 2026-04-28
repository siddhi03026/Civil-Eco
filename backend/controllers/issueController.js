import Issue from "../models/Issue.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const createIssue = asyncHandler(async (req, res) => {
  const { description, issueType, severity, latitude, longitude } = req.body;

  if (!description || !issueType || latitude === undefined || longitude === undefined) {
    res.status(400);
    throw new Error("description, issueType, latitude, longitude are required");
  }

  const issue = await Issue.create({
    userId: req.user._id,
    image: req.file ? `/uploads/${req.file.filename}` : undefined,
    description,
    issueType,
    severity: severity || "medium",
    location: {
      latitude: Number(latitude),
      longitude: Number(longitude),
    },
  });

  res.status(201).json({ success: true, issue });
});

export const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find()
    .populate("userId", "name email mobile city state country areaType role")
    .sort({ createdAt: -1 });

  res.json({ success: true, count: issues.length, issues });
});

export const getUserIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: issues.length, issues });
});

export const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["pending", "in-progress", "resolved"];
  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  issue.status = status;
  await issue.save();

  res.json({ success: true, message: "Issue status updated", issue });
});

export const respondToIssue = asyncHandler(async (req, res) => {
  const { text, voice } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("Response text is required");
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    res.status(404);
    throw new Error("Issue not found");
  }

  const isOwner = issue.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === "admin";
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error("Not allowed to respond to this issue");
  }

  issue.responses.push({
    sender: isAdmin ? "admin" : "user",
    text,
    voice: Boolean(voice),
    timestamp: new Date(),
  });

  await issue.save();

  res.status(201).json({
    success: true,
    message: "Response added",
    responses: issue.responses,
  });
});

export const getMapIssues = asyncHandler(async (req, res) => {
  const data = await Issue.find({}, { "location.latitude": 1, "location.longitude": 1, severity: 1, status: 1 });
  const markers = data.map((item) => ({
    latitude: item.location.latitude,
    longitude: item.location.longitude,
    severity: item.severity,
    status: item.status,
  }));

  res.json({ success: true, markers });
});
