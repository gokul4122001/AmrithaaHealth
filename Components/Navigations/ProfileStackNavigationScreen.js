import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../Screens/ProfileFlow/ProfileScreen';
import Profileone from '../Screens/ProfileFlow/ProfileScreenone'
import ProfileTwo from '../Screens/ProfileFlow/ProfileTwo'
import ChangePassword from '../Screens/ProfileFlow/ChangePasswordScreen'
import EmergencyContactScreen from '../Screens/ProfileFlow/ProfileEmergencyContactPage';
import MyReport from '../Screens/ProfileFlow/MyReport';
import ListofHospitals from '../Screens/ProfileFlow/ReportListOfEnquiryPage';
import TermsAndConditionsScreen from '../Screens/ProfileFlow/Terms&ConditionPage';

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="Profileone"
        component={Profileone}
        options={{ headerShown: false }}
      />
       <ProfileStack.Screen
        name="ProfileTwo"
        component={ProfileTwo}
        options={{ headerShown: false }}
      />
      <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
       <ProfileStack.Screen
        name="EmergencyContactScreen"
        component={EmergencyContactScreen}
        options={{ headerShown: false }}
      />
        <ProfileStack.Screen
        name="MyReport"
        component={MyReport}
        options={{ headerShown: false }}
      />
        <ProfileStack.Screen
        name="ListofHospitals"
        component={ListofHospitals}
        options={{ headerShown: false }}
      />
       <ProfileStack.Screen
        name="TermsAndConditionsScreen"
        component={TermsAndConditionsScreen}
        options={{ headerShown: false }}
      />

    </ProfileStack.Navigator>
    
  );
};

export default ProfileStackScreen;
