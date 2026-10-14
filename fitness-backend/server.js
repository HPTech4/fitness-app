const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const routineRoutes = require('./routes/routines');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => { console.error(' MongoDB:', err.message); process.exit(1); });

mongoose.connection.on('disconnected', () => console.warn(' MongoDB disconnected'));

app.get('/', (req, res) => res.send('Fitness API is running'));

app.use('/api/auth', authRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/routines', routineRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));