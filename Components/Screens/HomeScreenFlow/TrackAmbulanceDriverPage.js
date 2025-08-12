import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Colors from '../../Colors/Colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Fonts/Fonts';

const { width, height } = Dimensions.get('window');

const AmbulanceTrackingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { booking_id } = route.params || {};

  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useRef(new Animated.Value(height * 0.5)).current;

  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: height * 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();

    fetchBookingDetails();
  }, []);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.myhealth.amrithaa.net/backend/api/booking/detail?id=${booking_id}`
      );
      const json = await response.json();
      if (json.status) {
        setBookingData(json.data);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    } finally {
      setLoading(false);
    }
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) =>
      Math.abs(gestureState.dy) > 5,
    onPanResponderMove: (evt, gestureState) => {
      const newTranslateY = height * 0.5 + gestureState.dy;
      if (newTranslateY >= 50 && newTranslateY <= height * 0.8) {
        translateY.setValue(newTranslateY);
      }
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dy < -100) {
        setIsExpanded(true);
        Animated.timing(translateY, {
          toValue: 50,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (gestureState.dy > 100) {
        setIsExpanded(false);
        Animated.timing(translateY, {
          toValue: height * 0.5,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: isExpanded ? 50 : height * 0.5,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={Colors.statusBar} />
      </View>
    );
  }

  if (!bookingData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No booking details found.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.mapView}>
          <Image
            source={require('../../Assets/map.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>
        {/* OTP Badge */}
        {bookingData.otp && (
          <View style={styles.otpContainer}>
            <Text style={styles.otpText}>OTP : {bookingData.otp}</Text>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <Animated.View
        style={[styles.bottomSheet, { transform: [{ translateY }] }]}
      >
        <View style={styles.handleContainer} {...panResponder.panHandlers}>
          <View style={styles.handleBar} />
        </View>

        <ScrollView style={styles.sheetContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sheetHeader}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="arrow-back" size={20} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Ambulance Tracking</Text>
          </View>

          <View style={styles.driverCard}>
            <Image
              source={{
                uri:
                  bookingData.driver_profile ||
                  'https://via.placeholder.com/150',
              }}
              style={styles.driverImage}
            />
            <View style={styles.driverInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.driverName}>
                  {bookingData.driver_name || 'N/A'}
                </Text>
                {bookingData.driver_ratings !== 'NA' && (
                  <>
                    <Icon name="star" size={16} color="#FFD700" style={{ marginHorizontal: 4 }} />
                    <Text style={styles.rating}>{bookingData.driver_ratings}</Text>
                  </>
                )}
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.vehicleBox}>
                  <Text style={styles.vehicleText}>
                    {bookingData.ambulance_number_plate || 'N/A'}
                  </Text>
                </View>
                <TouchableOpacity style={styles.callContainer}>
                  <View style={styles.callIconCircle}>
                    <Icon name="call" size={28} color="#7B2CBF" />
                  </View>
                  <Text style={styles.callText}>Call Driver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Pickup */}
          <Text style={styles.locationTypeLabel}>Pickup</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-pin" size={20} color="#FF0000" />
            <Text style={styles.locationValue}>{bookingData.pick_address}</Text>
          </View>

          {/* Drop */}
          <Text style={styles.locationTypeLabel}>Drop</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-pin" size={20} color="#FF0000" />
            <Text style={styles.locationValue}>{bookingData.drop_address[0]}</Text>
          </View>

          {/* Booking Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Date & Time</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Date</Text>
              <Text style={styles.value}>
                {new Date(bookingData.booking_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Time</Text>
              <Text style={styles.value}>
                {new Date(bookingData.booking_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.value}>Name : {bookingData.customer_name}</Text>
            <Text style={styles.value}>Mobile Number : {bookingData.customer_mobile}</Text>
          </View>

          {/* Assistance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Charges</Text>
            <View style={styles.infoRow}>
              <Text style={styles.value}>Charges for patient assistance</Text>
              <Text style={styles.value}>₹ {bookingData.assistent_amount}</Text>
            </View>
          </View>

          {/* Emergency Card */}
          <View style={styles.emergencyCard}>
            <Text style={styles.emergencyTitle}>
              Call customer care incase of any emergency
            </Text>
            <Text style={styles.emergencyDescription}>
              Press the call button if there’s an Query or Complaints
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Icon name="phone" size={16} color="#4D2161" />
              <Text style={styles.emergencyButtonText}>Emergency</Text>
            </TouchableOpacity>
          </View>

          {/* Price Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ambulance Cost</Text>
              <Text style={styles.value}>₹ {bookingData.ambulance_cost}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Additional Charges for patient assistance</Text>
              <Text style={styles.value}>₹ {bookingData.assistent_amount}</Text>
            </View>
            <View style={[styles.infoRow, { borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 }]}>
              <Text style={[styles.label, { fontSize: Fonts.size.PageHeading }]}>
                Total Price
              </Text>
              <Text style={[styles.value, { fontSize: Fonts.size.PageHeading, color: '#7B2CBF' }]}>
                ₹ {bookingData.total_amount}
              </Text>
            </View>
          </View>

          {/* Change Location Button */}
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackButtonText}>Change Location</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  mapContainer: { flex: 1, backgroundColor: '#8B5CF6' },
  mapView: { flex: 1 },
  mapBackground: { flex: 1, backgroundColor: '#F5F5F5' },
  mapImage: {
    width: '100%',
    height: '50%', // or any height you need
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  // New container for handle bar with larger touch area
  handleContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  sheetContent: {
    paddingHorizontal: 16,
    flex: 1,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  backButton: { marginRight: 8 },
  headerTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#333',
  },

  scrollContainer: {
    paddingHorizontal: 10,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    marginTop: 50,
    borderRadius: 12,
    elevation: 2,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  driverInfo: {
    flex: 1,
    marginLeft: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  driverName: {
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,

    color: '#333',
  },
  rating: {
    fontSize: Fonts.size.PageSubSubHeading,

    color: '#333',
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleBox: {
    borderWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#999',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  vehicleText: {
    fontSize: Fonts.size.PageSubSubHeading,

    color: '#333',
  },
  callContainer: {
    alignItems: 'center',
  },
  callIconCircle: {
    backgroundColor: '#EDE9FE',
    padding: 10,
    borderRadius: 30,
    marginRight: 6,
    bottom: 20,
  },
  callText: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#7B2CBF',
    fontWeight: '600',
    bottom: 15,
  },
  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  greeting: {
    fontSize: hp('2%'),
    color: 'black',
    opacity: 0.9,
  },
  userName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: 'black',
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 12,
  },
  locationButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#7B2CBF',
  },
  otpContainer: {
    position: 'absolute',
    top: 15,
    right: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
    zIndex: 1,
  },
  otpText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: Fonts.size.PageSubSubHeading,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,

    marginBottom: 12,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#00000',
    fontSize: Fonts.size.PageHeading,
     fontWeight: '700',
  },
  value: {
   color: '#00000',
    fontSize: Fonts.size.PageHeading,
     fontWeight: '700',
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
    color: '#ffff',
  },
  emergencyDescription: {
    fontSize: Fonts.size.PageSubheading,

    color: '#ffff',
  },
  emergencyButton: {
    marginTop: 12,
    flexDirection: 'row',
    backgroundColor: '#DBDBDB',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width:'50%',
    alignSelf:'flex-end'
  },
  emergencyButtonText: {
    color: Colors.statusBar,
    fontWeight: 'bold',
    fontSize: Fonts.size.PageSubSubHeading,
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
    // Location Type Labels
  locationTypeLabel: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 5,
  },

  // Location Container
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 15,
   
    
  },
  locationValue: { 
    color: '#333', 
    flex: 1,
    marginLeft: 10,
    fontSize: Fonts.size.PageSubSubHeading,
     fontWeight: '700',
  },
});

export default AmbulanceTrackingScreen;
