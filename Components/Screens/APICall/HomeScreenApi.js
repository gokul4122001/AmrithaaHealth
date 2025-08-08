// Select_Ambulance.js
import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api';

export const Select_Ambulance = async (token, pickupCoords, dropCoords, book_type = 'emergency') => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/get-distance-fare`,
      {
        pickup_latitude: pickupCoords.latitude,
        pickup_longitude: pickupCoords.longitude,
        drop_latitude: dropCoords.latitude,
        drop_longitude: dropCoords.longitude,
       book_type: 'emergency' // or 'schedule'

      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('SelectAmbulance API ERROR:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};
