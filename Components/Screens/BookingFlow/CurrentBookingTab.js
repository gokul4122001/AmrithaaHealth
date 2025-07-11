import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Colors from '../../Colors/Colors';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Fonts/Fonts';

const CurrentBookingTab = () => {
   const navigation = useNavigation();
  const currentBookings = [
    {
      id: '1',
      type: 'Patient Transfer',
      category: 'Emergency',
      size: 'Small (Omni, etc)',
      pickup: 'No 3/1, I Street west mambalam chennai -33',
      drop: 'No 3/1, I Street vyasarpadi chennai -33',
      name: 'Jeswanth Kumar',
      contact: '934566547',
      amount: '₹ 1,800',
      status: 'active',
     
    },
    {
      id: '2',
      type: 'Patient Transfer',
      category: 'Emergency',
      size: 'Small (Omni, etc)',
      pickup: 'No 3/1, I Street west mambalam chennai -33',
      drop: 'No 3/1, I Street vyasarpadi chennai -33',
      name: 'Jeswanth Kumar',
      contact: '934566547',
      amount: '₹ 1,800',
      status: 'active',
    },
  ];

  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.ambulanceContainer}>
          <Image
            source={require('../../Assets/ambualnce.png')}
            style={styles.ambulanceImage}
          />
        </View>
        <View style={styles.bookingInfo}>
          <View style={styles.bookingTopRow}>
            <Text style={styles.bookingType}>{booking.type}</Text>
            <Text style={styles.bookingCategory}>{booking.category}</Text>
          </View>
          <Text style={styles.bookingSize}>{booking.size}</Text>
        </View>
      </View>

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View style={styles.locationDot} />
          <Text style={styles.locationLabel}>Pickup :</Text>
          <Text style={styles.locationText}>{booking.pickup}</Text>
        </View>
        <View style={styles.locationRow}>
          <View style={[styles.locationDot, { backgroundColor: '#ff4444' }]} />
          <Text style={styles.locationLabel}>Drop :</Text>
          <Text style={styles.locationText}>{booking.drop}</Text>
        </View>
      </View>

      <View style={styles.customerInfo}>
        <Text style={styles.customerText}>Name : {booking.name}</Text>
        <Text style={styles.customerText}>Contact : {booking.contact}</Text>
      </View>

      <View style={styles.amountSection}>
        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amountText}>{booking.amount}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
  <TouchableOpacity
  style={styles.viewDetailsButton}
 onPress={() => navigation.navigate('BookingDetailsScreen')}

>
  <Text style={styles.viewDetailsText}>View Details</Text>
</TouchableOpacity>


        <TouchableOpacity style={styles.trackButton}>
          <MaterialCommunityIcons name="ambulance" size={16} color="white" />
          <Text style={styles.trackButtonText}>Track Ambulance</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: hp('10%'), flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {currentBookings.map(renderBookingCard)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('4%'),
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: wp('4%'),
    marginBottom: hp('2%'),
marginTop:10,
    // iOS Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    // Android Shadow
    elevation: 7,
    borderLeftWidth:4,
    borderLeftColor:'#096B09'
  },
  bookingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  ambulanceContainer: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  ambulanceImage: {
    width: 100,
    height: 200,
    resizeMode: 'contain',
  },
  bookingInfo: {
    flex: 1,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent:'space-between'
  },
  bookingType: {
    fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#333',
    marginRight: wp('3%'),
  },
  bookingCategory: {
     fontSize:  Fonts.size.PageHeading,
    color: '#C91C1C',
    fontWeight: '600',
    borderWidth:1,
    padding:5,
    borderRadius:10,
    backgroundColor:'#FAF0FF',
    borderColor:'#FAF0FF',
    marginRight: wp('3%'),
  },
  bookingSize: {
    fontSize: hp('1.4%'),
    color: Colors.statusBar,
  },
  locationContainer: {
    marginBottom: hp('2%'),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: hp('1%'),
  },
  locationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginTop: 6,
    marginRight: wp('2%'),
  },
  locationLabel: {
  fontSize:  Fonts.size.PageHeading,
    color: '#666',
    fontWeight: '600',
    marginRight: wp('2%'),
    minWidth: wp('15%'),
  },
  locationText: {
  fontSize:  Fonts.size.PageHeading,
    color: '#333',
    flex: 1,
  },
  customerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  customerText: {
  fontSize:  Fonts.size.PageHeading,
    color: '#333',
    fontWeight: '600',
  },
  amountSection: {
    marginBottom: hp('2%'),
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize:  Fonts.size.PageHeading,
    color: '#666',
    fontWeight: '600',
  },
  amountText: {
    fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDetailsButton: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
   
    marginRight: wp('2%'),
    alignItems: 'center',
  },
  viewDetailsText: {
   fontSize:  Fonts.size.PageHeading,
    color:Colors.statusBar,
    fontWeight: '600'
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.5%'),
    borderRadius: 6,
   backgroundColor:Colors.statusBar
  },
  trackButtonText: {
    fontSize:  Fonts.size.PageHeading,
    color: 'white',
    fontWeight: '600',
    marginLeft: wp('1%'),
  },
});

export default CurrentBookingTab;
