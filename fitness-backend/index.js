const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const workoutRoutes = require('./routes/workouts');
const sessionRoutes = require('./routes/sessions');
const statsRoutes = require('./routes/stats');
const routineRoutes = require('./routes/routines');
const { authLimiter, apiLimiter } = require("./middlewares/rateLimiter");
const { securityMiddleware } = require('./middlewares/securityLogger');

const app = express();
const allowedOrigins = [
  'http://localhost:8081',    
  'http://localhost:19006',    
  'http://localhost:3000',      
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json({ limit: '10kb' } ));
app.use(securityMiddleware);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(' MongoDB Connected'))
  .catch(err => { console.error(' MongoDB:', err.message); process.exit(1); });

mongoose.connection.on('disconnected', () => console.warn(' MongoDB disconnected'));

app.get('/', (req, res) => res.send('Fitness API is running'));

app.use('/api/auth', authLimiter, authRoutes);      
app.use('/api/workouts', apiLimiter, workoutRoutes); 
app.use('/api/sessions', apiLimiter, sessionRoutes);
app.use('/api/stats', apiLimiter, statsRoutes);
app.use('/api/routines', apiLimiter, routineRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));