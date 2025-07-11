import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Screens/HomeScreenFlow/HomeScreen';
import AmbulanceBookingScreen from '../Screens/HomeScreenFlow/AmbulanceBookingScreen';
import SelectHospitalScreen from '../Screens/HomeScreenFlow/SelectHospitalpage';
import LiveTrakingScreen from '../Screens/HomeScreenFlow/LiveTrakingScreen';
import AmbulanceSelectionScreen from '../Screens/HomeScreenFlow/SelectAmbulanceScreen';
import BookingoverviewScreen from '../Screens/HomeScreenFlow/BookingoverviewScreen'
import LoadingScreen from '../Screens/HomeScreenFlow/LoadingPage';
import EmergencyHomeScreen from '../Screens/EmergencyFlow/EmergencyHomeScreen'
import EmergencyHospitalScreen from '../Screens/EmergencyFlow/EmergencyHospitalScreen'
import NoteAvaliableAmbulancePage from '../Screens/HomeScreenFlow/NoteAvaliableAmbulancePage'
import AmbulanceTrackingScreen from '../Screens/HomeScreenFlow/AmbulanceTrackingScreen';
import Bookingconformation from '../Screens/HomeScreenFlow/Bookingconformation';
import UnavailabledrivingScreen from  '../Screens/HomeScreenFlow/UnavailabledriverLoadingScreen'
import UnavailabledrivingConnectScreen from  '../Screens/HomeScreenFlow/UnavailableConnectdriverPage'
import TrackAmulanceDriverPage from  '../Screens/HomeScreenFlow/TrackAmbulanceDriverPage'


const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="AmbulanceBookingScreen"
        component={AmbulanceBookingScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="SelectHospitalScreen"
        component={SelectHospitalScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="AmbulanceSelectionScreen"
        component={AmbulanceSelectionScreen}
        options={{ headerShown: false }}
      />
      <HomeStack.Screen
        name="LiveTrakingScreen"
        component={LiveTrakingScreen}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="BookingoverviewScreen"
        component={BookingoverviewScreen}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="LoadingScreen"
        component={LoadingScreen}
        options={{ headerShown: false }}
      />
        <HomeStack.Screen
        name="EmergencyHomeScreen"
        component={EmergencyHomeScreen}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="EmergencyHospitalScreen"
        component={EmergencyHospitalScreen}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="NoteAvaliableAmbulancePage"
        component={NoteAvaliableAmbulancePage}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="AmbulanceTrackingScreen"
        component={AmbulanceTrackingScreen}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="Bookingconformation"
        component={Bookingconformation}
        options={{ headerShown: false }}
      />
         <HomeStack.Screen
        name="UnavailabledrivingScreen"
        component={UnavailabledrivingScreen}
        options={{ headerShown: false }}
      />
        <HomeStack.Screen
        name="UnavailabledrivingConnectScreen"
        component={UnavailabledrivingConnectScreen}
        options={{ headerShown: false }}
      />
       <HomeStack.Screen
        name="TrackAmulanceDriverPage"
        component={TrackAmulanceDriverPage}
        options={{ headerShown: false }}
      />
    </HomeStack.Navigator>
    
  );
};

export default HomeStackScreen;
