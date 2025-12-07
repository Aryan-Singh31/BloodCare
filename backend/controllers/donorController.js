// backend/controllers/donorController.js
import Donor from "../models/Donor.js";

export const registerAsDonor = async (req, res) => {
  try {
    const userId = req.user._id; // coming from auth middleware
    const { fullName, bloodGroup, city, phone } = req.body;

    if (!fullName || !bloodGroup || !city || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingDonor = await Donor.findOne({ userId });
    if (existingDonor) {
      return res
        .status(400)
        .json({ message: "You are already registered as a donor" });
    }

    const donor = await Donor.create({
      userId,
      fullName,
      bloodGroup,
      city,
      phone,
    });

    res.status(201).json({
      message: "Successfully registered as a donor!",
      donor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register donor" });
  }
};

// GET /donors/search?city=&bloodGroup=
export const searchDonors = async (req, res) => {
  try {
    const { city, bloodGroup } = req.query;
    const query = {};

    if (city) query.city = new RegExp(city, "i");
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const donors = await Donor.find(query).select(
      "fullName bloodGroup city phone userId"
    );

    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: "Search failed" });
  }
};

// GET all donors
export const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().select(
      "fullName bloodGroup city phone userId"
    );
    res.json(donors);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch donors" });
  }
};
