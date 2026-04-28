import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ success: true, user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const allowed = ["name", "mobile", "city", "state", "country", "areaType"];
  const settingsAllowed = ["language", "voiceEnabled", "notifications"];

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      user[key] = req.body[key];
    }
  }

  if (req.body.settings && typeof req.body.settings === "object") {
    for (const key of settingsAllowed) {
      if (req.body.settings[key] !== undefined) {
        user.settings[key] = req.body.settings[key];
      }
    }
  }

  await user.save();
  res.json({ success: true, message: "Profile updated", user });
});
