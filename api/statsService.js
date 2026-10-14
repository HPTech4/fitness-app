// api/statsService.js
import client from './client';

export const fetchTodayStats = async () => {
  const res = await client.get('/stats/today');
  return res.data;
};

export const fetchWeeklyStats = async () => {
  const res = await client.get('/stats/weekly');
  return res.data;
};

export const fetchRangeStats = async (days) => {
  const res = await client.get(`/stats/range?days=${days}`);
  return res.data;
};

export const fetchStreak = async () => {
  const res = await client.get('/stats/streak');
  return res.data;
};