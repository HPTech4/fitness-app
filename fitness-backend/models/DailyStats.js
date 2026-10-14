const mongoose = require('mongoose');

const dailyStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: String, // stored as 'YYYY-MM-DD' so we can query by day easily
    required: true,
    index: true,
  },
  steps: { type: Number, default: 0 },
  stepGoal: { type: Number, default: 10000 },
  calories: { type: Number, default: 0 },
  activeMinutes: { type: Number, default: 0 },
  water: { type: Number, default: 0 }, // ml
}, { timestamps: true });

// Ensure one stats doc per user per day
dailyStatsSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyStats', dailyStatsSchema);