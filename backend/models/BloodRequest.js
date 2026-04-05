import mongoose from "mongoose";

const bloodRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    city: { type: String, required: true },
    hospital: { type: String },
    units: { type: Number, default: 1 },
    urgency: { type: String, enum: ["normal", "urgent", "critical"], default: "normal" },
    contact: { type: String, required: true },
    message: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("BloodRequest", bloodRequestSchema);
