// api/sessionService.js
import client from './client';

export const logWorkoutSession = async ({ workoutId, durationCompleted, caloriesBurned }) => {
  const res = await client.post('/sessions', {
    workoutId,
    durationCompleted,
    caloriesBurned,
  });
  return res.data;
};

export const fetchRecentSessions = async () => {
  const res = await client.get('/sessions');
  return res.data;
};