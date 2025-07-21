// src/APICall/LoginApi.js
import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api';

export const sendOtp = async (mobile) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/otp/sms/request`,
      { mobile },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000, // 10 seconds timeout
      }
    );
    return response.data;
  } catch (error) {
    console.log('OTP API ERROR:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

 
export const verifyOtp = async (mobile, otp) => {
  try {
    const response = await axios.post(`${BASE_URL}/otp/sms/verify?mobile=${mobile}&otp=${otp}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Unknown error' };
  }
};
