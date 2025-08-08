import React, { useState } from 'react';
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
} from 'react-native';
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

const BookingDetailsScreen = ({ navigation }) => {

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

          <TouchableOpacity style={styles.changeLocationBtn} >
            <Text style={styles.changeLocationText}>Schedule Book</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          

    


          {/* Ambulance Card */}
          <View style={styles.driverCard1}>
  <Image
    source={require('../../Assets/ambualnce.png')}
    style={styles.driverImage}
  />
  <View style={styles.driverInfo}>
    {/* Top Row: Patient Transfer + Vehicle ID */}
    <View style={styles.topRow}>
      <Text style={styles.driverName}>Patient Transfer</Text>
      <Text style={styles.vehicleText1}>AM01D2313</Text>
    </View>

    {/* Middle Row: Ambulance icon + Type */}
    <View style={styles.nameRow}>
      <MaterialIcons name="ambulance" size={18} color="#7B2CBF" style={{ marginRight: 4 }} />
      <Text style={styles.rating}>Small (Omni, etc)</Text>
    </View>
  </View>
</View>


              <View style={styles.divider} />


          {/* Pickup & Drop */}
       <View style={styles.section}>
  {/* Pickup Section */}
  <View style={styles.locationRow}>
    <View style={styles.locationIconLabel}>
     
      <Text style={styles.locationHeading}>Pickup</Text>
    </View>
    <Text style={styles.locationValue}>
       <MaterialIcons name="map-marker" size={18} color="#FF6B6B" />
      NO 3/1, I Street west mambalam chennai -33
    </Text>
  </View>

  {/* Drop Section */}
  <View style={[styles.locationRow, { marginTop: 12 }]}>
    <View style={styles.locationIconLabel}>
     
      <Text style={styles.locationHeading}>Drop</Text>
    </View>
    <Text style={styles.locationValue}>
       <MaterialIcons name="map-marker" size={18} color="#8E44AD" />
      NO 3/1, I Street vyasarpadi chennai -33
    </Text>
  </View>

</View>

              <View style={styles.divider} />


          {/* Booking Date & Time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking Date & Time</Text>
       

            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Date</Text>
              <Text style={styles.value}>21 / 03 / 2025</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Booking Time</Text>
              <Text style={styles.value}>05 : 30 PM</Text>
            </View>
          </View>

                   <View style={styles.divider} />

          {/* Customer Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <Text style={styles.value}>Name : Jeswanth Kumar</Text>
            <Text style={styles.value}>Mobile Number : 9345665447</Text>
          </View>

                   <View style={styles.divider} />

          {/* Assistance */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assistance for the Patient</Text>
            <View style={styles.infoRow}>
              <Text style={styles.value}>First Floor</Text>
              <Text style={styles.value}>₹ 350</Text>
            </View>
          </View>

                   <View style={styles.divider} />

        

          {/* Price Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Ambulance Cost</Text>
              <Text style={styles.value}>₹ 1,500</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Assistance for the Patient</Text>
              <Text style={styles.value}>₹ 350</Text>
            </View>  

                     <View style={styles.divider} />
            <View style={[styles.infoRow]}>
              <Text style={[styles.label, { fontSize: Fonts.size.PageHeading }]}>Total Price</Text>
              <Text style={[styles.value, { fontSize: Fonts.size.PageHeading, color: '#7B2CBF' }]}>₹ 1,850</Text>
            </View>
                     <View style={styles.divider} />
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
    borderColor: '#1C59C9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor:'#FFFFFF'
  },
  changeLocationText: {
    color: '#1C59C9',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
  },

   divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    borderStyle: 'dotted',
    marginVertical: 10,
  },
  
driverCard1: {
  flexDirection: 'row',

  padding: 14,
  margin: 5,
 
},
driverImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 12,
},
driverInfo: {
  flex: 1,
  justifyContent: 'center',
},
topRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 4,
},
driverName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#000',
},
vehicleText: {
  fontSize: 13,
  color: '#D00000',
  backgroundColor: '#FFE9F0',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
},
nameRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
rating: {
  fontSize: 14,
  color: '#555',
},

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    fontSize: Fonts.size.PageHeading,
    color: '#333',
    fontWeight: '600',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  vehicleBox: {
    marginTop: 6,
  },
  vehicleText1: {
    fontSize: 13,
  color: '#D00000',
  backgroundColor: '#FFE9F0',
  paddingHorizontal: 8,
  paddingVertical: 4,
  borderRadius: 6,
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
  paddingLeft: 22, // to align with text after the icon
},

  locationLabel: {
    fontWeight: 'bold',
    marginHorizontal: 8,
    fontSize: Fonts.size.PageHeading,
  },
  locationValue: {
    color: '#333',
    flex: 1,
    fontSize: Fonts.size.PageHeading,
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
