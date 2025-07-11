import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ServiceHomeScreen from '../Screens/ServiceFlow/ServiceHomeScreenPage';
import ServiceHospitalScreen from '../Screens/ServiceFlow/ServiceHospitalOverviewPage';
import ServiceHospitalDetailScreen from '../Screens/ServiceFlow/SeviceHospitalDetailePage';
import EnquiryFormpage from '../Screens/ServiceFlow/EnquiryFormPage';
import BookingSuccessScreen from '../Screens/ServiceFlow/BookingSucessfullyPage';



const ServiceStack = createNativeStackNavigator();

const ServiceStackScreen = () => {
  return (
    <ServiceStack.Navigator>
      <ServiceStack.Screen
        name="ServiceHomeScreen"
        component={ServiceHomeScreen}
        options={{ headerShown: false }}
      />
      <ServiceStack.Screen
        name="ServiceHospitalScreen"
        component={ServiceHospitalScreen}
        options={{ headerShown: false }}
      />
        <ServiceStack.Screen
        name="ServiceHospitalDetailScreen"
        component={ServiceHospitalDetailScreen}
        options={{ headerShown: false }}
      />
    <ServiceStack.Screen
        name="EnquiryFormpage"
        component={EnquiryFormpage}
        options={{ headerShown: false }}
      />
  <ServiceStack.Screen
        name="BookingSuccessScreen"
        component={BookingSuccessScreen}
        options={{ headerShown: false }}
      />
    </ServiceStack.Navigator>
    
  );
};

export default ServiceStackScreen;
