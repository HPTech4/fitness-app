const express = require('express');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/routines — get current user's routines
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('routines');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.routines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/routines — add a routine item (useful for "Add routine" feature later)
router.post('/', auth, async (req, res) => {
  try {
    const { title, time, duration, iconName } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.routines.push({ title, time, duration, iconName: iconName || 'fitness' });
    await user.save();

    res.status(201).json(user.routines[user.routines.length - 1]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/routines/:id/toggle — flip completed status
router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const routine = user.routines.id(req.params.id);
    if (!routine) return res.status(404).json({ message: 'Routine not found' });

    routine.completed = !routine.completed;
    await user.save();

    res.json(routine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;