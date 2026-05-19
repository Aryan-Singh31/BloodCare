const express = require('express');
const router = express.Router();
const Donor = require('../models/Donor');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Register as donor
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const existing = await Donor.findOne({ user: req.user._id });
    if (existing) {
      // Update
      Object.assign(existing, req.body);
      await existing.save();
      return res.json({ message: 'Donor profile updated', donor: existing });
    }

    const donor = await Donor.create({ ...req.body, user: req.user._id });
    await User.findByIdAndUpdate(req.user._id, { isDonor: true, city: req.body.city });
    res.status(201).json({ message: 'Registered as donor!', donor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Search donors
router.get('/search', async (req, res) => {
  try {
    const { city, bloodGroup, page = 1 } = req.query;
    const query = { isAvailable: true };
    if (city) query.city = { $regex: city, $options: 'i' };
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const donors = await Donor.find(query)
      .populate('user', 'name avatar email')
      .skip((page - 1) * 12)
      .limit(12)
      .sort('-createdAt');

    const total = await Donor.countDocuments(query);
    res.json({ donors, total, pages: Math.ceil(total / 12) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my donor profile
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Toggle availability
router.patch('/availability', authMiddleware, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user._id });
    if (!donor) return res.status(404).json({ message: 'Donor profile not found' });
    donor.isAvailable = !donor.isAvailable;
    await donor.save();
    res.json({ isAvailable: donor.isAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
