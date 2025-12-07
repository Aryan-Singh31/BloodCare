// backend/controllers/authController.js
import Donor from "../models/Donor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// POST /api/auth/register
export const registerDonor = async (req, res) => {
  try {
    const { fullName, email, phone, password, bloodGroup, city } = req.body;

    if (!fullName || !email || !phone || !password || !bloodGroup || !city) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const donorExists = await Donor.findOne({ email });
    if (donorExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const donor = await Donor.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      bloodGroup,
      city,
    });

    return res.status(201).json({
      _id: donor._id,
      fullName: donor.fullName,
      email: donor.email,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      token: generateToken(donor._id),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/auth/login
export const loginDonor = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const donor = await Donor.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }],
    });

    if (!donor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, donor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    return res.json({
      _id: donor._id,
      fullName: donor.fullName,
      email: donor.email,
      phone: donor.phone,
      bloodGroup: donor.bloodGroup,
      city: donor.city,
      token: generateToken(donor._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/auth/me  (protected)
export const getMe = async (req, res) => {
  return res.json(req.user);
};
