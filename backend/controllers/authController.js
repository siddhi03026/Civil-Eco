import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

const signToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    mobile,
    city,
    state,
    country,
    areaType,
    password,
  } = req.body;

  if (!name || !email || !mobile || !city || !state || !country || !areaType || !password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error("Email already registered");
  }

  const usersCount = await User.countDocuments();
  const role = usersCount === 0 ? "admin" : "user";

  const user = await User.create({
    name,
    email,
    mobile,
    city,
    state,
    country,
    areaType,
    password,
    role,
  });

  const token = signToken(user._id, user.role);
  res.status(201).json({
    success: true,
    message: role === "admin" ? "Registered as admin" : "Registered successfully",
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      state: user.state,
      country: user.country,
      areaType: user.areaType,
      role: user.role,
      settings: user.settings,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = signToken(user._id, user.role);
  res.json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      city: user.city,
      state: user.state,
      country: user.country,
      areaType: user.areaType,
      role: user.role,
      settings: user.settings,
    },
  });
});
