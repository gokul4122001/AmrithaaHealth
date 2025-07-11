import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BookingHomeScreen from '../Screens/BookingFlow/BookingHomeScreen';
import BookingDetailsScreen from '../Screens/BookingFlow/BookingDetailPage';
const BookingStack = createNativeStackNavigator();

const BoookingStackScreen = () => {
  return (

    <BookingStack.Navigator>

      <BookingStack.Screen
        name="BookingHomeScreen"
        component={BookingHomeScreen}
        options={{ headerShown: false }}
      />

        <BookingStack.Screen
        name="BookingDetailsScreen"
        component={BookingDetailsScreen}
        options={{ headerShown: false }}
      />
      
    
    </BookingStack.Navigator>
    
  );
};

export default BoookingStackScreen;
