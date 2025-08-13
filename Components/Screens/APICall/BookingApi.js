import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api';

export const Emergency_Booking = async (token, filter = 'current') => {
  try {
    const response = await axios.get(`${BASE_URL}/booking/list?filter=${filter}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    console.log(`Get booking/list?filter=${filter} API ERROR:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const getBookingDetails = async (id, token) => {
  try {
    const response = await axios.get(`${BASE_URL}/booking/detail`, {
      params: { id },
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching booking details:',
      error.response?.status,
      error.response?.data || error.message
    );
    throw error;
  }
};
