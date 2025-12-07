// backend/controllers/donorController.js
import Donor from "../models/Donor.js";

// REGISTER or UPDATE Donor Profile
export const registerAsDonor = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullName, bloodGroup, city, phone } = req.body;

    if (!fullName || !bloodGroup || !city || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let donor = await Donor.findOne({ userId });

    if (donor) {
      donor.fullName = fullName;
      donor.bloodGroup = bloodGroup;
      donor.city = city;
      donor.phone = phone;
      await donor.save();

      return res.json({
        message: "Donor profile updated successfully",
        donor,
      });
    }

    donor = await Donor.create({
      userId,
      fullName,
      bloodGroup,
      city,
      phone,
    });

    res.status(201).json({
      message: "Successfully registered as donor",
      donor,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register donor" });
  }
};

// Search Donors by City or Blood Group
export const searchDonors = async (req, res) => {
  try {
    const { city, bloodGroup } = req.query;
    const query = {};

    if (city) query.city = new RegExp(city, "i");
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const donors = await Donor.find(query)
      .populate("userId", "fullName") // fetch user real name
      .select("bloodGroup city phone"); // limit fields

    res.json(
      donors.map((d) => ({
        _id: d.userId?._id, // link chat to user, not donor database ID
        fullName: d.userId?.fullName,
        bloodGroup: d.bloodGroup,
        city: d.city,
        phone: d.phone,
      }))
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search failed" });
  }
};
