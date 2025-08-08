import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import { verifyOtp } from '../APICall/LoginApi';
import { useDispatch } from 'react-redux';
import { setAuthDetails } from '../../redux/slice/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Toast = ({ message, visible }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  let backgroundColor = 'green';
  if (message === 'Please enter a 4-digit OTP') backgroundColor = 'red';
  else if (message.includes('New OTP has been sent')) backgroundColor = 'green';

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        toastStyles.toastContainer,
        {
          backgroundColor,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={toastStyles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const OTPVerificationScreen = ({ route, navigation }) => {
  const [formData, setFormData] = useState({
    otp: ['', '', '', ''],
    mobileNumber: route?.params?.mobileNumber || '9345665442',
  });
  const [timer, setTimer] = useState(300); // 5 minutes
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();

  const formattedMobileNumber = `${formData.mobileNumber}`;

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setIsResendEnabled(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = msg => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4000);
  };

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    const newOtp = [...formData.otp];
    newOtp[index] = value;
    setFormData({ ...formData, otp: newOtp });

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (
      e.nativeEvent.key === 'Backspace' &&
      !formData.otp[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = formData.otp.join('');
    if (enteredOtp.length !== 4) {
      showToast('Please enter a 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await verifyOtp(formData.mobileNumber, enteredOtp);

      if (response) {
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('token', response.access_token);
        dispatch(
          setAuthDetails({
            access_token: response.access_token,
            user_type: response.user_type,
          }),
        );

        showToast('OTP verified successfully!');
        setTimeout(() => navigation.navigate('Login8'), 2000);
      } else {
        showToast(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      showToast(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    if (!isResendEnabled) return;
    setTimer(300); // reset to 5 minutes
    setIsResendEnabled(false);
    setFormData({ ...formData, otp: ['', '', '', ''] });
    inputRefs.current[0]?.focus();
    showToast(`New OTP has been sent to ${formattedMobileNumber}`);
  };

  const handleChangeMobile = () => {
    navigation?.goBack();
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <Toast message={toastMessage} visible={toastVisible} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoRow1}>
            <Image
              source={require('../../Assets/logos.png')}
              style={styles.logoImage}
            />
            <View>
              <Text style={styles.logoBrand}>Health</Text>
              <Text style={styles.logoBrand}>Umbrella</Text>
            </View>
          </View>

          <View style={styles.mainContent}>
            <View style={styles.content}>
              <Text style={styles.title}>
                OTP Sent to {formattedMobileNumber}
              </Text>
              <TouchableOpacity onPress={handleChangeMobile}>
                <Text style={styles.changeMobileText}>
                  Change Mobile number
                </Text>
              </TouchableOpacity>

              <View style={styles.otpContainer}>
                {formData.otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={ref => (inputRefs.current[index] = ref)}
                    style={[
                      styles.otpInput,
                      digit ? styles.otpInputFilled : styles.otpInputEmpty,
                    ]}
                    value={digit}
                    onChangeText={value => handleOtpChange(value, index)}
                    onKeyPress={e => handleKeyPress(e, index)}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                  />
                ))}
              </View>

              <Text style={styles.timerText}>{formatTime(timer)}</Text>

              <View style={styles.resendContainer}>
                <Text style={styles.resendQuestion}>
                  Didn't you receive any code?
                </Text>
                <TouchableOpacity
                  onPress={handleResend}
                  disabled={!isResendEnabled}
                >
                  <Text
                    style={[
                      styles.resendLink,
                      isResendEnabled
                        ? styles.resendEnabled
                        : styles.resendDisabled,
                    ]}
                  >
                    Resend
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Verifying...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  logoRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  logoImage: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  logoBrand: {
    fontSize: Fonts.size.FlashScreenSubHeading,
    color: Colors.statusBar,
    fontWeight: '700',
    fontFamily: Fonts.family.regular,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  title: {
    fontSize: Fonts.size.FlashScreenHeader,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  changeMobileText: {
    fontSize: Fonts.size.PageHeading,
    color: '#333',
    textDecorationLine: 'underline',
    marginBottom: 40,
    top: 10,
    fontWeight: '700',
    fontFamily: Fonts.family.regular,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 15,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderRadius: 8,
    borderWidth: 2,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  otpInputEmpty: {
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    color: '#333',
  },
  otpInputFilled: {
    borderColor: Colors.statusBar,
    backgroundColor: Colors.statusBar,
    color: 'white',
  },
  timerText: {
    fontSize: Fonts.size.PageHeading,
    color: '#ff4444',
    fontWeight: '600',
    marginBottom: 20,
    top: 20,
    fontFamily: Fonts.family.regular,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 20,
  },
  resendQuestion: {
    fontSize: Fonts.size.PageHeading,
    color: 'black',
    fontFamily: Fonts.family.regular,
  },
  resendLink: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
    left: 5,
  },
  resendEnabled: {
    color: '#ff4444',
  },
  resendDisabled: {
    color: '#ccc',
  },
  submitContainer: {
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  submitButton: {
    backgroundColor: '#7518AA',
    paddingVertical: 18,
    paddingHorizontal: 60,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#7c3aed',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
});

const toastStyles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
});

export default OTPVerificationScreen;
