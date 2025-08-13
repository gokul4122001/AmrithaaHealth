import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
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

  console.log(token,"token")

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await Emergency_Booking(token, 'cancelled');
      setBookingData(response?.data || []);

    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const truncateText = (text, maxLength) =>
    text?.length > maxLength ? text.slice(0, maxLength) + '...' : text;

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Image
          source={{ uri: `${IMAGE_URL}${item.ambulance_icon}` }}
          style={styles.image}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.ambulance_type}</Text>
          <Text style={styles.subtitle}>{item.ambulance_details}</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* Locations */}
      <View style={styles.locationContainer}>
        <View style={[styles.row, { marginBottom: 10 }]}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color="#C91C1C"
            style={styles.iconStyle}
          />
          <Text style={styles.locationText}>
            <Text style={styles.boldLabel}>Pickup :</Text> {item.pick_address}
          </Text>
        </View>
        <View style={styles.row}>
          <MaterialCommunityIcons
            name="map-marker"
            size={20}
            color="#C91C1C"
            style={styles.iconStyle}
          />
          <Text style={styles.locationText}>
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
            {truncateText(item.name, 7)}
          </Text>
          <View style={{ marginVertical: 6 }} />
          <Text style={styles.infoText}>
            <Text style={styles.boldLabel}>Date :</Text> {item.booking_date}
          </Text>
        </View>
        <View style={styles.column}>
          <Text style={styles.infoText}>
            <Text style={styles.boldLabel}>Contact :</Text> {item.contact}
          </Text>
          <View style={{ marginVertical: 6 }} />
          <Text style={styles.infoText}>
            <Text style={styles.boldLabel}>Time :</Text> {item.booking_time}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Amount */}
      <View style={styles.amountRow}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹ {item.total_amount}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.rejectButton, { marginRight: 8 }]}
          onPress={() => Alert.alert('Completed', 'Booking marked as completed')}
        >
          <Text style={styles.rejectText}>{item.status}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => navigation.navigate('CancelViewDetails', { id: item.id })}
        >
          <Text style={styles.acceptText}>View Details</Text>
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
      contentContainerStyle={styles.container}
      renderItem={renderCard}
    />
  );
};

const styles = StyleSheet.create({
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
      borderLeftWidth:3,
    borderColor:'#1824AA'
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  image: { width: 50, height: 50, resizeMode: 'contain', marginRight: 12 },
  title: { fontSize: Fonts.size.PageHeading, fontWeight: 'bold' },
  subtitle: { color: '#7f8c8d', marginTop: 4, fontSize: Fonts.size.PageSubheading },

  locationContainer: { marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  locationText: {
    flex: 1,
    fontSize: Fonts.size.PageHeading,
    marginLeft: 8,
    color: '#333',
    top: 3,
  },
  boldLabel: { fontWeight: 'bold', fontSize: Fonts.size.PageHeading },
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
  column: {
    flex: 1,
  },
  infoText: { fontSize: 14, color: '#444' },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    alignItems: 'center',
  },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  rejectButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E3E6FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#E3E6FF',
  },
  rejectText: { color: '#1824AA', fontWeight: 'bold', fontSize: 16 },
  acceptButton: {
    flex: 1,
    backgroundColor: '#7518AA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  iconStyle: {
    borderWidth: 1,
    padding: 3,
    borderRadius: 20,
    borderColor: '#FFEAEA',
    backgroundColor: '#FFEAEA',
  },
   center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CurrentBookingCardScreen;
