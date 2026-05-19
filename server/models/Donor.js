const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  bloodGroup: {
    type: String,
    required: true,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  age: { type: Number, required: true },
  weight: { type: Number },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String },
  phone: { type: String, required: true },
  lastDonationDate: { type: Date },
  medicalConditions: { type: String },
  isAvailable: { type: Boolean, default: true },
  totalDonations: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

donorSchema.index({ city: 'text', bloodGroup: 1 });

module.exports = mongoose.model('Donor', donorSchema);
