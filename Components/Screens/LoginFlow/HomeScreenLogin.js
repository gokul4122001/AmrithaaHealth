import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setAuthDetails } from '../../redux/slice/authSlice';

const { width } = Dimensions.get('window');
const radius = width * 0.35;

const icons = [
  require('../../Assets/flash1.png'),
  require('../../Assets/flash2.png'),
  require('../../Assets/flash3.png'),
  require('../../Assets/flash4.png'),
  require('../../Assets/flash5.png'),
  require('../../Assets/flash6.png'),
  require('../../Assets/flash7.png'),
  require('../../Assets/flash8.png'),
  require('../../Assets/flash9.png'),
];

export default function App() {
  const rotation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      const token = await AsyncStorage.getItem('token');

      if (isLoggedIn === 'true' && token) {
        dispatch(
          setAuthDetails({
            access_token: token,
          }),
        );
        navigation.navigate('MainApp');
      } else {
        navigation.navigate('Login2');
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  // Infinite slow rotation
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 10000,
        useNativeDriver: true,
        easing: Easing.linear,
      }),
    ).start();
  }, []);

  // Re-check login status every time screen is focused
  useFocusEffect(
    React.useCallback(() => {
      const timer = setTimeout(() => {
        checkLoginStatus();
      }, 1000);

      return () => clearTimeout(timer);
    }, [])
  );

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />

      <View style={styles.circle}>
        <View style={styles.circleRing} />

        {/* Rotating Icons */}
        <Animated.View
          style={[styles.iconGroup, { transform: [{ rotate: spin }] }]}
        >
          {icons.map((icon, index) => {
            const angle = (index / icons.length) * 2 * Math.PI;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);
            return (
              <Image
                key={index}
                source={icon}
                style={[
                  styles.icon,
                  {
                    position: 'absolute',
                    left: x + radius - 30,
                    top: y + radius - 30,
                  },
                ]}
              />
            );
          })}
        </Animated.View>

        {/* Center Logo */}
        <View style={styles.centerLogo}>
          <Image
            source={require('../../Assets/logos.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Health Umbrella</Text>
        </View>
      </View>

      {/* Footer Text */}
      <Text style={styles.footerText}>
        One Platform for All Your Health Care Needs
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7518AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: width,
    height: width,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleRing: {
    position: 'absolute',
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    borderWidth: 10,
    borderColor: '#B87EFF',
    opacity: 0.3,
    zIndex: 0,
  },
  iconGroup: {
    position: 'absolute',
    width: radius * 2,
    height: radius * 2,
    top: '50%',
    left: '50%',
    marginLeft: -radius,
    marginTop: -radius,
    zIndex: 1,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  centerLogo: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    zIndex: 2,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    fontFamily: Fonts.family.regular,
  },
  footerText: {
    position: 'absolute',
    bottom: '15%',
    color: '#ffff',
    fontSize: Fonts.size.PageHeading,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
});
