import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Colors from '../../Colors/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../../Fonts/Fonts';

const { width, height } = Dimensions.get('window');

// API function to get booking details
const getBookingDetails = async (token, bookingId) => {
  try {
    const response = await axios.get(
      `https://www.myhealth.amrithaa.net/backend/api/booking/detail?id=${bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

const AmbulanceTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { booking_id } = route.params || {};
  
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (booking_id && token) {
      fetchBookingDetails();
    } else {
      Alert.alert('Error', 'Missing booking ID or authentication token');
      navigation.goBack();
    }
  }, [booking_id, token]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await getBookingDetails(token, booking_id);
      
      if (response.status && response.data) {
        setBookingDetails(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch booking details');
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
      Alert.alert(
        'Error', 
        error.response?.data?.message || 'Failed to load booking details',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCallDriver = () => {
    const phoneNumber = bookingDetails?.customer_mobile;
    if (phoneNumber) {
      const url = Platform.OS === 'android' ? `tel:${phoneNumber}` : `telprompt:${phoneNumber}`;
      
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert('Error', 'Phone dialer is not available');
          }
        })
        .catch((err) => {
          console.error('Error opening dialer:', err);
          Alert.alert('Error', 'Failed to open phone dialer');
        });
    } else {
      Alert.alert('Error', 'Phone number not available');
    }
  };

  const handleViewDetails = () => {
    navigation.navigate('AmbulanceTrackingScreen', { id: booking_id });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN');
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return { backgroundColor: '#E3F2FD', color: '#1976D2' };
      case 'on going':
      case 'ongoing':
        return { backgroundColor: '#FFF3E0', color: '#E65100' };
      case 'completed':
        return { backgroundColor: '#E8F5E8', color: '#2E7D32' };
      case 'cancelled':
        return { backgroundColor: '#FFEBEE', color: '#D32F2F' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#666666' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'accepted':
        return 'check-circle';
      case 'on going':
      case 'ongoing':
        return 'directions-car';
      case 'completed':
        return 'done-all';
      case 'cancelled':
        return 'cancel';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7B2CBF" />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </View>
    );
  }

  if (!bookingDetails) {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>No booking details found</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const statusStyle = getStatusColor(bookingDetails.status_text || bookingDetails.status);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.mapView}>
          <View style={styles.mapBackground}>
            <Image
              source={require('../../Assets/map.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
            
            {/* OTP Display with Status */}
            <View style={styles.topRightContainer}>
              <View style={styles.otpContainer}>
                <Text style={styles.otpLabel}>OTP : </Text>
                <Text style={styles.otpText}>{bookingDetails.otp || 'N/A'}</Text>
              </View>
              
              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
                <Icon name={getStatusIcon(bookingDetails.status_text || bookingDetails.status)} size={16} color={statusStyle.color} />
                <Text style={[styles.statusBadgeText, { color: statusStyle.color }]}>
                  {bookingDetails.status_text || bookingDetails.status || 'Unknown'}
                </Text>
              </View>
            </View>

            {/* Route markers */}
            <View style={styles.routeMarkersContainer}>
              {/* Pickup Marker */}
              <View style={[styles.marker, { top: '20%', left: '25%' }]}>
                <View style={styles.pickupMarker}>
                  <MaterialIcons name="location-on" size={24} color="#FF4444" />
                </View>
              </View>
              
              {/* Drop Marker */}
              <View style={[styles.marker, { top: '60%', right: '20%' }]}>
                <View style={styles.dropMarker}>
                  <MaterialIcons name="location-on" size={24} color="#FF4444" />
                </View>
              </View>

              {/* Ambulance Icon */}
              <View style={[styles.marker, { top: '40%', left: '60%' }]}>
                <View style={styles.ambulanceMarker}>
                  <MaterialIcons name="ambulance" size={20} color="#FFFFFF" />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Sheet - Fixed Position */}
      <View style={styles.bottomSheet}>
        {/* Sheet Header */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ambulance Tracking</Text>
          <TouchableOpacity 
            onPress={handleViewDetails}
            style={styles.viewDetailsButtonHeader}
          >
            <Text style={styles.viewDetailsTextHeader}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* ScrollView Content */}
        <ScrollView
          style={styles.sheetContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
        >
          {/* Driver Card */}
          <View style={styles.driverCard}>
            <Image
              source={{
                uri: bookingDetails.driver_profile || 'https://randomuser.me/api/portraits/men/41.jpg',
              }}
              style={styles.driverImage}
            />

            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>
                  {bookingDetails.driver_name || 'Driver Name'}
                </Text>
                <View style={styles.ratingContainer}>
                  <Icon name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>
                    {bookingDetails.driver_ratings !== 'NA' ? bookingDetails.driver_ratings : '0'}
                  </Text>
                </View>
              </View>
              <Text style={styles.vehicleNumber}>
                {bookingDetails.ambulance_number_plate || 'N/A'}
              </Text>
              {bookingDetails.ambulance_id && (
                <Text style={styles.ambulanceId}>
                  ID: {bookingDetails.ambulance_id}
                </Text>
              )}
            </View>

            <TouchableOpacity 
              style={styles.callButton}
              onPress={handleCallDriver}
            >
              <View style={styles.callIconContainer}>
                <Icon name="call" size={20} color="#7B2CBF" />
              </View>
              <Text style={styles.callButtonText}>Call Driver</Text>
            </TouchableOpacity>
          </View>

          {/* Location Details */}
            <View style={styles.locationSection}>
              {/* Pickup */}
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Pickup</Text>
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={18} color="#FF4444" />
                  <Text style={styles.locationText}>
                    {bookingDetails.pick_address || 'Pickup address not available'}
                  </Text>
                </View>
              </View>

              {/* Drop */}
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Drop</Text>
                <View style={styles.locationRow}>
                  <MaterialIcons name="location-on" size={18} color="#FF4444" />
                  <Text style={styles.locationText}>
                    {Array.isArray(bookingDetails.drop_address) 
                      ? bookingDetails.drop_address.join(', ') 
                      : bookingDetails.drop_address || 'Drop address not available'
                    }
                  </Text>
                </View>
              </View>
            </View>

          {/* Booking Date & Time */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Booking Date & Time</Text>
            
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeLabel}>Booking Date</Text>
                <Text style={styles.dateTimeValue}>
                  {formatDate(bookingDetails.booking_date)}
                </Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Text style={styles.dateTimeLabel}>Booking Time</Text>
                <Text style={styles.dateTimeValue}>
                  {formatTime(bookingDetails.booking_time)}
                </Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={styles.dateTimeLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>
                {bookingDetails.booking_id || `#${bookingDetails.id}`}
              </Text>
            </View>
          </View>

          {/* Customer Details */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.customerInfo}>
              <Text style={styles.customerDetail}>
                Name : {bookingDetails.customer_name || 'Not provided'}
              </Text>
              <Text style={styles.customerDetail}>
                Mobile Number : {bookingDetails.customer_mobile || 'Not provided'}
              </Text>
            </View>
          </View>

          {/* Assistance - Only show if amount > 0 */}
          {parseFloat(bookingDetails.assistent_amount || 0) > 0 && (
            <View style={styles.infoSection}>
              <Text style={styles.sectionTitle}>Assistance for the Patient</Text>
              <View style={styles.assistanceRow}>
                <Text style={styles.assistanceDetail}>Additional Assistance</Text>
                <Text style={styles.assistancePrice}>₹ {bookingDetails.assistent_amount}</Text>
              </View>
            </View>
          )}

          {/* Trip Status with Enhanced UI */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Trip Status</Text>
            
            <View style={styles.statusCard}>
              <View style={[styles.statusIndicator, { backgroundColor: statusStyle.backgroundColor }]}>
                <Icon name={getStatusIcon(bookingDetails.status_text || bookingDetails.status)} 
                      size={24} 
                      color={statusStyle.color} />
              </View>
              <View style={styles.statusInfo}>
                <Text style={[styles.statusMainText, { color: statusStyle.color }]}>
                  {bookingDetails.status_text || bookingDetails.status || 'Unknown'}
                </Text>
                <Text style={styles.statusSubText}>
                  {bookingDetails.is_trip_start ? 'Trip has started' : 'Trip not yet started'}
                </Text>
              </View>
              {bookingDetails.status_text?.toLowerCase() === 'on going' && (
                <View style={styles.pulseContainer}>
                  <View style={styles.pulseAnimation} />
                </View>
              )}
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Booking ID</Text>
              <Text style={styles.bookingId}>
                {bookingDetails.booking_id || `#${bookingDetails.id}`}
              </Text>
            </View>
          </View>

          {/* Price Details */}
          <View style={styles.priceSection}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            
            <View style={styles.priceItem}>
              <Text style={styles.priceLabel}>Ambulance Cost</Text>
              <Text style={styles.priceValue}>₹ {bookingDetails.ambulance_cost || 0}</Text>
            </View>
            
            {parseFloat(bookingDetails.assistent_amount || 0) > 0 && (
              <View style={styles.priceItem}>
                <Text style={styles.priceLabel}>Assistance Cost</Text>
                <Text style={styles.priceValue}>₹ {bookingDetails.assistent_amount}</Text>
              </View>
            )}

            <View style={styles.priceDivider} />
            
            <View style={styles.totalPriceItem}>
              <Text style={styles.totalPriceLabel}>Total Amount</Text>
              <Text style={styles.totalPriceValue}>₹ {bookingDetails.total_amount || 0}</Text>
            </View>
          </View>
<View style={styles.emergencyCard}>
  <View style={styles.emergencyContent}>
    <Text style={styles.emergencyTitle}>
      Call customer care in case of emergency
    </Text>
    <Text style={styles.emergencyDescription}>
      For any accident or patient mishandling, press the call button to contact our team.
    </Text>
  </View>
  <TouchableOpacity
    style={styles.emergencyButton}
    onPress={() => {
      Linking.openURL('tel:+919841426826'); 
    }}
  >
    <Icon name="phone" size={16} color="#4D2161" />
    <Text style={styles.emergencyButtonText}>Emergency</Text>
  </TouchableOpacity>
</View>

       
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#D32F2F',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#7B2CBF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
  mapContainer: { 
    height: height * 0.45,
    backgroundColor: '#8B5CF6' 
  },
  mapView: { 
    flex: 1 
  },
  mapBackground: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
    position: 'relative'
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  
  // OTP and Status Container
  topRightContainer: {
    position: 'absolute',
    top: 40,
    right: 20,
    alignItems: 'flex-end',
  },
  otpContainer: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: 8,
   
    
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  otpLabel: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  otpText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Route Markers
  routeMarkersContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
  },
  pickupMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  dropMarker: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  ambulanceMarker: {
    backgroundColor: '#7B2CBF',
    borderRadius: 15,
    padding: 6,
    elevation: 3,
  },

  // Bottom Sheet - Fixed Position
  bottomSheet: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  // Sheet Header
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  viewDetailsButtonHeader: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  viewDetailsTextHeader: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },

  sheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Driver Card
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  driverName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    right:'20%'
  },
  rating: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',

  },
  vehicleNumber: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  ambulanceId: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  callButton: {
    alignItems: 'center',
  },
  callIconContainer: {
    backgroundColor: '#EDE9FE',
    padding: 12,
    borderRadius: 25,
    marginBottom: 4,
  },
  callButtonText: {
    fontSize: 12,
    color: '#7B2CBF',
    fontWeight: '600',
  },

  // Location Section
  locationSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  locationItem: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 4,
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    lineHeight: 20,
  },

  // Info Sections
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },

  // Date Time
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateTimeItem: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7B2CBF',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  statusIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statusInfo: {
    flex: 1,
  },
  statusMainText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  statusSubText: {
    fontSize: 14,
    color: '#6B7280',
  },
  pulseContainer: {
    position: 'absolute',
    right: 16,
    top: '50%',
    marginTop: -8,
  },
  pulseAnimation: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#4CAF50',
    opacity: 0.8,
  },

  // Customer Info
  customerInfo: {
    gap: 8,
  },
  customerDetail: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },

  // Assistance
  assistanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assistanceDetail: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  assistancePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  // Emergency Card
  emergencyCard: {
    backgroundColor: Colors.statusBar,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  emergencyContent: {
    flex: 1,
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
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 12,
  },
  emergencyButtonText: {
    color: Colors.statusBar,
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },

  // Price Section
  priceSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  priceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  priceDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalPriceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalPriceLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalPriceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7B2CBF',
  },

  // Action Button
  actionButton: {
    backgroundColor: Colors.statusBar,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AmbulanceTrackingScreen;