// api/client.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_URL = 'http://localhost:5000/api';
//const API_URL = 'http://192.168.233.1:5000/api'; 
const API_URL = 'https://fitness-app-nrfw.onrender.com/api';
const client = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Automatically attach JWT to every request
client.interceptors.request.use(
  async (config) => {
    const stored = await AsyncStorage.getItem('user');
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;