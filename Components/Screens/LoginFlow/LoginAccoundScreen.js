// src/Screens/Auth/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Keyboard,
  Modal,
  FlatList,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  BackHandler,
} from 'react-native';
import { countries } from './CountryJson'; // must be in same folder
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import { sendOtp } from '../APICall/LoginApi';

const Toast = ({ visible, message, backgroundColor }) => {
  const slideAnim = new Animated.Value(-100);
  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[styles.toastContainer, { backgroundColor: backgroundColor || 'black', transform: [{ translateY: slideAnim }] }]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showModal, setShowModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState(countries[0].dial_code);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('#000');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Disable back only for this screen
  useFocusEffect(
    React.useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  // Disable iOS swipe back only for this screen
  useEffect(() => {
    navigation.setOptions({ gestureEnabled: false });
  }, [navigation]);

  const showToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleSendOTP = async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    if (!phoneInput.startsWith('+91')) {
      showToast('Number must start with +91', '#FF4C4C');
      setIsLoading(false);
      return;
    }

    if (phoneInput.length !== 13 || !/^\+91\d{10}$/.test(phoneInput)) {
      showToast('Enter exactly 10 digits after +91', '#FF4C4C');
      setIsLoading(false);
      return;
    }

    const mobileNumber = phoneInput.replace('+', '');

    try {
      const result = await sendOtp(mobileNumber);
      if (result?.status === 'success' || result?.message?.toLowerCase().includes('success')) {
        showToast('OTP Sent Successfully', '#28a745');
        setTimeout(() => {
          navigation.navigate('Login7', { mobileNumber: phoneInput });
        }, 1000);
      } else {
        const errorMsg = result?.message || 'Failed to send OTP';
        showToast(errorMsg, '#FF4C4C');
      }
    } catch (error) {
      let errorMsg = 'OTP sending failed';
      if (error.response) {
        errorMsg = error.response.data?.message || `Server error (${error.response.status})`;
      } else if (error.request) {
        errorMsg = 'No response from server';
      }
      showToast(errorMsg, '#FF4C4C');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountrySelect = (item) => {
    setSelectedCountry(item);
    setPhoneInput(item.dial_code);
    setShowModal(false);
  };

  const renderCountryItem = ({ item }) => (
    <TouchableOpacity style={styles.countryItem} onPress={() => handleCountrySelect(item)}>
      <Image source={{ uri: `https://flagcdn.com/w80/${item.code}.png` }} style={styles.modalFlag} resizeMode="contain" />
      <Text style={styles.countryText}>{item.name} ({item.dial_code})</Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 0 }}
          style={styles.gradientContainer}
        >
          <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} translucent />
          <SafeAreaView style={styles.container}>
            <Toast visible={toastVisible} message={toastMessage} backgroundColor={toastColor} />

            <View style={styles.logoRow1}>
              <Image source={require('../../Assets/logos.png')} style={styles.logoImage} />
              <View>
                <Text style={styles.logoBrand}>Health</Text>
                <Text style={styles.logoBrand}>Umbrella</Text>
              </View>
            </View>

            <View style={styles.content}>
              <Text style={styles.title}>
                Login your <Text style={{ color: '#7518AA', fontWeight: 'bold' }}>Account</Text>
              </Text>
              <Text style={styles.label}>Enter Mobile Number</Text>
              <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.countryPickerContainer} onPress={() => setShowModal(true)}>
                  <Image source={{ uri: `https://flagcdn.com/w80/${selectedCountry.code}.png` }} style={styles.flagIcon} resizeMode="contain" />
                  <Icons name="keyboard-arrow-down" size={25} color="#333" />
                </TouchableOpacity>

                <TextInput
                  style={styles.mobileInput}
                  value={phoneInput}
                  onChangeText={(text) => {
                    if (text.length === 0) {
                      setPhoneInput('+91');
                      return;
                    }
                    if (text.length <= 3 && !text.startsWith('+91')) {
                      setPhoneInput('+91');
                      return;
                    }
                    if (text.length > 3) {
                      const numbersOnly = text.replace(/[^0-9]/g, '');
                      const newValue = '+91' + numbersOnly.slice(2, 12);
                      setPhoneInput(newValue);
                    } else {
                      setPhoneInput(text);
                    }
                  }}
                  keyboardType="phone-pad"
                  placeholder="+91 9876543210"
                  placeholderTextColor="#999"
                  maxLength={13}
                  editable={!isLoading}
                />
              </View>
            </View>

            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity onPress={handleSendOTP} activeOpacity={0.8} disabled={isLoading}>
                <LinearGradient colors={['#7518AA', '#370B63']} style={styles.otpButton}>
                  <Text style={styles.otpButtonText}>
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Modal visible={showModal} animationType="slide">
              <SafeAreaView style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Select Country</Text>
                <FlatList
                  data={countries}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={renderCountryItem}
                />
                <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </SafeAreaView>
            </Modal>
          </SafeAreaView>
        </LinearGradient>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 40 },
  title: {
    fontSize: Fonts.size.FlashScreenHeader,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  label: {
    fontSize: Fonts.size.PageHeading,
    color: 'black',
    marginBottom: 15,
    fontWeight: '700',
    fontFamily: Fonts.family.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    paddingHorizontal: 10,
    minHeight: 70,
    top: 10,
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingHorizontal: 5,
  },
  flagIcon: { width: 40, height: 30, borderRadius: 6, marginRight: 5 },
  mobileInput: {
    flex: 1,
    fontSize: Fonts.size.PageHeading,
    color: '#333',
    paddingVertical: 10,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 90,
    backgroundColor: 'transparent',
  },
  otpButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#7c3aed',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  otpButtonText: {
    color: 'white',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
  modalContainer: { flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginVertical: 20, fontFamily: Fonts.family.regular },
  countryItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },
  modalFlag: { width: 50, height: 36, marginRight: 15, borderRadius: 6 },
  countryText: { fontSize: 16, fontFamily: Fonts.family.regular },
  closeButton: { backgroundColor: '#7c3aed', padding: 15, marginVertical: 20, borderRadius: 8, alignItems: 'center' },
  closeButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: Fonts.family.regular },
  logoRow1: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  logoImage: { width: 70, height: 70, marginRight: 8 },
  logoBrand: { fontSize: Fonts.size.FlashScreenSubHeading, color: Colors.statusBar, fontWeight: '700', fontFamily: Fonts.family.regular },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
    fontSize: Fonts.size.PageHeading,
    textAlign: 'center',
  },
});

export default LoginScreen;
