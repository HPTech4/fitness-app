const mongoose = require('mongoose');

const routineItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  time: { type: String, required: true }, // e.g. "8:00 AM"
  duration: { type: String, required: true }, // e.g. "10 min"
  iconName: { type: String, default: 'fitness' },
  workoutId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }, // optional link
  completed: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  routines: [routineItemSchema],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);