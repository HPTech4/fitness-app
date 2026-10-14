const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number },
  reps: { type: Number },
  duration: { type: Number },       // seconds, for time-based exercises
  restTime: { type: Number, default: 30 }, // seconds between sets
  image: String,
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  category: {
    type: String,
    enum: ['Strength', 'Cardio', 'Mobility', 'All'],
    default: 'Strength',
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner',
  },
  duration: { type: Number, required: true },   // minutes
  calories: { type: Number, default: 0 },
  image: { type: String, required: true },
  exercises: [exerciseSchema],
  isRecommended: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);