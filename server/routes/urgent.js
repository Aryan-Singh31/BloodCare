const express = require('express');
const router = express.Router();
const { UrgentRequest } = require('../models/Models');
const Donor = require('../models/Donor');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const { sendUrgentRequestAlert } = require('../utils/email');

// Post urgent request
router.post('/', authMiddleware, async (req, res) => {
  try {
    const request = await UrgentRequest.create({ ...req.body, user: req.user._id });
    await request.populate('user', 'name avatar');

    // Notify donors in the same city — fire and forget (don't block response)
    notifyDonorsInCity(request).catch(err =>
      console.error('Error sending donor notifications:', err)
    );

    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send email alerts to all available donors in the same city
async function notifyDonorsInCity(request) {
  // Find all available donors in the same city
  const donors = await Donor.find({
    city: { $regex: request.city, $options: 'i' },
    isAvailable: true,
  }).populate('user', 'name email');

  if (!donors.length) return;

  // Send emails in parallel (max 50 at a time to avoid rate limits)
  const BATCH_SIZE = 50;
  for (let i = 0; i < donors.length; i += BATCH_SIZE) {
    const batch = donors.slice(i, i + BATCH_SIZE);
    await Promise.allSettled(
      batch.map(donor =>
        sendUrgentRequestAlert(donor.user.email, donor.user.name, request)
      )
    );
  }

  console.log(`Notified ${donors.length} donor(s) in ${request.city} about urgent request.`);
}

// Get urgent requests by city
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { city } = req.query;
    const query = {
      isFulfilled: false,
      expiresAt: { $gt: new Date() },
    };
    if (city) query.city = { $regex: city, $options: 'i' };

    const requests = await UrgentRequest.find(query)
      .populate('user', 'name avatar')
      .sort('-createdAt')
      .limit(20);
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as fulfilled
router.patch('/:id/fulfill', authMiddleware, async (req, res) => {
  try {
    const request = await UrgentRequest.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isFulfilled: true },
      { new: true }
    );
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my requests
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const requests = await UrgentRequest.find({ user: req.user._id }).sort('-createdAt');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
