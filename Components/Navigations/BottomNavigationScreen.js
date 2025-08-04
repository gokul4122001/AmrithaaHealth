import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import HomeStackScreen from './HomeStackNavigationScreen';
import EmergencyStackScreen from './EmergencyStackNavigationScreen';
import ProfileStackScreen from '../Navigations/ProfileStackNavigationScreen';
import ServiceStackScreen from '../Navigations/ServiceStackNavigationScreen';
import BoookingStackScreen from './BookingstackNavigation';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();


const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  const iconMap = {
    Home: 'home',
    Service: 'truck',
    Booking: 'calendar',
    Emergency: 'alert-triangle',
    Profile: 'user',
  };

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom || 10,
          height: 70 + (insets.bottom || 10),
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={onPress}
            style={[styles.button, isFocused && styles.activeButton]}
          >
            <View style={styles.tabContent}>
              <Icon
                name={iconMap[route.name]}
                size={20}
                color={isFocused ? '#fff' : '#7518AA'}
              />
              {isFocused && <Text style={styles.label}>{route.name}</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

// ✅ Main Bottom Tabs Navigator
const BottomTabs = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => !keyboardVisible && <CustomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackScreen}
      />
      <Tab.Screen
        name="Service"
        component={ServiceStackScreen}
      />
      <Tab.Screen
        name="Booking"
        component={BoookingStackScreen}
      />
      <Tab.Screen
        name="Emergency"
        component={EmergencyStackScreen}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

// ✅ Styles
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'space-around',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#7518AA',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 6,
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});
