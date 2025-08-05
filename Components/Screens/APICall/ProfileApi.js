// src/APICall/UserProfileApi.jsraja
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserName } from '../../redux/slice/authSlice';

const BASE_URL = 'https://www.myhealth.amrithaa.net/backend/api'; 


export const UserProfileAPI = async token => {
  try {
    const response = await axios.get(
      `${BASE_URL}/user/profile`, // Direct use of BASE_URL
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log('User Profile API ERROR:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const updateUserProfile = async (profileData, token,dispatch) => {
  const formData = new FormData();
  // Add main profile fields
  formData.append('name', profileData.name);
  formData.append('email', profileData.email);
  formData.append('dob', profileData.dob);
  formData.append('age', profileData.age);
  formData.append('gender', profileData.gender);
  formData.append('mobileNumber', profileData.mobileNumber);

  // Add profile photo if exists
  if (
    profileData.profile_photo &&
    profileData.profile_photo.startsWith('file://')
  ) {
    formData.append('profile_photo', {
      uri: profileData.profile_photo,
      type: 'image/jpeg', // or get actual type from uri
      name: 'profile.jpg',
    });
  }

  // Add family members if included
  if (profileData.familyDetails && profileData.familyDetails.length > 0) {
    profileData.familyDetails.forEach((member, index) => {
      formData.append(`familyDetails[${index}][name]`, member.name);
      formData.append(`familyDetails[${index}][email]`, member.email);
      formData.append(`familyDetails[${index}][mobile]`, member.mobile);
      formData.append(`familyDetails[${index}][dob]`, member.dob);
      formData.append(`familyDetails[${index}][age]`, member.age);
      formData.append(`familyDetails[${index}][gender]`, member.gender);
    });
  }
  console.log('formData:', formData);
  console.log('profileData:', profileData);

  try {
    const response = await axios.post(
      `${BASE_URL}/user/profile_update`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    dispatch(
      setUserName({
        userName: profileData.name,
      }),
    );

    // Log the response for debugging
    console.log('Response:', response.data);

    return response.data;
  } catch (error) {
    // Log error details
    if (error.response) {
      // Server responded with a status code outside the range of 2xx
      console.error('Error Response:', error.response.data);
      console.error('Error Status:', error.response.status);
      console.error('Error Headers:', error.response.headers);
    } else if (error.request) {
      // No response was received
      console.error('Error Request:', error.request);
    } else {
      // Something else triggered the error
      console.error('Error Message:', error.message);
    }

    throw error; // Re-throw the error after logging
  }
};

export const Term_Condition = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/get_terms_conditions`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.log('Get get_terms_conditions API ERROR:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};