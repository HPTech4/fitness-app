// api/routineService.js
import client from './client';

export const fetchRoutines = async () => {
  const res = await client.get('/routines');
  return res.data;
};

export const addRoutine = async ({ title, time, duration, iconName }) => {
  const res = await client.post('/routines', { title, time, duration, iconName });
  return res.data;
};

export const toggleRoutine = async (routineId) => {
  const res = await client.patch(`/routines/${routineId}/toggle`);
  return res.data;
};