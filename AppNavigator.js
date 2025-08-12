// AppNavigator.js
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import BottomTabs from './Components/Navigations/BottomNavigationScreen';
import Login1 from './Components/Screens/LoginFlow/HomeScreenLogin';
import Login2 from './Components/Screens/LoginFlow/SecondScreenLoginPage';
import Login3 from './Components/Screens/LoginFlow/ThirdScreenLoginPage';
import Login4 from './Components/Screens/LoginFlow/FourthScreenLoginPage';
import Login5 from './Components/Screens/LoginFlow/FifthScreenLoginPage';
import Login6 from './Components/Screens/LoginFlow/LoginAccoundScreen';
import Login7 from './Components/Screens/LoginFlow/LoginOtpScreen';
import Login8 from './Components/Screens/LoginFlow/Conguratulation';

import { UserProfileAPI } from './Components/Screens/APICall/ProfileApi';
import { setUserProfile } from './Components/redux/slice/authSlice';

import TrackAmulanceDriverPage from './Components/Screens/HomeScreenFlow/TrackAmbulanceDriverPage'

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const token = useSelector(state => state.auth.token);
  const UserProfile = useSelector(state => state.auth.UserProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!token) return;

    const fetchUserProfile = async () => {
      try {
        const profileData = await UserProfileAPI(token);
        dispatch(setUserProfile({ UserProfile: profileData?.data }));
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    fetchUserProfile();
  }, [token, dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="TrackAmulanceDriverPage"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="TrackAmulanceDriverPage" component={TrackAmulanceDriverPage} />

        <Stack.Screen name="MainApp" component={BottomTabs} />
        <Stack.Screen name="Login1" component={Login1} />
        <Stack.Screen name="Login2" component={Login2} />
        <Stack.Screen name="Login3" component={Login3} />
        <Stack.Screen name="Login4" component={Login4} />
        <Stack.Screen name="Login5" component={Login5} />
        <Stack.Screen name="Login6" component={Login6} />
        <Stack.Screen name="Login7" component={Login7} />
        <Stack.Screen name="Login8" component={Login8} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}