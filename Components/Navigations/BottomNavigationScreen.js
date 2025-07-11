import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CustomTabButton from '../Navigations/CustomTabButton';
import HomeStackScreen from './HomeStackNavigationScreen';
import EmergencyStackScreen from './EmergencyStackNavigationScreen';
import BookmarkScreen from '../Screens/HomeScreenFlow/BookmarkScreen';
import ProfileStackScreen from '../Navigations/ProfileStackNavigationScreen';
import ServiceStackScreen from '../Navigations/ServiceStackNavigationScreen';
import BoookingStackScreen from './BookingstackNavigation'


const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'purple',
        tabBarStyle: {
          backgroundColor: '#f5f5f5',
          height: 70,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          position: 'absolute', 
        },
        tabBarHideOnKeyboard: true, 
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Menu':
              iconName = 'view-grid-outline';
              break;
            case 'Bookmark':
              iconName = 'bookmark-outline';
              break;
            case 'Alert':
              iconName = 'alarm-light-outline';
              break;
            case 'Profile':
              iconName = 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarLabel: route.name === 'Home' ? 'Home' : '',
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Home" />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={ServiceStackScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Menu" />
          ),
        }}
      />
      <Tab.Screen
        name="Bookmark"
        component={BoookingStackScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Bookmark" />
          ),
        }}
      />
      <Tab.Screen
        name="Alert"
        component={EmergencyStackScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Alert" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
        options={{
          tabBarButton: (props) => (
            <CustomTabButton {...props} label="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;
