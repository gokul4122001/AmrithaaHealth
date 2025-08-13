import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Fonts/Fonts';

const CurrentBookingCardScreen = () => {
  const navigation = useNavigation();
  const [cardVisible, setCardVisible] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const otpRefs = useRef([]);

  const handleReject = () => {
    setCardVisible(false);
  };

  const handleAccept = () => {
    setAccepted(true);
  };

  function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + '...';
  }
  return text;
}


  const handleOtpChange = (index, value) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 3) {
      otpRefs.current[index + 1].focus();
    }
  };

  const submitOtp = () => {
    if (otp.every(val => val !== '')) {
      setOtpModalVisible(false);
      setOtpVerified(true);
    } else {
      Alert.alert('Error', 'Please enter all OTP digits');
    }
  };

  if (!cardVisible) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Image
            source={require('../../Assets/ambualnce.png')}
            style={styles.image}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Patient Transfer</Text>
            <Text style={styles.subtitle}>Small ( Omni, etc )</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Schedule Book</Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Locations */}
   <View style={styles.locationContainer}>
  <View style={[styles.row, { marginBottom: 10 }]}> {/* spacing here */}
    <MaterialCommunityIcons
      name="map-marker"
      size={20}
      color="#C91C1C"
      style={{
        borderWidth: 1,
        padding: 3,
        borderRadius: 20,
        borderColor: '#FFEAEA',
        backgroundColor: '#FFEAEA',
      }}
    />
    <Text style={styles.locationText}>
      <Text style={styles.boldLabel}>Pickup :</Text> No 3/1, 1 Street west mambalam chennai -33
    </Text>
  </View>

  <View style={styles.row}>
    <MaterialCommunityIcons
      name="map-marker"
      size={20}
      color="#C91C1C"
      style={{
        borderWidth: 1,
        padding: 3,
        borderRadius: 20,
        borderColor: '#FFEAEA',
        backgroundColor: '#FFEAEA',
      }}
    />
    <Text style={styles.locationText}>
      <Text style={styles.boldLabel}>Drop :</Text> No 3/1, 1 Street vyasrapadi chennai -33
    </Text>
  </View>
</View>


        <View style={styles.divider} />

        {/* Info */}
     <View style={styles.infoRow}>
  <View style={styles.column}>
   <Text style={styles.infoText}>
  <Text style={styles.boldLabel}>Name :</Text> {truncateText('Jeswanth', 7)}
</Text>

    <View style={{ marginVertical: 6 }} /> 
    <Text style={styles.infoText}>
      <Text style={styles.boldLabel}>Date :</Text> 09/04/2025
    </Text>
  </View>
  <View style={styles.column}>
    <Text style={styles.infoText}>
      <Text style={styles.boldLabel}>Contact :</Text> 934566547
    </Text>
    <View style={{ marginVertical: 6 }} /> 
    <Text style={styles.infoText}>
      <Text style={styles.boldLabel}>Time :</Text> 05 : 10 PM
    </Text>
  </View>
</View>


        <View style={styles.divider} />

        {/* Amount */}
        <View style={styles.amountRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹ 1,800</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          {!accepted ? (
            <>
              <TouchableOpacity style={styles.rejectButton} onPress={handleReject}>
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAccept}>
                <Text style={styles.acceptText}>Accept</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.rejectButton, { marginRight: 8 }]}
                onPress={() => navigation.navigate('ScheduleBooking')}
              >
                <Text style={styles.rejectText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={() => navigation.navigate('TrackDrivar')}
              >
                <Text style={styles.acceptText}>Track Location</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* OTP Modal */}
      <Modal visible={otpModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Enter OTP</Text>
            <View style={styles.otpRow}>
              {[0, 1, 2, 3].map((_, index) => (
                <TextInput
                  key={index}
                  ref={ref => otpRefs.current[index] = ref}
                  value={otp[index]}
                  onChangeText={(value) => handleOtpChange(index, value)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={styles.otpBox}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.submitBtn} onPress={submitOtp}>
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    borderColor:'#AA181A'
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  image: { width: 50, height: 50, resizeMode: 'contain', marginRight: 12 },
  title: {    fontSize:  Fonts.size.PageHeading, fontWeight: 'bold' },
  subtitle: { color: '#7f8c8d', marginTop: 4,   fontSize:  Fonts.size.PageSubheading, },
  badge: {
    backgroundColor: '#DFD8FF',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { color: '#1C59C9', fontWeight: 'bold',   fontSize:  Fonts.size.PageHeading, },
  locationContainer: { marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  locationText: { flex: 1,    fontSize:  Fonts.size.PageHeading, marginLeft: 8, color: '#333',top:3 },
  boldLabel: { fontWeight: 'bold',   fontSize:  Fonts.size.PageHeading,},
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
  infoText: { fontSize: 14, color: '#444', },
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
    borderColor: '#7518AA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  rejectText: { color: '#7518AA', fontWeight: 'bold', fontSize: 16 },
  acceptButton: {
    flex: 1,
    backgroundColor: '#7518AA',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // OTP Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  otpBox: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    marginHorizontal: 5,
  },
  submitBtn: {
    backgroundColor: '#5A2FBA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  
});

export default CurrentBookingCardScreen;
