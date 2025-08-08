// AccidentScreen.js

import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CustomHeader from '../../../Header'; 
import logo from '../../Assets/logos.png';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';

const AccidentScreen = ({ navigation }) => {
  const [location, setLocation] = useState('');
  const [currentLocation, setCurrentLocation] = useState(
    'West Mambalam, Chennai - 33'
  );
  const [showLocationModal, setShowLocationModal] = useState(false);

  const data = [
    {
      id: 1,
      name: 'Dr. Kamakshi Memorial Hospital',
      timing: 'Open 24 hours',
      address: 'No 3/1, 1 street, West Mambalam, Chennai- 33',
      Image: require('../../Assets/Hospital.png'),
      route: 'EmergencyHospitalDetailScreen',
      rating: '4.3',
    },
    {
      id: 2,
      name: 'Apollo Speciality Hospital',
      timing: 'Open 24 hours',
      address: 'Mount Road, Chennai',
      Image: require('../../Assets/Hospital.png'),
      route: 'StrokeScreen',
      rating: '4.3',
    },
  ];

  const handleLocationSubmit = () => {
    if (!location.trim()) {
      Alert.alert('Error', 'Please enter a location');
      return;
    }
    setCurrentLocation(location.trim());
    setShowLocationModal(false);
    Alert.alert('Success', 'Location updated successfully');
  };

  const HospitalCard = ({ hospital }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate(hospital.route)}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image style={styles.serviceIcon} source={hospital.Image} />
        <View style={[styles.serviceNameContainer, { marginLeft: 10, flex: 1 }]}>
          <Text style={styles.serviceName}>
            {hospital.name}
            {hospital.name.length <= 10 && '  ' + hospital.timing}
          </Text>
          {hospital.name.length > 10 && (
            <Text style={styles.timing}>({hospital.timing})</Text>
          )}
          <Text style={styles.address}>
            <Entypo name="location-pin" size={20} color="red" />
            {hospital.address}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              top: 10,
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              <AntDesign name="star" size={16} color="gold" />
              <Text
                style={{
                  fontSize: Fonts.size.PageHeading,
                  fontWeight: 'bold',
                  color: '#333',
                  left: 6,
                  fontFamily: Fonts.family.regular,
                }}
              >
                {hospital.rating}
              </Text>
            </View>
            <Text style={styles.viewdetails}>View Details</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />

      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.topBackground}
      >
        {/* Custom Header */}
        <CustomHeader
          onNotificationPress={() => Alert.alert('Notification pressed')}
          onImagePress={() => Alert.alert('Emergency icon pressed')}
        />

        {/* Title */}
        <TouchableOpacity
          style={{ flexDirection: 'row', padding: 5, top: 10, alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome6 name="angle-left" size={16} color="black" />
          <Text style={styles.type}>Accident / Trauma</Text>
        </TouchableOpacity>

        {/* Location */}
        <View style={styles.locationContainer}>
          <Text style={styles.locationPin}>📍</Text>
          <Text style={styles.locationLabel}>Your Location: </Text>
          <TouchableOpacity onPress={() => setShowLocationModal(true)}>
            <Text style={styles.locationText}>
              {currentLocation.length > 20
                ? currentLocation.substring(0, 20) + '...'
                : currentLocation}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal for Changing Location */}
        <Modal
          visible={showLocationModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowLocationModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setShowLocationModal(false)}
                >
                  <Icon name="chevron-left" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Change your Location</Text>
                <View style={styles.placeholder} />
              </View>

              {/* Modal Content */}
              <View style={styles.modalContent}>
                <Text style={styles.modalSubtitle}>
                  Do you want to change your current location?
                </Text>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputIcon}>📍</Text>
                  <TextInput
                    placeholder="Enter your new location"
                    style={styles.locationInput}
                    value={location}
                    onChangeText={setLocation}
                  />
                </View>

                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleLocationSubmit}
                >
                  <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Hospital Cards */}
        <View style={styles.servicesGrid}>
          {data.map(hospital => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AccidentScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    minHeight: hp('100%'),
  },
  type: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: 'black',
    left: 10,
    fontFamily: Fonts.family.regular,
  },
  servicesGrid: {
    justifyContent: 'space-between',
    marginBottom: 30,
    top: 10,
  },
  serviceCard: {
    width: wp('92%'),
    height: hp('20%'),
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    padding: 12,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceIcon: {
    width: 120,
    height: 150,
    borderRadius: 8,
  },
  serviceNameContainer: {
    flexDirection: 'column',
  },
  serviceName: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
    fontFamily: Fonts.family.regular,
  },
  timing: {
    fontSize: Fonts.size.PageHeading,
    color: '#177C1B',
    marginTop: 2,
    fontWeight: 'bold',
    fontFamily: Fonts.family.regular,
  },
  address: {
    flexDirection: 'row',
    fontSize: Fonts.size.PageHeading,
    color: '#555',
    marginTop: 4,
    fontFamily: Fonts.family.regular,
  },
  viewdetails: {
    width: wp('25%'),
    height: hp('3%'),
    borderRadius: 5,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(96, 15, 143)',
    color: 'white',
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.PageSubheading,
    padding: 5,
  },

  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
    top: 20,
  },
  locationPin: {
    fontSize: 16,
    color: 'red',
    marginRight: 8,
    fontFamily: Fonts.family.regular,
  },
  locationLabel: {
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '500',
    color: 'rgba(83, 90, 91, 1)',
    marginLeft: 8,
    fontFamily: Fonts.family.regular,
  },
  locationText: {
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '500',
    color: '#000000',
    textDecorationLine: 'underline',
    fontFamily: Fonts.family.regular,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    paddingVertical: 20,
    overflow: 'hidden',
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 36,
  },
  modalContent: {
    padding: 16,
  },
  modalSubtitle: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  inputIcon: {
    fontSize: 16,
    color: '#6B7280',
    marginRight: 12,
    fontFamily: Fonts.family.regular,
  },
  locationInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: Fonts.size.PageHeading,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#7518AA',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    fontFamily: Fonts.family.regular,
  },
});
