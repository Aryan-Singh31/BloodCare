const mongoose = require('mongoose');

const urgentRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
  unitsNeeded: { type: Number, required: true },
  hospital: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  message: { type: String },
  isFulfilled: { type: Boolean, default: false },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  createdAt: { type: Date, default: Date.now },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ['blood-health', 'lifestyle', 'nutrition', 'donation-tips', 'awareness'], required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  readTime: { type: Number, default: 5 },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports.UrgentRequest = mongoose.model('UrgentRequest', urgentRequestSchema);
module.exports.Article = mongoose.model('Article', articleSchema);
