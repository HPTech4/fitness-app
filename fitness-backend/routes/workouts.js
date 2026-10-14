const express = require('express');
const Workout = require('../models/Workout');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/workouts?category=Strength
router.get('/', auth, async (req, res) => {
  try {
    const { category } = req.query;

    const filter = {};
    if (category && category !== 'All') filter.category = category;

    const workouts = await Workout.find(filter).sort({ createdAt: -1 });

    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/workouts/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });

    res.json(workout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;