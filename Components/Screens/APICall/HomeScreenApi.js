import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api'; 

export const Select_Ambulance = async (token, pickupCoords, dropCoords, book_type = 'emergency') => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/get-distance-fare`,
      {
        pickup_lat: pickupCoords.latitude,
        pickup_long: pickupCoords.longitude,
        drop_lat: dropCoords.latitude,
        drop_long: dropCoords.longitude,
        book_type: book_type, // "emergency" or "sheduled"
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
