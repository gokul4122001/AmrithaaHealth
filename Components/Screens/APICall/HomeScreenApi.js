// Select_Ambulance.js
import axios from 'axios';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api';

export const Select_Ambulance = async (
  token,
  pickupCoords,
  dropCoords,
  book_type,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/get-distance-fare`,
      {
        pickup_lat: pickupCoords.latitude,
        pickup_long: pickupCoords.longitude,
        drop_lat: dropCoords.latitude,
        drop_long: dropCoords.longitude,
        book_type: book_type,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
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

export const Select_AmbulanceDetails = async (
  token,
  pickupCoords,
  dropCoords,
  selectedAmbulance,
  booking_type,
  booking_for,
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/get-distance-fare-details`,
      {
        pickup_lat: pickupCoords.latitude,
        pickup_long: pickupCoords.longitude,
        drop_lat: dropCoords.latitude,
        drop_long: dropCoords.longitude,
        ambulance_type_id: selectedAmbulance.id,
        book_type: booking_type,
        booking_for:booking_for
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
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
export const booking_Create = async (
  token,
  pickupCoords,
  dropCoords,
  pick_address,
  drop_address,
  booking_type,
  total_amount,
  ambulance_type_id,
  assistent_amount,
  customer_name,
  customer_mobile
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/user/get-distance-fare-details`,
      {
        pickup_lat: pickupCoords.latitude,
        pickup_long: pickupCoords.longitude,
        drop_lat: dropCoords.latitude,
        drop_long: dropCoords.longitude,
        pick_address: pick_address,
        drop_address: drop_address,
        booking_type:booking_type,
        total_amount:total_amount,
        ambulance_type_id:ambulance_type_id,
        assistent_amount:assistent_amount,
        customer_name:customer_name,
        customer_mobile:customer_mobile
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
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
