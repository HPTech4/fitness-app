// api/userService.js
import client from './client';

export const getUserStats = async (userId) => {
  try {
    const response = await client.get(`/users/${userId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};