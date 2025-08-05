import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  Image
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';
import CustomHeader from '../../../Header';

const AmbulanceBookingScreen = ({ navigation }) => {
  const [bookingFor, setBookingFor] = useState('Others');
  const [bookingType, setBookingType] = useState('Emergency');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isScheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [after3HoursChecked, setAfter3HoursChecked] = useState(false);
  const [isScheduleValid, setIsScheduleValid] = useState(true);

  const services = [
    { title: 'Heart Attack', image: require('../../Assets/heartattact.png'), screen: 'SelectHospitalScreen' },
    { title: 'Poisoning', image: require('../../Assets/poisioning.png') },
    { title: 'Accidents care', image: require('../../Assets/caraccient.png') },
    { title: 'Skin Diseases', image: require('../../Assets/skindiease.png') },
    { title: 'CPR', image: require('../../Assets/CPR.png') },
    { title: 'Stroke', image: require('../../Assets/stoke.png') },
    { title: 'Unknown Bites', image: require('../../Assets/unknownbits.png') },
    { title: 'Pediatric emergency medicine', image: require('../../Assets/pediatricemergency.png') },
    { title: 'Others Emergencies', image: require('../../Assets/otherEmergency.png') },
  ];

  const handleNext = () => {
    const bookingDetails = {
      bookingFor,
      bookingType,
      selectedCategory,
      scheduledDate: bookingType === 'Schedule Booking' ? selectedDate.toISOString() : null,
      scheduledTime: bookingType === 'Schedule Booking' ? selectedTime.toISOString() : null,
      after3Hours: bookingType === 'Schedule Booking' ? after3HoursChecked : null,
    };
    navigation.navigate('LiveTrakingScreen', { bookingDetails });
  };

  const toggleScheduleModal = () => {
    setScheduleModalVisible(!isScheduleModalVisible);
    if (!isScheduleModalVisible) resetScheduleModal();
  };

  const resetScheduleModal = () => {
    setSelectedDate(new Date());
    setSelectedTime(new Date());
    setAfter3HoursChecked(false);
    setIsScheduleValid(true);
  };

  const getMinimumDate = () => new Date();

  const onDateChange = (event, pickedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'set' && pickedDate) {
      setSelectedDate(pickedDate);
      validateScheduleTime(pickedDate, selectedTime);
    }
  };

  const onTimeChange = (event, pickedTime) => {
    if (Platform.OS === 'android') setShowTimePicker(false);
    if (event.type === 'set' && pickedTime) {
      setSelectedTime(pickedTime);
      validateScheduleTime(selectedDate, pickedTime);
    }
  };

  const validateScheduleTime = (date, time) => {
    const now = new Date();
    const threeHoursFromNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const selectedDateTime = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    );
    const isValid = selectedDateTime.getTime() >= threeHoursFromNow.getTime();
    setAfter3HoursChecked(isValid);
    setIsScheduleValid(isValid);
  };

  const handleScheduleSubmit = () => {
    if (!isScheduleValid) {
      Alert.alert('Invalid Time', 'Please select a date and time at least 3 hours from now.');
      return;
    }
    setBookingType('Schedule Booking');
    toggleScheduleModal();
  };

  useEffect(() => {
    validateScheduleTime(selectedDate, selectedTime);
  }, [selectedDate, selectedTime]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.topBackground}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
          <CustomHeader
            username="Janmani Kumar"
            onNotificationPress={() => console.log('Notification Pressed')}
            onWalletPress={() => console.log('Alarm Pressed')}
          />

          <View style={styles.questionContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon name="chevron-left" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.question}>Which ambulance variant do you choose?</Text>
          </View>

          {/* Booking For */}
          <View style={styles.section}>
            <Text style={{ fontSize: Fonts.size.PageHeading, marginBottom: 15, fontWeight: '700' }}>Ambulance Booking For</Text>
            <View style={styles.radioGroup}>
              {['Yourself', 'Others'].map((option) => {
                const isSelected = bookingFor === option;
                return (
                  <TouchableOpacity
                    key={option}
                    style={[styles.radioOption, isSelected && styles.radioOptionSelected]}
                    onPress={() => setBookingFor(option)}
                  >
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={styles.radioText}>{option}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Booking Type */}
          <View style={{ top: 5 }}>
            <Text style={{ fontSize: Fonts.size.PageHeading, marginBottom: 15, fontWeight: '700' }}>Select the Option</Text>
            <View style={styles.bookingTypeGroup}>
              {['Emergency', 'Schedule Booking'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.bookingTypeOption,
                    bookingType === type && styles.bookingTypeSelected
                  ]}
                  onPress={() => {
                    if (type === 'Schedule Booking') {
                      setBookingType(type);
                      toggleScheduleModal();
                    } else {
                      setBookingType(type);
                    }
                  }}
                >
                  <View style={[styles.radioCircle, bookingType === type && styles.radioSelected]}>
                    {bookingType === type && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.bookingTypeText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Pickup & Destination Inputs with Lottie */}
          <View style={styles.locationCard}>
            <View style={styles.locationRow}>
              <View style={styles.iconColumn}>
                <LottieView
                  source={require('../../Assets/lottie/greendot.json')}
                  autoPlay
                  loop
                  style={styles.lottieDot}
                />
                <View style={styles.verticalLine} />
                <LottieView
                  source={require('../../Assets/lottie/reddot.json')}
                  autoPlay
                  loop
                  style={styles.lottieDot}
                />
              </View>
              <View style={styles.textColumn}>
                <TextInput placeholder="Enter pickup location" style={styles.locationInput} placeholderTextColor="#555" />
                <View style={styles.separator} />
                <TextInput placeholder="Enter destination location" style={styles.locationInput} placeholderTextColor="#555" />
              </View>
            </View>
          </View>

          {/* Emergency Categories */}
          <View style={styles.categorySection}>
            <Text style={styles.categoryHeader}>Don't know the issue? Select a category</Text>
            <View style={styles.grid}>
              {services.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => item.screen && navigation.navigate(item.screen)}
                >
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              {services.length % 3 === 2 && <View style={styles.card} />}
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={{ color: '#fff', fontSize: Fonts.size.PageHeading, fontFamily: Fonts.family.regular }}>Next</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Modals & Pickers below... (unchanged) */}
        {/* keep your modal & picker logic here */}
      </LinearGradient>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
  },
  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
  },
  content: {},
  question: {
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '600',
    color: '#000',
    marginVertical: 16,
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  section: {
    marginVertical: 10,
  },
  radioGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    marginHorizontal: 5,
    flex: 1,
    height: 60,
  },
  radioOptionSelected: {
    backgroundColor: '#ffff',
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#aaa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioSelected: {
    borderColor: '#7518AA',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#7518AA',
  },
  radioText: {
    fontSize: Fonts.size.PageSubheading,
  },
  bookingTypeGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  bookingTypeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    flex: 1,
    marginHorizontal: 5,
    height: 60,
  },
  bookingTypeSelected: {
    backgroundColor: '#ffff',
    borderColor: '#E8E8E8',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  radioDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#7518AA',
  },
  bookingTypeText: {
    fontSize: Fonts.size.PageSubheading,
    fontFamily: Fonts.family.regular,
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
    width: wp('90%'),
    height: hp('15%'),
    alignSelf: 'center',
  },
  locationRow: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 5,
  },
  circleGreen: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#00C851',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  verticalLine: {
    height: 40,
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#999',
    marginVertical: 6,
  },
  circleRed: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ff4444',
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  locationInput: {
    fontSize: Fonts.size.PageSubheading,
    color: '#000',
    paddingVertical: 4,
    height: 40,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 6,
  },
  categorySection: {
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  categoryHeader: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '700',
    color: 'black',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderColor: '#E8E8E8',
    padding: 15,
  },
  card: {
    width: '30%',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  cardTitle: {
    marginTop: 5,
    fontSize: Fonts.size.PageSubheading,
    textAlign: 'center',
    fontWeight: '600',
    color: '#000000',
  },
  nextButton: {
    backgroundColor: Colors.statusBar,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    alignSelf: 'center',
    width: '90%',
    marginVertical: 20,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#000',
  },
  modalSubtitle: {
    fontSize: Fonts.size.PageSubheading,
    color: '#666',
    marginBottom: 20,
  },
  datePickerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  timePickerInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
  },
  datePickerText: {
    fontSize: Fonts.size.PageSubheading,
    color: '#333',
    fontFamily: Fonts.family.regular,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
    flexShrink: 1,
    fontFamily: Fonts.family.regular,
  },
  modalSubmitButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalSubmitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  modalSubmitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
  validationMessage: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
   lottieDot: {
    width: 30,
    height: 30,
  },
});
export default AmbulanceBookingScreen;