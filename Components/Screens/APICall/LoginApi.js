// ../APICall/otpService.js or LoginApi.js — whichever you're using
import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api';

export const sendOtp = async (mobile) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/otp/sms/request`,
      { mobile }, // ✅ only mobile number
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('API ERROR', error?.response?.data || error.message); // 🔍 log exact error
    throw error;
  }
};

export const verifyOtp = async (mobile, otp) => {
  try {
    const response = await axios.post(
      'https://www.myhealth.amrithaa.net/backend/api/otp/sms/verify',
      {
        mobile,
        otp,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Unknown error' };
  }
};