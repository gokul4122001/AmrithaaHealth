import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,   
  TouchableOpacity,
  Alert, 
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';

const { width, height } = Dimensions.get('window');

const CongratulationsScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const reduxToken = useSelector(state => state.auth.token);

  // State for booking status
  const [bookingStatus, setBookingStatus] = useState({
    is_accepted: false,
    still_waiting: true,
    is_cancelled: false,
    message: 'Waiting For Booking Accept',
  });

  // Modal visibility for cancellation
  const [showModal, setShowModal] = useState(false);

  // Error display state
  const [error, setError] = useState(null);

  // Manage polling interval and component mounted state
  const intervalRef = useRef(null);
  const isMountedRef = useRef(true);

  // Retrieve token from Redux or AsyncStorage
  const getAuthToken = async () => {
    try {
      if (reduxToken) return reduxToken;
      const storedToken = await AsyncStorage.getItem('userToken');
      if (storedToken) return storedToken;

      // No token found, reset navigation to LoginScreen
      stopPolling();
      navigation.reset({ index: 0, routes: [{ name: 'LoginScreen' }] });
      return null;
    } catch (error) {
      console.log('Error getting auth token:', error);
      return null;
    }
  };

  // Check booking status from backend
  const checkBookingStatus = async () => {
    try {
      const tokenValue = await getAuthToken();
      if (!tokenValue) return;

      const response = await fetch(
        `https://www.myhealth.amrithaa.net/backend/api/user/booking/is_accepted?booking_id=${id}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenValue}`,
          },
        }
      );
console.log(response,'response')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!isMountedRef.current) return; // Avoid state updates if unmounted

      const newStatus = {
        is_accepted: data.is_accepted || false,
        still_waiting: data.still_waiting || false,
        is_cancelled: data.is_cancelled || false,
        message: data.message || 'Processing...',
      };
      setBookingStatus(newStatus);

      // Handle cancellation - show modal and stop polling
      if (newStatus.is_cancelled) {
        stopPolling();
        setShowModal(true);
      }

      // Handle acceptance - navigate after showing tick animation
      if (newStatus.is_accepted && !newStatus.is_cancelled) {
        stopPolling();
        setTimeout(() => {
          if (isMountedRef.current) {
            navigation.replace('TrackAmulanceDriverPage', { booking_id: id });
          }
        }, 2500); // Allow time for tick animation to play
      }
    } catch (error) {
      console.error('API Error:', error.message);
      setError(error.message);
    }
  };

  // Start polling every 5 seconds, with max 24 attempts (~2 minutes)
  const startPolling = () => {
    stopPolling();
    checkBookingStatus();
    let pollCount = 0;

    intervalRef.current = setInterval(() => {
      pollCount++;
      if (pollCount > 24) {
        stopPolling();
        setError('No response after 2 minutes.');
        return;
      }
      checkBookingStatus();
    }, 5000);
  };

  // Stop polling timer
  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Lifecycle hooks
  useEffect(() => {   
    if (!id) {
      Alert.alert('Error', 'Booking ID missing', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
      return;
    }
    isMountedRef.current = true;
    startPolling();

    // Intercept Android hardware back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('Cancel Booking?', 'Do you want to cancel this booking?', [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            stopPolling();
            navigation.goBack();
          },
        },
      ]);
      return true; // Prevent default back action
    });

    return () => {
      isMountedRef.current = false;
      stopPolling();
      backHandler.remove();
    };
  }, [id]);

  // Modal close handler
  const handleModalClose = () => {
    setShowModal(false);
    navigation.goBack();
  };

  // Retry polling after cancel modal
  const handleRetry = () => {
    setShowModal(false);
    setBookingStatus({
      is_accepted: false,
      still_waiting: true,
      is_cancelled: false,
      message: 'Waiting For Booking Accept',
    });
    startPolling();
  };

  // Select appropriate Lottie animation based on status
  const getLottieSource = () => {
    if (bookingStatus.is_accepted) {
      return require('../../Assets/lottie/tick.json');
    }
    return require('../../Assets/lottie/Loading3.json');
  };

  // Display messages based on current status
  const getDisplayText = () => {
    if (bookingStatus.is_accepted) {
      return { primary: 'Booking Confirmed!', secondary: 'Ambulance Arriving Shortly' };
    }
    if (bookingStatus.still_waiting) {
      return { primary: 'Finding Driver...', secondary: bookingStatus.message };
    }
    if (bookingStatus.is_cancelled) {
      return { primary: 'Booking Cancelled', secondary: bookingStatus.message };
    }
    return { primary: 'Processing...', secondary: 'Please wait' };
  };

  const displayText = getDisplayText();

  return (
    <LinearGradient colors={['#ffffff', '#C3DFFF']} style={styles.gradientContainer}>
      <StatusBar backgroundColor={Colors.statusBar} barStyle="light-content" />
      <View style={styles.contentWrapper}>
        <LottieView
          source={getLottieSource()}
          autoPlay
          loop={!bookingStatus.is_accepted} // Tick animation plays once
          style={styles.lottieStyle}
        />
        <View style={styles.textContainer}>
          <Text style={styles.primaryText}>{displayText.primary}</Text>
          <Text style={styles.secondaryText}>{displayText.secondary}</Text>

          {bookingStatus.still_waiting && (
            <TouchableOpacity style={styles.reloadButton} onPress={checkBookingStatus}>
              <Text style={styles.reloadButtonText}>Reload</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Cancelled Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Booking Cancelled</Text>
            <Text style={styles.modalMessage}>
              {bookingStatus.message || 'Booking was not accepted. Please try again.'}
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={handleModalClose}
              >
                <Text style={styles.secondaryButtonText}>Go Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.primaryButton]}
                onPress={handleRetry}
              >
                <Text style={styles.primaryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  contentWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  textContainer: {
    position: 'absolute',
    bottom: '18%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryText: {
    fontSize: Fonts.size.BookingConformation,
    fontWeight: '700',
    color: '#7518AA',
    textAlign: 'center',
  },
  secondaryText: {
    fontSize: Fonts.size.BookingConformation * 0.8,
    fontWeight: '600',
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  lottieStyle: { width: width * 0.8, height: height * 0.6 },
  reloadButton: {
    marginTop: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    backgroundColor: '#7518AA',
    borderRadius: 25,
  },
  reloadButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#d32f2f',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 25 },
  modalButtons: { flexDirection: 'row', gap: 15 },
  modalButton: { flex: 1, paddingVertical: 15, borderRadius: 25, alignItems: 'center' },
  primaryButton: { backgroundColor: '#7518AA' },
  secondaryButton: { backgroundColor: '#f5f5f5', borderWidth: 1, borderColor: '#ddd' },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  secondaryButtonText: { color: '#666', fontSize: 16, fontWeight: '600' },
});

export default CongratulationsScreen;
