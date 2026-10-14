const express = require('express');
const DailyStats = require('../models/DailyStats');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

// GET /api/stats/today
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    let stats = await DailyStats.findOne({ user: req.user.id, date: today });

    // If no stats yet, return a fresh default (don't save yet)
    if (!stats) {
      stats = {
        steps: 0,
        stepGoal: 10000,
        calories: 0,
        activeMinutes: 0,
        water: 0,
        date: today,
      };
    }

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/weekly — last 7 days
router.get('/weekly', auth, async (req, res) => {
  try {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const docs = await DailyStats.find({
      user: req.user.id,
      date: { $in: days },
    });

    // Build a map for quick lookup
    const map = {};
    docs.forEach(d => { map[d.date] = d; });

    // Return a consistent 7-item array with defaults
    const result = days.map(date => ({
      date,
      dayLabel: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: map[date]?.calories || 0,
      activeMinutes: map[date]?.activeMinutes || 0,
      steps: map[date]?.steps || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/range?days=30
router.get('/range', auth, async (req, res) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 90); // cap at 90

    const dateList = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dateList.push(d.toISOString().split('T')[0]);
    }

    const docs = await DailyStats.find({
      user: req.user.id,
      date: { $in: dateList },
    });

    const map = {};
    docs.forEach((d) => { map[d.date] = d; });

    const result = dateList.map((date) => ({
      date,
      dayLabel: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      calories: map[date]?.calories || 0,
      activeMinutes: map[date]?.activeMinutes || 0,
      steps: map[date]?.steps || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/streak
router.get('/streak', auth, async (req, res) => {
  try {
    // Get all stats docs for this user, sorted by date desc
    const docs = await DailyStats
      .find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(60);

    // Build set of dates with activity (calories > 0)
    const activeDates = new Set(
      docs.filter((d) => d.calories > 0).map((d) => d.date)
    );

    const toDateStr = (d) => d.toISOString().split('T')[0];

    // Walk backwards from today, count consecutive active days
    let streak = 0;
    let current = new Date();
    const today = toDateStr(current);

    // If today isn't active yet, still count starting from yesterday
    if (!activeDates.has(today)) {
      current.setDate(current.getDate() - 1);
    }

    while (streak < 60) {
      const key = toDateStr(current);
      if (activeDates.has(key)) {
        streak += 1;
        current.setDate(current.getDate() - 1);
      } else {
        break;
      }
    }

    const workedOutToday = activeDates.has(today);

    res.json({
      streak,
      workedOutToday,
      lastActivity: docs[0]?.date || null,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;