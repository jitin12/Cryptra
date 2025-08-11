import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  direction: {
    type: String,
    enum: ['above', 'below'], 
    required: true,
  },
  isTriggered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Alert = mongoose.models.Alert || mongoose.model("Alert", alertSchema);
export default Alert;
