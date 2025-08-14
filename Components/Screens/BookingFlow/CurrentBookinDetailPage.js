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
              // Clear Redux token and navigate to login
            }
          }
        ]);
        return;
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
    }
    setModalVisible(false);
    setCurrentLocation('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB').replace(/\//g, ' / ');
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
    if (!phoneNumber) {
      Alert.alert('Error', 'Phone number not available.');
      return;
    }

    const url = `tel:${phoneNumber}`;
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open dialer.');
    });
  };

  // Check if driver and ambulance data are available
  const hasDriverData = bookingData?.driver_name && bookingData?.driver_name !== '' && bookingData?.driver_name !== 'NA';
  const hasAmbulanceData = bookingData?.ambulance_number_plate && bookingData?.ambulance_number_plate !== '' && bookingData?.ambulance_number_plate !== 'NA';
  const showOTP = hasDriverData && hasAmbulanceData;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: -0, y: 0.2 }}
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
          start={{ x: -0, y: 0.2 }}
          end={{ x: 0, y: 0 }}
          style={styles.topBackground}
        >
          <View style={styles.errorContainer}>
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
        contentContainerStyle={{ paddingBottom: 400 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: -0, y: 0.2 }}
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

            {hasDriverData && hasAmbulanceData && (
              <TouchableOpacity style={styles.changeLocationBtn} onPress={() => setModalVisible(true)}>
                <Text style={styles.changeLocationText}>Change Location</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* OTP Display - Only show when both driver and ambulance data are available */}
          {showOTP && bookingData.otp && (
            <View style={styles.otpCard}>
              <Text style={styles.otpTitle}>OTP :</Text>
              <Text style={styles.otpValue}>{bookingData.otp}</Text>
            </View>
          )}

          {/* Driver Card - Only show if driver data is available */}
          {hasDriverData && (
            <>
              <View style={styles.driverCard}>
                <Image
                  source={{ 
                    uri: bookingData.driver_profile || 'https://randomuser.me/api/portraits/men/41.jpg' 
                  }}
                  style={styles.driverImage}
                />
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{bookingData.driver_name}</Text>
                  <View style={styles.ratingRow}>
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>
                      {bookingData.driver_ratings !== 'NA' ? bookingData.driver_ratings : '4.3'}
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
                    <Text style={styles.bookingIdText}>Booking Id : {bookingData.booking_id}</Text>
                    <View style={styles.statusBadge}>
                      <Text style={styles.statusText}>{bookingData.status_text}</Text>
                    </View>
                  </View>
                  <View style={styles.nameRow}>
                    <MaterialIcons name="ambulance" size={18} color="#7B2CBF" style={{ marginRight: 4 }} />
                    <Text style={styles.ambulanceType}>
                      {bookingData.ambulance_type !== 'NA' ? bookingData.ambulance_type : 'Small (Omni, etc)'}
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
                <Text style={styles.locationHeading}>Pickup</Text>
              </View>
              <Text style={styles.locationValue}>
                <MaterialIcons name="map-marker" size={18} color="#FF6B6B" />
                {bookingData.pick_address}
              </Text>
            </View>

            <View style={[styles.locationRow, { marginTop: 12 }]}>
              <View style={styles.locationIconLabel}>
                <Text style={styles.locationHeading}>Drop</Text>
              </View>
              <Text style={styles.locationValue}>
                <MaterialIcons name="map-marker" size={18} color="#8E44AD" />
                {Array.isArray(bookingData.drop_address) 
                  ? bookingData.drop_address[0] 
                  : bookingData.drop_address}
              </Text>
            </View>

            {newDropLocation !== '' && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ color: '#555' }}>Drop (Change By Driver):</Text>
                <Text style={{ fontWeight: '600' }}>{newDropLocation}</Text>
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
            <Text style={styles.value}>Name : {bookingData.customer_name}</Text>
            <Text style={styles.value}>Mobile Number : {bookingData.customer_mobile}</Text>
          </View>

          <View style={styles.divider} />

          {/* Additional Charges */}
          {bookingData.assistent_amount && bookingData.assistent_amount !== '0' && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Additional Charges</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.value}>Charges for patient assistance</Text>
                  <Text style={styles.value}>₹ {bookingData.assistent_amount}</Text>
                </View>
              </View>
              <View style={styles.divider} />
            </>
          )}

          {/* Emergency Card */}
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>
              Call customer care incase of emergency
            </Text>
            <Text style={styles.emergencyDescription}>
              Press the call button if there's an Delay or Complaint.
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
            {bookingData.assistent_amount && bookingData.assistent_amount !== '0' && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Additional charges for patient assistance</Text>
                <Text style={styles.value}>₹ {bookingData.assistent_amount}</Text>
              </View>
            )}

            <View style={styles.divider} />
            <View style={[styles.infoRow]}>
              <Text style={[styles.label, { fontSize: Fonts.size.PageHeading }]}>Total Price</Text>
              <Text style={[styles.value, { fontSize: Fonts.size.PageHeading, color: '#7B2CBF' }]}>
                ₹ {parseFloat(bookingData.total_amount).toFixed(0)}
              </Text>
            </View>
            <View style={styles.divider} />
          </View>

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

          {/* Modal - Only show if driver data is available */}
          {hasDriverData && hasAmbulanceData && (
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
                      <Text style={styles.modalSubtitle}>Do you want to add an extra drop location?</Text>
                      <View style={styles.inputContainer}>
                        <Icon name="location-on" size={20} color="#666" style={styles.inputIcon} />
                        <TextInput
                          style={styles.locationInput}
                          placeholder="Enter your Location"
                          placeholderTextColor="#999"
                          value={currentLocation}
                          onChangeText={setCurrentLocation}
                        />
                      </View>
                      <TouchableOpacity style={styles.submitButton} onPress={handleLocationChange}>
                        <Text style={styles.submitButtonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          )}
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },

  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
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
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    top: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitles: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#000',
  },
  changeLocationBtn: {
    borderWidth: 1,
    borderColor: '#7B2CBF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff'
  },
  changeLocationText: {
    color: '#4D2161',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#fff',
    marginTop: 20,
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    borderStyle: 'dotted',
    marginVertical: 10,
  },
  driverName: {
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    fontSize: Fonts.size.PageHeading,
    color: '#333',
    marginLeft: 4,
  },
  callDriverButton: {
    alignItems: 'center',
  },
  callIconBackground: {
    backgroundColor: '#F2E8FF',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callDriverText: {
    color: '#7B2CBF',
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,
    marginTop: 4,
  },
  ambulanceCard: {
    flexDirection: 'row',
    padding: 14,
    margin: 5,
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
    marginBottom: 4,
  },
  bookingIdText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  statusBadge: {
    backgroundColor: '#FFE9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 13,
    color: '#D00000',
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
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,
    marginBottom: 12,
  },
  locationRow: {
    marginBottom: 10,
  },
  locationIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
    color: '#333',
  },
  locationValue: {
    fontSize: 14,
    color: '#555',
    paddingLeft: 22,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
    fontSize: Fonts.size.PageHeading,
  },
  value: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: Fonts.size.PageHeading,
  },
  emergencyCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: Colors.statusBar,
    borderRadius: 12,
  },
  emergencyTitle: {
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,
    marginBottom: 6,
    color: '#fff',
  },
  emergencyDescription: {
    fontSize: Fonts.size.PageHeading,
    color: '#fff',
  },
  emergencyButton: {
    marginTop: 12,
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '40%',
    alignSelf: 'flex-end'
  },
  emergencyButtonText: {
    color: Colors.statusBar,
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: Fonts.size.PageHeading,
  },
  otpCard: {
    backgroundColor: '#fff',
    padding: 5,
    alignItems: 'center',
    alignSelf:'flex-end',
    flexDirection:'row',
    borderWidth:1,
    backgroundColor:'#348F21',
    borderColor:'#348F21',
    borderTopLeftRadius:10,
    borderTopRightRadius:10,
    top:20,
    right:10
  },
  otpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  otpValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
  },
  trackButton: {
    flexDirection: 'row',
    backgroundColor: Colors.statusBar,
    paddingVertical: 14,
    marginTop: 20,
    marginBottom: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,
    marginLeft: 8,
  },
  // Modal Styles
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
    elevation: 5,
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
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 30,
    backgroundColor: '#f9f9f9',
  },
  inputIcon: {
    marginRight: 10,
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  submitButton: {
    backgroundColor: '#7B2CBF',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookingDetailsScreen;