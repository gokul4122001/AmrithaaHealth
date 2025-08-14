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
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';
import CustomHeader from '../../../Header';
import { getBookingDetails } from '../../Screens/APICall/BookingApi'; 
import { useSelector } from 'react-redux';

const BookingDetailsScreen = ({ navigation, route }) => {
  const { id } = route.params; 
  const token = useSelector(state => state.auth.token); 
  console.log(id,"dwsdsvds")

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const res = await getBookingDetails(id, token);
      if (res.status) {
        setBooking(res.data);
      } else {
        console.warn('Failed to load booking details');
      }

      console.log(res,"vfdwsvdsvdsv")
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ marginTop: 50, textAlign: 'center' }}>No booking details found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
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

          <View style={styles.changeLocationBtn}>
            <Text style={styles.changeLocationText}>{booking.status_text}</Text>
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Driver Card */}
          <View style={styles.driverCard}>
            {booking.driver_profile !== 'NA' ? (
              <Image source={{ uri: booking.driver_profile }} style={styles.driverImage} />
            ) : (
              <Image source={require('../../Assets/profile.png')} style={styles.driverImage} />
            )}
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>
                {booking.driver_name !== 'NA' ? booking.driver_name : 'No Driver Assigned'}
              </Text>
              <Text style={styles.driverId}>
                ID no : {booking.driver_id !== 'NA' ? booking.driver_id : 'N/A'}
              </Text>
            </View>
            <Text style={styles.callCustomerText}>
              {booking.driver_name !== 'NA' ? 'Call Driver' : 'By User'}
            </Text>
          </View>

          <View style={styles.divider} />

      

          {/* Pickup & Drop */}
          <View style={styles.section}>
            <View style={styles.locationRow}>
              <Text style={styles.locationHeading}>Pickup</Text>
              <Text style={styles.locationValue}>{booking.pick_address}</Text>
            </View>
            <View style={styles.locationRow}>
              <Text style={styles.locationHeading}>Drop</Text>
              <Text style={styles.locationValue}>
              {booking.drop_address?.length > 0 ? booking.drop_address.join(', ') : 'N/A'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Booking Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Date & Time</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Date</Text>
              <Text style={styles.value}>
                {new Date(booking.booking_date).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Time</Text>
              <Text style={styles.value}>
                {new Date(booking.booking_time).toLocaleTimeString()}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.value}>Name : {booking.customer_name}</Text>
            <Text style={styles.value}>Mobile Number : {booking.customer_mobile}</Text>
          </View>

          <View style={styles.divider} />

          {/* Assistance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assistance for the Patient</Text>
            <View style={styles.infoRow}>
              <Text style={styles.value}>Charges</Text>
              <Text style={styles.value}>₹ {booking.assistent_amount}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Price Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ambulance Cost</Text>
              <Text style={styles.value}>₹ {booking.ambulance_cost}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Assistance for the Patient</Text>
              <Text style={styles.value}>₹ {booking.assistent_amount}</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.infoRow]}>
              <Text style={[styles.label, { fontSize: Fonts.size.PageHeading }]}>Total Price</Text>
              <Text
                style={[
                  styles.value,
                  { fontSize: Fonts.size.PageHeading, color: '#7B2CBF' },
                ]}
              >
                ₹ {booking.total_amount}
              </Text>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  scrollContainer: { paddingBottom: 30 },
  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    top: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitles: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: 6,
    color: '#000',
  },
  changeLocationBtn: {
    borderWidth: 1,
    borderColor: '#1824AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#E3E6FF',
  },
  changeLocationText: {
    color: '#1824AA',
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
  driverImage: { width: 60, height: 60, borderRadius: 30, marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontWeight: 'bold', fontSize: Fonts.size.PageHeading, color: '#000' },
  driverId: { fontSize: Fonts.size.PageHeading, color: '#333', marginTop: 4 },
  callCustomerText: {
    color: '#7B2CBF',
    fontWeight: 'bold',
    fontSize: Fonts.size.PageHeading,
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    backgroundColor: '#D6B5FF',
    borderColor: '#D6B5FF',
  },
  driverCard1: { flexDirection: 'row', padding: 14, margin: 5 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  vehicleText1: {
    fontSize: 13,
    color: '#D00000',
    backgroundColor: '#FFE9F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  rating: { fontSize: 14, color: '#555' },
  section: { backgroundColor: '#fff', padding: 16, marginTop: 10 },
  sectionTitle: { fontWeight: 'bold', fontSize: Fonts.size.PageHeading, marginBottom: 12 },
  locationRow: { marginBottom: 10 },
  locationHeading: { fontSize: 16, fontWeight: 'bold', marginBottom: 4, color: '#333' },
  locationValue: { fontSize: 14, color: '#555' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#666', fontSize: Fonts.size.PageHeading },
  value: { fontWeight: 'bold', color: '#333', fontSize: Fonts.size.PageHeading },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    borderStyle: 'dotted',
    marginVertical: 10,
  },
});

export default BookingDetailsScreen;
