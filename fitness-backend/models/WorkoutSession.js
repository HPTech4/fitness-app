const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  workout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workout',
    required: true,
  },
  
  workoutTitle: { type: String, required: true },
  category: { type: String, required: true },

  // Session results
  durationCompleted: { type: Number, required: true }, // in seconds
  caloriesBurned: { type: Number, default: 0 },
  completedAt: { type: Date, default: Date.now, index: true },
}, { timestamps: true });

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);