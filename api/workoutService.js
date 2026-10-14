// api/workoutService.js
import client from './client';

export const fetchWorkouts = async (category) => {
  const params = {};
  if (category && category !== 'All') params.category = category;

  const res = await client.get('/workouts', { params });
  return res.data;
};

export const fetchWorkoutById = async (id) => {
  const res = await client.get(`/workouts/${id}`);
  return res.data;
};