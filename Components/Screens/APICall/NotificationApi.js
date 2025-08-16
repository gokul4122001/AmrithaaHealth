// src/APICall/LoginApi.js
import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api';

export const Notification_Api = async (token) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/notifications`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 🔹 Added token
        },
        timeout: 10000, // 10 seconds timeout
      }
    );
    return response.data;
  } catch (error) {
    console.log('Notification API ERROR:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
