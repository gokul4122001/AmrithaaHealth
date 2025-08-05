import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Screens
import BookingHomeScreen from '../Screens/BookingFlow/BookingHomeScreen';
import CurrentBookingTab from '../Screens/BookingFlow/CurrentBookingTab';
import ScheduleBookingTab from '../Screens/BookingFlow/ScheduleBookingTab';
import CancelBookingTab from '../Screens/BookingFlow/CancelBookingTab';
import CompleteBookingTab from '../Screens/BookingFlow/CompleteBookingTab';

import CompleteBookingDetails from '../Screens/BookingFlow/CompleteViewDetails';
import CancelViewDetails from '../Screens/BookingFlow/CanceledDetailsPage';
import CurrentBookingDetails from '../Screens/BookingFlow/CurrentBookinDetailPage';
import ScheduleBooking from '../Screens/BookingFlow/ScheduleBookingdetailsPage';

const BookingStack = createNativeStackNavigator();

const BookingStackScreen = () => {
  return (
    <BookingStack.Navigator screenOptions={{ headerShown: false }}>
      <BookingStack.Screen
        name="BookingHomeScreen"
        component={BookingHomeScreen}
      />
      <BookingStack.Screen
        name="CurrentBookingDetails"
        component={CurrentBookingDetails}
      />
      <BookingStack.Screen
        name="CurrentBookingTab"
        component={CurrentBookingTab}
      />
      <BookingStack.Screen
        name="ScheduleBookingTab"
        component={ScheduleBookingTab}
      />
      <BookingStack.Screen
        name="CancelBookingTab"
        component={CancelBookingTab}
      />
      <BookingStack.Screen
        name="CompleteBookingTab"
        component={CompleteBookingTab}
      />
      <BookingStack.Screen
        name="CompleteBookingDetails"
        component={CompleteBookingDetails}
      />
      <BookingStack.Screen
        name="CancelViewDetails"
        component={CancelViewDetails}
      />
      <BookingStack.Screen
        name="ScheduleBooking"
        component={ScheduleBooking}
      />
    </BookingStack.Navigator>
  );
};

export default BookingStackScreen;
