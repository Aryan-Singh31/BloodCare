import BloodRequest from "../models/BloodRequest.js";
import Notification from "../models/Notification.js";
import Donor from "../models/Donor.js";

// Create a blood request + notify matching donors
export const createRequest = async (req, res) => {
  try {
    const { patientName, bloodGroup, city, hospital, units, urgency, contact, message } = req.body;
    if (!patientName || !bloodGroup || !city || !contact)
      return res.status(400).json({ message: "Required fields missing" });

    const request = await BloodRequest.create({
      userId: req.user._id, patientName, bloodGroup, city,
      hospital, units, urgency, contact, message,
    });

    // Notify matching donors in same city
    const donors = await Donor.find({
      bloodGroup: { $in: getCompatible(bloodGroup) },
      city: new RegExp(city, "i"),
    }).populate("userId", "_id");

    const notifications = donors.map((d) => ({
      userId: d.userId._id,
      type: "blood_request",
      title: `🩸 Urgent: ${bloodGroup} blood needed in ${city}`,
      body: `${patientName} needs ${units} unit(s) at ${hospital || city}. ${urgency === "critical" ? "CRITICAL!" : ""}`,
      link: `/requests`,
    }));

    if (notifications.length) await Notification.insertMany(notifications);

    res.status(201).json(request);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create request" });
  }
};

// Get all active requests (optionally filter)
export const getRequests = async (req, res) => {
  try {
    const { city, bloodGroup } = req.query;
    const query = { isActive: true };
    if (city) query.city = new RegExp(city, "i");
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const requests = await BloodRequest.find(query)
      .sort({ createdAt: -1 })
      .populate("userId", "fullName");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
};

// Close a request
export const closeRequest = async (req, res) => {
  try {
    const req_ = await BloodRequest.findById(req.params.id);
    if (!req_) return res.status(404).json({ message: "Not found" });
    if (req_.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized" });
    req_.isActive = false;
    await req_.save();
    res.json({ message: "Request closed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to close request" });
  }
};

// Blood group compatibility map
function getCompatible(bg) {
  const map = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    "AB-": ["A-", "B-", "AB-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"],
  };
  return map[bg] || [bg];
}
