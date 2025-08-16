import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../Colors/Colors';
import Icons from 'react-native-vector-icons/Ionicons';
import Fonts from '../../Fonts/Fonts';
import CustomHeader from '../../../Header';

const BookingDetailsScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const token = useSelector(state => state.auth.token);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [newDropLocation, setNewDropLocation] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch booking details from API
  useEffect(() => {
    fetchBookingDetails();
    // Set up polling for real-time updates
    const pollInterval = setInterval(fetchBookingDetails, 30000); // Poll every 30 seconds
    return () => clearInterval(pollInterval);
  }, []);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      
      // Check if token exists
      if (!token) {
        Alert.alert('Error', 'Authentication token not found. Please login again.');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(
        `https://www.myhealth.amrithaa.net/backend/api/booking/detail?id=${id}`,
        {
          method: 'GET',
          headers: headers,
        }
      );

      // Check if response is unauthorized
      if (response.status === 401) {
        Alert.alert('Session Expired', 'Please login again.', [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to login screen
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            }
          }
        ]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.status && result.data) {
        setBookingData(result.data);
      } else {
        Alert.alert('Error', result.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        Alert.alert('Network Error', 'Please check your internet connection and try again.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyCall = () => {
    const emergencyNumber = '+919841426826';
    const url = `tel:${emergencyNumber}`;

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open dialer.');
    });
  };

  const handleLocationChange = () => {
    if (currentLocation.trim()) {
      setNewDropLocation(currentLocation.trim());
      // Here you can also make an API call to update the location on the server
      updateDropLocation(currentLocation.trim());
    }
    setModalVisible(false);
    setCurrentLocation('');
  };

  const updateDropLocation = async (newLocation) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      // Make API call to update drop location
      const response = await fetch(
        `https://www.myhealth.amrithaa.net/backend/api/booking/update-location`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({
            booking_id: id,
            new_drop_location: newLocation
          })
        }
      );

      const result = await response.json();
      if (result.status) {
        Alert.alert('Success', 'Drop location updated successfully');
      }
    } catch (error) {
      console.error('Location update error:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ' / ');
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const makePhoneCall = (phoneNumber) => {
    if (!phoneNumber || phoneNumber === 'NA') {
      Alert.alert('Error', 'Phone number not available.');
      return;
    }

    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open dialer.');
    });
  };

  const cancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: performCancelBooking
        }
      ]
    );
  };

  const performCancelBooking = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const response = await fetch(
        `https://www.myhealth.amrithaa.net/backend/api/booking/cancel`,
        {
          method: 'POST',
          headers: headers,
          body: JSON.stringify({ booking_id: id })
        }
      );

      const result = await response.json();
      if (result.status) {
        Alert.alert('Success', 'Booking cancelled successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to cancel booking');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Check if driver and ambulance data are available
  const hasDriverData = bookingData?.driver_name && bookingData?.driver_name !== '' && bookingData?.driver_name !== 'NA';
  const hasAmbulanceData = bookingData?.ambulance_number_plate && bookingData?.ambulance_number_plate !== '' && bookingData?.ambulance_number_plate !== 'NA';
  const showOTP = hasDriverData && hasAmbulanceData && bookingData?.otp;
  const isBookingActive = bookingData?.status === 'confirmed' || bookingData?.status === 'in_progress';

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 0 }}
          style={styles.topBackground}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7B2CBF" />
            <Text style={styles.loadingText}>Loading booking details...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (!bookingData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 0 }}
          style={styles.topBackground}
        >
          <View style={styles.errorContainer}>
            <Icon name="error-outline" size={64} color="#666" />
            <Text style={styles.errorText}>No booking data found</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchBookingDetails}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
       
      >
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 0 }}
          style={styles.topBackground}
        >
          <CustomHeader
            username="Janmani Kumar"
            onNotificationPress={() => console.log('Notification Pressed')}
            onWalletPress={() => console.log('Wallet Pressed')}
          />

          <View style={styles.sectionHeader}>
            <View style={styles.headerLeft}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.sectionTitles}>Booking Details</Text>
            </View>

            {hasDriverData && hasAmbulanceData && isBookingActive && (
              <TouchableOpacity 
                style={styles.changeLocationBtn} 
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.changeLocationText}>Change Location</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* OTP Display - Only show when both driver and ambulance data are available */}
          {showOTP && (
            <View style={styles.otpCard}>
              <Text style={styles.otpTitle}>OTP: </Text>
              <Text style={styles.otpValue}>{bookingData.otp}</Text>
            </View>
          )}

          {/* Show booking info when no driver/ambulance assigned */}
          {!hasDriverData && !hasAmbulanceData && (
            <View style={styles.bookingStatusCard}>
            
              {/* Red notice for unassigned bookings */}
              <View style={styles.noticeCard}>
                <Icon name="info" size={20} color="#D32F2F" />
                <Text style={styles.noticeText}>
                  Note: Your ambulance booking is confirmed. The driver details will be shared at least one hours before.
                </Text>
              </View>
            </View>
          )}

          {/* Driver Card - Only show if driver data is available */}
          {hasDriverData && (
            <>
              <View style={styles.driverCard}>
                <Image
                  source={{ 
                    uri: bookingData.driver_profile && bookingData.driver_profile !== 'NA' 
                      ? bookingData.driver_profile 
                      : 'https://randomuser.me/api/portraits/men/41.jpg' 
                  }}
                  style={styles.driverImage}
                  defaultSource={require('../../Assets/profile.png')}
                />
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{bookingData.driver_name}</Text>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>
                      {bookingData.driver_ratings && bookingData.driver_ratings !== 'NA' 
                        ? bookingData.driver_ratings 
                        : '4.3'}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.callDriverButton}
                  onPress={() => makePhoneCall(bookingData.driver_mobile)}
                >
                  <View style={styles.callIconBackground}>
                    <Icon name="call" size={18} color="#7B2CBF" />
                  </View>
                  <Text style={styles.callDriverText}>Call Driver</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Ambulance Card - Only show if ambulance data is available */}
          {hasAmbulanceData && (
            <>
              <View style={styles.ambulanceCard}>
                <Image
                  source={require('../../Assets/ambualnce.png')}
                  style={styles.ambulanceImage}
                />
                <View style={styles.ambulanceInfo}>
                  <View style={styles.topRow}>
                    <Text style={styles.bookingIdText}>Booking Id: {bookingData.booking_id}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(bookingData.status_text) }]}>
                      <Text style={styles.statusText}>{bookingData.status_text}</Text>
                    </View>
                  </View>
                  <View style={styles.nameRow}>
                    <MaterialIcons name="ambulance" size={18} color="#7B2CBF" style={{ marginRight: 4 }} />
                    <Text style={styles.ambulanceType}>
                      {bookingData.ambulance_type && bookingData.ambulance_type !== 'NA' 
                        ? bookingData.ambulance_type 
                        : 'Small (Omni, etc)'}
                    </Text>
                  </View>
                  <Text style={styles.ambulanceNumber}>{bookingData.ambulance_number_plate}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Pickup & Drop */}
          <View style={styles.section}>
            <View style={styles.locationRow}>
              <View style={styles.locationIconLabel}>
                <MaterialIcons name="map-marker" size={18} color="#FF6B6B" />
                <Text style={styles.locationHeading}>Pickup</Text>
              </View>
              <Text style={styles.locationValue}>
                {bookingData.pick_address}
              </Text>
            </View>

            <View style={[styles.locationRow, { marginTop: 16 }]}>
              <View style={styles.locationIconLabel}>
                <MaterialIcons name="map-marker" size={18} color="#8E44AD" />
                <Text style={styles.locationHeading}>Drop</Text>
              </View>
              <Text style={styles.locationValue}>
               {bookingData.drop_address?.length > 0 ? bookingData.drop_address.join(', ') : 'N/A'}
              </Text>
            </View>

            {newDropLocation !== '' && (
              <View style={styles.locationRow}>
                <View style={styles.locationIconLabel}>
                  <MaterialIcons name="map-marker" size={18} color="#2E7D32" />
                  <Text style={styles.locationHeading}>Drop (Updated)</Text>
                </View>
                <Text style={[styles.locationValue, { color: '#2E7D32', fontWeight: '600' }]}>
                  {newDropLocation}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.divider} />

          {/* Booking Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Date & Time</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Date</Text>
              <Text style={styles.value}>{formatDate(bookingData.booking_date)}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Time</Text>
              <Text style={styles.value}>{formatTime(bookingData.booking_time)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>{bookingData.customer_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Mobile Number</Text>
              <Text style={styles.value}>{bookingData.customer_mobile}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Additional Charges */}
          {bookingData.assistent_amount && parseFloat(bookingData.assistent_amount) > 0 && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Charges</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Charges for patient assistance</Text>
                  <Text style={styles.value}>₹ {bookingData.assistent_amount}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Emergency Card */}
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>
              Call customer care in case of emergency
            </Text>
            <Text style={styles.emergencyDescription}>
              Press the call button if there's any delay or complaint.
            </Text>
            <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
              <Icon name="phone" size={16} color="#4D2161" />
              <Text style={styles.emergencyButtonText}>Emergency</Text>
            </TouchableOpacity>
          </View>

          {/* Price Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ambulance Cost</Text>
              <Text style={styles.value}>₹ {Math.round(bookingData.ambulance_cost)}</Text>
            </View>
            {bookingData.assistent_amount && parseFloat(bookingData.assistent_amount) > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Additional charges for patient assistance</Text>
                <Text style={styles.value}>₹ {bookingData.assistent_amount}</Text>
              </View>
            )}

            <View style={styles.priceDivider} />
            <View style={styles.infoRow}>
              <Text style={[styles.label, styles.totalLabel]}>Total Price</Text>
              <Text style={[styles.value, styles.totalValue]}>
                ₹ {parseFloat(bookingData.total_amount).toFixed(0)}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Track Button - Only show if driver data is available */}
            {hasDriverData && (
              <TouchableOpacity
                style={styles.trackButton}
                onPress={() => navigation.navigate('TrackDrivar', { 
                  driverId: bookingData.driver_id,
                  bookingId: bookingData.id 
                })}
              >
                <Icon name="gps-fixed" size={20} color="#fff" />
                <Text style={styles.trackButtonText}>Track Ambulance</Text>
              </TouchableOpacity>
            )}

            {/* Cancel Button - Only show for pending bookings */}
            {bookingData.status === 'pending' && !hasDriverData && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={cancelBooking}
              >
                <Icon name="cancel" size={20} color="#fff" />
                <Text style={styles.cancelButtonText}>Cancel Booking</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Modal for location change */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Icons name="chevron-back" size={24} color="#000" />
                      </TouchableOpacity>
                      <Text style={styles.modalTitle}>Change your Location</Text>
                    </View>
                    <Text style={styles.modalSubtitle}>
                      Do you want to add an extra drop location?
                    </Text>
                    <View style={styles.inputContainer}>
                      <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
                      <TextInput
                        style={styles.locationInput}
                        placeholder="Enter your Location"
                        placeholderTextColor="#999"
                        value={currentLocation}
                        onChangeText={setCurrentLocation}
                        multiline={true}
                        numberOfLines={3}
                      />
                    </View>
                    <TouchableOpacity 
                      style={[styles.submitButton, !currentLocation.trim() && styles.submitButtonDisabled]} 
                      onPress={handleLocationChange}
                      disabled={!currentLocation.trim()}
                    >
                      <Text style={styles.submitButtonText}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'booked':
    case 'pending':
      return '#FFE9F0';
    case 'confirmed':
      return '#E8F5E8';
    case 'in_progress':
      return '#E3F2FD';
    case 'completed':
      return '#F3E5F5';
    case 'cancelled':
      return '#FFEBEE';
    default:
      return '#FFE9F0';
  }
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FF' 
  },

  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    minHeight: hp('100%'),
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
   
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    marginTop: 10,
  
  },

  retryButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    marginTop: 10,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionTitles: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#000',
  },

  changeLocationBtn: {
    borderWidth: 1,
    borderColor: '#7B2CBF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },

  changeLocationText: {
    color: '#4D2161',
    fontSize: 12,
    fontWeight: '600',
  },

  // OTP Card styles
  otpCard: {
    backgroundColor: '#348F21',
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: 20,
    marginRight: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  otpTitle: {
     fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 5,
  },

  otpValue: {
     fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
  },



  statusBadge: {
    backgroundColor: '#FFE9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  statusText: {
    fontSize: 12,
    color: '#D00000',
    fontWeight: '600',
  },

  statusMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    lineHeight: 20,
  },

  noticeCard: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#D32F2F',
  },

  noticeText: {
     fontSize: Fonts.size.PageHeading,
    color: '#D32F2F',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // Driver card styles
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  driverImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },

  driverInfo: {
    flex: 1,
  },

  driverName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
    marginBottom: 4,
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rating: {
    fontSize: 14,
    color: '#333',
    marginLeft: 4,
  },

  callDriverButton: {
    alignItems: 'center',
  },

  callIconBackground: {
    backgroundColor: '#F2E8FF',
    padding: 12,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },

  callDriverText: {
    color: '#7B2CBF',
    fontWeight: 'bold',
     fontSize: Fonts.size.PageHeading,
    marginTop: 4,
  },

  // Ambulance card styles
  ambulanceCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 10,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  ambulanceImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },

  ambulanceInfo: {
    flex: 1,
    justifyContent: 'center',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  bookingIdText: {
      fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#000',
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  ambulanceType: {
     fontSize: Fonts.size.PageHeading,
    color: '#333',
    fontWeight: '600',
  },

  ambulanceNumber: {
      fontSize: Fonts.size.PageHeading,
    color: '#555',
    fontWeight: '500',
  },

  // Section styles
  section: {
 marginTop:'2%'
  },

  sectionTitle: {
    fontWeight: 'bold',
       fontSize: Fonts.size.PageHeading,
    marginBottom: 12,
    color: '#333',
  },

  locationRow: {
top:'2%'
  },

  locationIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    top:'1%'
  },

  locationHeading: {
      fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#333',
  },

  locationValue: {
     fontSize: Fonts.size.PageHeading,
    color: '#555',
    paddingLeft: 24,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  label: {
    color: '#666',
     fontSize: Fonts.size.PageHeading,
    flex: 1,
  },

  value: {
    fontWeight: '600',
    color: '#333',
     fontSize: Fonts.size.PageHeading,
    textAlign: 'right',
    flex: 1,
  },

  totalLabel: {
     fontSize: Fonts.size.BookingConformation,
    fontWeight: 'bold',
    color: '#333',
  },

  totalValue: {
   fontSize: Fonts.size.BookingConformation,
    fontWeight: 'bold',
    color: '#7B2CBF',
  },

  priceDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginVertical: 12,
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    borderStyle: 'dashed',
    marginVertical: 10,
  },

  // Emergency card styles
  emergencyCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.statusBar,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  emergencyTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#fff',
  },

  emergencyDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },

  emergencyButton: {
    marginTop: 12,
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    alignSelf: 'flex-end',
  },

  emergencyButtonText: {
    color: Colors.statusBar,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },

  // Action buttons
  actionButtons: {
    marginTop: 20,
    gap: 12,
  },

  trackButton: {
    flexDirection: 'row',
    backgroundColor: Colors.statusBar,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },

  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'white',
    width: wp('90%'),
    borderRadius: 20,
    padding: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 10,
  },

  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    textAlign: 'left',
    lineHeight: 20,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
    minHeight: 80,
  },

  inputIcon: {
    marginRight: 10,
    marginTop: 2,
  },

  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
    textAlignVertical: 'top',
  },

  submitButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  submitButtonDisabled: {
    backgroundColor: '#ccc',
    elevation: 0,
    shadowOpacity: 0,
  },

  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingDetailsScreen;