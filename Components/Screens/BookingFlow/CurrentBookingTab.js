import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Fonts/Fonts';
import { useSelector } from 'react-redux';
import { Emergency_Booking } from '../APICall/BookingApi';
import { IMAGE_URL } from '../Config';
import LottieView from 'lottie-react-native';

const CurrentBookingCardScreen = () => {
  const navigation = useNavigation();
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await Emergency_Booking(token, 'current');
      setBookingData(response?.data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) => {
    return text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;
  };

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* Header with Ambulance + Booking ID */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: `${IMAGE_URL}${item.ambulance_icon}` }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.bookingId}>Booking Id : {item.booking_id}</Text>

        
          <Text style={styles.typeAndDetails}>
            {item.ambulance_type}{' '}
            <Text style={styles.subtitle}>{item.ambulance_details}</Text>
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.booking_type}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Locations */}
   <View style={styles.locationContainer}>
  {/* Pickup */}
  <View style={[styles.row, { marginBottom: 10 }]}>
    <MaterialCommunityIcons
      name="map-marker"
      size={20}
      color="#C91C1C"
      style={styles.icon}
    />
    <Text
      style={styles.locationText}
      numberOfLines={2}              // ✅ restrict to 2 lines
      ellipsizeMode="tail"           // ✅ show ... after 2 lines
    >
      <Text style={styles.boldLabel}>Pickup :</Text> {item.pick_address}
    </Text>
  </View>

  {/* Drop */}
  <View style={styles.row}>
    <MaterialCommunityIcons
      name="map-marker"
      size={20}
      color="#C91C1C"
      style={styles.icon}
    />
    <Text
      style={styles.locationText}
      numberOfLines={2}              // ✅ restrict to 2 lines
      ellipsizeMode="tail"           // ✅ show ... after 2 lines
    >
      <Text style={styles.boldLabel}>Drop :</Text> {item.drop_address}
    </Text>
  </View>
</View>

      <View style={styles.divider} />

      {/* Info */}
      <View style={styles.infoRow}>
        <View style={styles.column}>
          <Text style={styles.infoText}>
            <Text style={styles.boldLabel}>Name :</Text>{' '}
            {truncateText(item.name, 10)}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.infoText}>
            <Text style={styles.boldLabel}>Contact :</Text> {item.contact}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Amount */}
      <View style={styles.amountRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹ {item.total_amount}</Text>
      </View>

      {/* Buttons with Icons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => navigation.navigate('CurrentBookingDetails', { id: item.id })}
        >
         
          <Text style={styles.viewText}> View Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => navigation.navigate('TrackDrivar', { id: item.id })}
        >
          <MaterialCommunityIcons name="ambulance" size={20} color="#fff" />
          <Text style={styles.trackText}> Track Ambulance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <LottieView
          source={require('../../Assets/lottie/Loading1.json')}
          autoPlay
          loop
          style={{ width: 120, height: 120 }}
        />
      </View>
    );
  }

  if (!loading && bookingData.length === 0) {
    return (
      <View style={styles.center}>
        <LottieView
          source={require('../../Assets/lottie/NoData.json')}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />
        <Text style={{ fontSize: 18, color: '#888', marginTop: 10 }}>
          No current bookings
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={bookingData}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCard}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 3,
    borderColor: '#096B09',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  image: { width: 50, height: 50, resizeMode: 'contain', marginRight: 12 },
  bookingId: { fontSize: Fonts.size.addition, fontWeight: 'bold', color: '#000',paddingBottom:6 },

  // Combined type + details
  typeAndDetails: { fontSize: Fonts.size.PageHeading, fontWeight: 'bold', color: '#000' },
  subtitle: { color: '#4D2161', fontSize: Fonts.size.PageSubheading,  marginTop: 4, },

  badge: {
    backgroundColor: '#FAF0FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: '#d00000', fontWeight: 'bold',  fontSize: Fonts.size.PageSubheading  },
  icon: {
    borderWidth: 1,
    padding: 3,
    borderRadius: 20,
    borderColor: '#FFEAEA',
    backgroundColor: '#FFEAEA',
  },
  locationContainer: { marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  locationText: {
    flex: 1,
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
    top: 3,
  },
  boldLabel: { fontWeight: 'bold', fontSize: Fonts.size.PageHeading,},
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    borderStyle: 'dotted',
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  column: { flex: 1 },
  infoText: { fontSize: 14, color: '#444' },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  totalLabel: { fontSize: Fonts.size.addition, fontWeight: 'bold' },
  totalAmount: {  fontSize: Fonts.size.addition, fontWeight: 'bold', color: '#000' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#7518AA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    height: 48,
  },
  viewText: { color: '#7518AA', fontWeight: 'bold',  fontSize: Fonts.size.PageHeading, },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#7518AA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  trackText: { color: '#fff', fontWeight: 'bold',   fontSize: Fonts.size.PageHeading, },
});

export default CurrentBookingCardScreen;
