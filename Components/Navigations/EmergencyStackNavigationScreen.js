import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EmergencyHomeScreen from '../Screens/EmergencyFlow/EmergencyHomeScreen';
import EmergencyHospitalScreen from '../Screens/EmergencyFlow/EmergencyHospitalScreen'
import EmergencyHospitalDetailScreen from '../Screens/EmergencyFlow/EmergencyHospitaldetailPage'



const EmergencyStack = createNativeStackNavigator();

const EmergencyStackScreen = () => {
  return (
    <EmergencyStack.Navigator>
      <EmergencyStack.Screen
        name="EmergencyHomeScreen"
        component={EmergencyHomeScreen}
        options={{ headerShown: false }}
      />
      
      <EmergencyStack.Screen
        name="EmergencyHospitalScreen"
        component={EmergencyHospitalScreen}
        options={{ headerShown: false }}
      />

      <EmergencyStack.Screen
        name="EmergencyHospitalDetailScreen"
        component={EmergencyHospitalDetailScreen}
        options={{ headerShown: false }}
      />
   

    </EmergencyStack.Navigator>
    
  );
};

export default EmergencyStackScreen;
