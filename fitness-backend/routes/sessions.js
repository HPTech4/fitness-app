const express = require('express');
const WorkoutSession = require('../models/WorkoutSession');
const Workout = require('../models/Workout');
const DailyStats = require('../models/DailyStats');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// POST /api/sessions
// Body: { workoutId, durationCompleted, caloriesBurned }
router.post('/', auth, async (req, res) => {
  try {
    const { workoutId, durationCompleted, caloriesBurned } = req.body;

    const workout = await Workout.findById(workoutId);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    // 1. Save the session
    const session = await WorkoutSession.create({
      user: req.user.id,
      workout: workout._id,
      workoutTitle: workout.title,
      category: workout.category,
      durationCompleted,
      caloriesBurned: caloriesBurned ?? workout.calories,
      completedAt: new Date(),
    });

    // 2. Update today's DailyStats
    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
    await DailyStats.findOneAndUpdate(
      { user: req.user.id, date: today },
      {
        $inc: {
          calories: caloriesBurned ?? workout.calories,
          activeMinutes: Math.round(durationCompleted / 60),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/sessions — recent history (optional, useful for Stats)
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ user: req.user.id })
      .sort({ completedAt: -1 })
      .limit(20);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;