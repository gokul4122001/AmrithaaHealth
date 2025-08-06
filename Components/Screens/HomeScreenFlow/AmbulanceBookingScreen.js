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
  Image,
  PermissionsAndroid,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Geolocation from 'react-native-geolocation-service';

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';
import CustomHeader from '../../../Header';
import { useSelector } from 'react-redux';

const AmbulanceBookingScreen = ({ navigation, route }) => {
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

  // Location states
  const [pickupLocation, setPickupLocation] = useState('');
  const [destinationLocation, setDestinationLocation] = useState('');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [originalPickupFromRoute, setOriginalPickupFromRoute] = useState('');
  const [originalDestinationFromRoute, setOriginalDestinationFromRoute] = useState('');

  // Autocomplete states
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [showPickupSuggestions, setShowPickupSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  const [pickupQuery, setPickupQuery] = useState('');
  const [destinationQuery, setDestinationQuery] = useState('');

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

  const token = useSelector(state => state.auth.token);

  // Initialize with data from previous screen if available
  useEffect(() => {
    console.log('Route params:', route?.params);
    if (route?.params) {
      const { pickup, destination } = route.params;
      if (pickup) {
        setPickupLocation(pickup);
        setPickupQuery(pickup);
        setOriginalPickupFromRoute(pickup);
        console.log('Set pickup from route:', pickup);
      }
      if (destination) {
        setDestinationLocation(destination);
        setDestinationQuery(destination);
        setOriginalDestinationFromRoute(destination);
        console.log('Set destination from route:', destination);
      }
    }
  }, [route?.params]);

  // Google Places Autocomplete API
  const fetchLocationSuggestions = async (query, isPickup = true) => {
    if (!query || query.length < 3) {
      if (isPickup) {
        setPickupSuggestions([]);
        setShowPickupSuggestions(false);
      } else {
        setDestinationSuggestions([]);
        setShowDestinationSuggestions(false);
      }
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E&components=country:in`,
        {
          method: 'GET',
        }
      );

      const data = await response.json();
      
      if (data.status === 'OK' && data.predictions) {
        const suggestions = data.predictions.map(prediction => ({
          place_id: prediction.place_id,
          description: prediction.description,
          main_text: prediction.structured_formatting?.main_text || prediction.description,
          secondary_text: prediction.structured_formatting?.secondary_text || '',
        }));

        if (isPickup) {
          setPickupSuggestions(suggestions);
          setShowPickupSuggestions(true);
        } else {
          setDestinationSuggestions(suggestions);
          setShowDestinationSuggestions(true);
        }
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  // Handle pickup location input change
  const handlePickupInputChange = (text) => {
    setPickupQuery(text);
    setPickupLocation(text);
    
    if (bookingFor === 'Others') {
      fetchLocationSuggestions(text, true);
    }
  };

  // Handle destination location input change
  const handleDestinationInputChange = (text) => {
    setDestinationQuery(text);
    setDestinationLocation(text);
    fetchLocationSuggestions(text, false);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion, isPickup = true) => {
    if (isPickup) {
      setPickupLocation(suggestion.description);
      setPickupQuery(suggestion.description);
      setPickupSuggestions([]);
      setShowPickupSuggestions(false);
    } else {
      setDestinationLocation(suggestion.description);
      setDestinationQuery(suggestion.description);
      setDestinationSuggestions([]);
      setShowDestinationSuggestions(false);
    }
  };

  // Request location permission with better error handling
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const checkResult = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        if (checkResult) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs access to your location to set pickup point automatically.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        // For iOS
        const authStatus = await Geolocation.requestAuthorization('whenInUse');
        return authStatus === 'granted';
      }
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  };

  // Improved getCurrentLocation with better error handling
  const getCurrentLocation = async () => {
    console.log('Getting current location...');
    
    // Prevent multiple simultaneous location requests
    if (isLoadingLocation) {
      console.log('Location request already in progress');
      return;
    }
    
    try {
      setIsLoadingLocation(true);
      setPickupLocation('Getting location...');
      setPickupQuery('Getting location...');

      // Check permission first
      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        setIsLoadingLocation(false);
        // Restore original pickup if available, otherwise clear
        setPickupLocation(originalPickupFromRoute || '');
        setPickupQuery(originalPickupFromRoute || '');
        setBookingFor('Others');
        
        Alert.alert(
          'Location Permission Required',
          'Please enable location permission to use current location, or continue with manual entry.',
          [
            { 
              text: 'OK', 
              style: 'default'
            }
          ]
        );
        return;
      }

      console.log('Permission granted, getting position...');

      // Create a timeout promise to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Location timeout')), 20000)
      );

      // Create the geolocation promise
      const locationPromise = new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (position) => {
            console.log('Location received:', position.coords);
            resolve(position);
          },
          (error) => {
            console.error('Geolocation error:', error);
            reject(error);
          },
          {
            enableHighAccuracy: false,
            timeout: 15000,
            maximumAge: 60000,
            showLocationDialog: true,
            forceRequestLocation: true,
          }
        );
      });

      // Race between location and timeout
      const position = await Promise.race([locationPromise, timeoutPromise]);
      
      const { latitude, longitude } = position.coords;
      
      // Validate coordinates
      if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
        throw new Error('Invalid coordinates received');
      }
      
      setCurrentCoords({ latitude, longitude });
      console.log('Valid coordinates set:', { latitude, longitude });
      
      // Try to get address
      try {
        await reverseGeocode(latitude, longitude);
      } catch (geocodeError) {
        console.log('Geocoding failed, using coordinates:', geocodeError);
        const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
        setPickupLocation(coordString);
        setPickupQuery(coordString);
        setIsLoadingLocation(false);
      }
      
    } catch (error) {
      console.error('getCurrentLocation error:', error);
      setIsLoadingLocation(false);
      // Restore original pickup if available, otherwise clear
      setPickupLocation(originalPickupFromRoute || '');
      setPickupQuery(originalPickupFromRoute || '');
      
      let errorMessage = 'Unable to get current location. ';
      
      if (error.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Location permission was denied.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Location services are unavailable. Please check your GPS settings.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Location request timed out. Please ensure GPS is enabled.';
            break;
          default:
            errorMessage = 'An error occurred while getting your location.';
        }
      } else if (error.message === 'Location timeout') {
        errorMessage = 'Location request timed out. Please try again.';
      }
      
      setBookingFor('Others');
      
      Alert.alert(
        'Location Error', 
        errorMessage + ' You can continue with manual entry.',
        [
          { 
            text: 'Retry', 
            onPress: () => {
              // Small delay before retry
              setTimeout(() => {
                setBookingFor('Yourself');
                getCurrentLocation();
              }, 1000);
            }
          },
          { 
            text: 'Manual Entry', 
            onPress: () => {
              setBookingFor('Others');
            }
          }
        ]
      );
    }
  };

  // Improved reverse geocoding with fallback
  const reverseGeocode = async (latitude, longitude) => {
    try {
      console.log('Starting reverse geocoding for:', latitude, longitude);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E`,
        {
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Geocoding response:', data.status);
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        console.log('Address found:', address);
        setPickupLocation(address);
        setPickupQuery(address);
      } else {
        throw new Error('No geocoding results');
      }
    } catch (error) {
      console.log('Reverse geocoding error:', error);
      // Fallback to coordinate display
      const coordString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      setPickupLocation(coordString);
      setPickupQuery(coordString);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Geocode address to get coordinates with better error handling
  const geocodeAddress = async (address) => {
    try {
      if (!address || address.trim() === '') {
        return null;
      }

      console.log('Geocoding address:', address);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.trim())}&key=AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E`,
        {
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        return {
          latitude: location.lat,
          longitude: location.lng,
          formatted_address: data.results[0].formatted_address
        };
      } else {
        console.log('Geocoding failed:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  // Handle booking for selection change with safety checks
  const handleBookingForChange = (option) => {
    console.log('Booking for changed to:', option);
    
    // Cancel any ongoing location request
    if (isLoadingLocation) {
      setIsLoadingLocation(false);
    }
    
    setBookingFor(option);
    
    if (option === 'Yourself') {
      // Clear current coords and start fresh
      setCurrentCoords(null);
      
      // Start location fetching after a small delay to ensure state is updated
      setTimeout(() => {
        getCurrentLocation();
      }, 100);
    } else {
      // Reset to "Others" mode
      setCurrentCoords(null);
      setIsLoadingLocation(false);
      
      // Restore original locations from route params if available
      if (originalPickupFromRoute) {
        setPickupLocation(originalPickupFromRoute);
        setPickupQuery(originalPickupFromRoute);
      } else {
        setPickupLocation('');
        setPickupQuery('');
      }
      
      if (originalDestinationFromRoute) {
        setDestinationLocation(originalDestinationFromRoute);
        setDestinationQuery(originalDestinationFromRoute);
      }
    }
  };

  // API call function
  const createBookingAPI = async (bookingPayload) => {
    try {
      console.log('Creating booking with payload:', bookingPayload);
      
      const response = await fetch('https://www.myhealth.amrithaa.net/backend/api/user/booking/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload)
      });

      const result = await response.json();
      
      if (response.ok) {
        Alert.alert(
          'Booking Successful!',
          'Your ambulance has been booked successfully.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('LiveTrakingScreen', { 
                bookingDetails: result,
                bookingId: result.booking_id || result.id,
                pickup: pickupLocation,
                destination: destinationLocation
              })
            }
          ]
        );
      } else {
        Alert.alert('Booking Failed', result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('API Error:', error);
      Alert.alert('Network Error', 'Unable to connect to server. Please check your internet connection and try again.');
    }
  };

  const handleNext = async () => {
    // Validation
    if (!pickupLocation.trim() || pickupLocation === 'Getting location...') {
      Alert.alert('Missing Information', 'Please wait for location to load or enter pickup location manually.');
      return;
    }
    if (!destinationLocation.trim()) {
      Alert.alert('Missing Information', 'Please enter destination location.');
      return;
    }

    // Show loading indicator
    setIsLoadingLocation(true);

    try {
      // Get coordinates for destination
      let dropCoords = { latitude: null, longitude: null };
      
      const destinationCoords = await geocodeAddress(destinationLocation);
      if (destinationCoords) {
        dropCoords = {
          latitude: destinationCoords.latitude,
          longitude: destinationCoords.longitude
        };
      }

      // For pickup coordinates
      let pickupCoords = { latitude: null, longitude: null };
      
      if (bookingFor === 'Yourself' && currentCoords) {
        pickupCoords = currentCoords;
        console.log('Using current coordinates for pickup:', pickupCoords);
      } else {
        const pickupGeocode = await geocodeAddress(pickupLocation);
        if (pickupGeocode) {
          pickupCoords = {
            latitude: pickupGeocode.latitude,
            longitude: pickupGeocode.longitude
          };
        }
      }

      // Prepare API payload
      const apiPayload = {
        pickup_lat: pickupCoords.latitude,
        pickup_lng: pickupCoords.longitude,
        drop_lat: dropCoords.latitude,
        drop_lng: dropCoords.longitude,
        pick_address: pickupLocation,
        drop_address: destinationLocation,
        booking_type: bookingType === 'Emergency' ? 'emergency' : 'scheduled',
        booking_for: bookingFor.toLowerCase(),
        ambulance_type_id: 3,
        patient_assist: 1,
        customer_name: "Ramkumar",
        customer_mobile: "9876543210",
      };

      if (bookingType === 'Schedule Booking') {
        const scheduledDateTime = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes(),
          selectedTime.getSeconds()
        );
        apiPayload.scheduled_at = scheduledDateTime.toISOString();
      }

      if (!apiPayload.pickup_lat || !apiPayload.pickup_lng) {
        Alert.alert('Location Error', 'Unable to get pickup location coordinates. Please try again.');
        setIsLoadingLocation(false);
        return;
      }

      if (!apiPayload.drop_lat || !apiPayload.drop_lng) {
        Alert.alert('Location Error', 'Unable to get destination location coordinates. Please try again.');
        setIsLoadingLocation(false);
        return;
      }

      setIsLoadingLocation(false);
      await createBookingAPI(apiPayload);
      
    } catch (error) {
      setIsLoadingLocation(false);
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error in handleNext:', error);
    }
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

  // Suggestion Item Component
  const SuggestionItem = ({ item, onPress }) => (
    <TouchableOpacity style={styles.suggestionItem} onPress={onPress}>
      <Icon name="location-on" size={20} color="#666" style={styles.suggestionIcon} />
      <View style={styles.suggestionTextContainer}>
        <Text style={styles.suggestionMainText}>{item.main_text}</Text>
        <Text style={styles.suggestionSecondaryText}>{item.secondary_text}</Text>
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
                    onPress={() => handleBookingForChange(option)}
                    disabled={isLoadingLocation}
                  >
                    <View style={[styles.radio, isSelected && styles.radioSelected]}>
                      {isSelected && <View style={styles.radioInner} />}
                    </View>
                    <Text style={[styles.radioText, isLoadingLocation && styles.disabledText]}>{option}</Text>
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
                <View style={styles.locationInputContainer}>
                  <TextInput
                    placeholder={bookingFor === 'Yourself' ? 'Getting your location...' : 'Enter pickup location'}
                    style={[
                      styles.locationInput, 
                      bookingFor === 'Yourself' && styles.disabledInput,
                      isLoadingLocation && styles.loadingInput
                    ]}
                    placeholderTextColor="#555"
                    value={pickupQuery}
                    onChangeText={handlePickupInputChange}
                    editable={bookingFor === 'Others' && !isLoadingLocation}
                    onFocus={() => {
                      if (bookingFor === 'Others' && pickupQuery.length >= 3) {
                        setShowPickupSuggestions(true);
                      }
                    }}
                  />
                  {bookingFor === 'Yourself' && isLoadingLocation && (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                  )}
                  {bookingFor === 'Yourself' && !isLoadingLocation && (
                    <TouchableOpacity 
                      style={styles.refreshButton}
                      onPress={getCurrentLocation}
                      disabled={isLoadingLocation}
                    >
                      <Icon name="my-location" size={20} color="#7518AA" />
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Pickup Suggestions */}
                {showPickupSuggestions && pickupSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={pickupSuggestions.slice(0, 5)}
                      keyExtractor={(item) => item.place_id}
                      renderItem={({ item }) => (
                        <SuggestionItem 
                          item={item} 
                          onPress={() => handleSuggestionSelect(item, true)} 
                        />
                      )}
                      style={styles.suggestionsList}
                      nestedScrollEnabled
                    />
                  </View>
                )}
                
                <View style={styles.separator} />
                <TextInput
                  placeholder="Enter destination location"
                  style={[styles.locationInput, isLoadingLocation && styles.loadingInput]}
                  placeholderTextColor="#555"
                  value={destinationQuery}
                  onChangeText={handleDestinationInputChange}
                  editable={!isLoadingLocation}
                  onFocus={() => {
                    if (destinationQuery.length >= 3) {
                      setShowDestinationSuggestions(true);
                    }
                  }}
                />
                
                {/* Destination Suggestions */}
                {showDestinationSuggestions && destinationSuggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <FlatList
                      data={destinationSuggestions.slice(0, 5)}
                      keyExtractor={(item) => item.place_id}
                      renderItem={({ item }) => (
                        <SuggestionItem 
                          item={item} 
                          onPress={() => handleSuggestionSelect(item, false)} 
                        />
                      )}
                      style={styles.suggestionsList}
                      nestedScrollEnabled
                    />
                  </View>
                )}
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
                  onPress={() => {
                    setSelectedCategory(item.title);
                    if (item.screen) {
                      navigation.navigate(item.screen);
                    }
                  }}
                  disabled={isLoadingLocation}
                >
                  <Image source={item.image} style={styles.cardImage} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
              {services.length % 3 === 2 && <View style={styles.card} />}
            </View>
          </View>

          {/* Next Button */}
          <TouchableOpacity 
            style={[styles.nextButton, isLoadingLocation && styles.nextButtonDisabled]} 
            onPress={handleNext}
            disabled={isLoadingLocation}
          >
            <Text style={{ color: '#fff', fontSize: Fonts.size.PageHeading, fontFamily: Fonts.family.regular }}>
              {isLoadingLocation ? 'Loading...' : 'Next'}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Schedule Booking Modal */}
        <Modal
          isVisible={isScheduleModalVisible}
          style={styles.bottomModal}
          onBackdropPress={toggleScheduleModal}
          swipeDirection={['down']}
          onSwipeComplete={toggleScheduleModal}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Booking</Text>
              <TouchableOpacity onPress={toggleScheduleModal}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Select date and time for your ambulance booking
            </Text>

            <TouchableOpacity
              style={styles.datePickerInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {selectedDate.toDateString()}
              </Text>
              <Icon name="date-range" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timePickerInput}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerText}>
                {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Icon name="access-time" size={24} color="#666" />
            </TouchableOpacity>

            {!isScheduleValid && (
              <Text style={styles.validationMessage}>
                Please select a time at least 3 hours from now
              </Text>
            )}

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, after3HoursChecked && styles.checkboxChecked]}
                onPress={() => setAfter3HoursChecked(!after3HoursChecked)}
              >
                {after3HoursChecked && <Icon name="check" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxText}>
                Selected time is at least 3 hours from now
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.modalSubmitButton,
                !isScheduleValid && styles.modalSubmitButtonDisabled
              ]}
              onPress={handleScheduleSubmit}
              disabled={!isScheduleValid}
            >
              <Text style={styles.modalSubmitButtonText}>Confirm Schedule</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Date Picker */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={getMinimumDate()}
          />
        )}

        {/* Time Picker */}
        {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={onTimeChange}
          />
        )}
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
  disabledText: {
    color: '#999',
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
    minHeight: hp('15%'),
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
  verticalLine: {
    height: 40,
    borderLeftWidth: 1,
    borderStyle: 'dotted',
    borderColor: '#999',
    marginVertical: 6,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  locationInput: {
    fontSize: Fonts.size.PageSubheading,
    color: '#000',
    paddingVertical: 4,
    height: 40,
    flex: 1,
    paddingRight: 40,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#666',
  },
  loadingInput: {
    backgroundColor: '#f0f0f0',
    color: '#666',
  },
  loadingContainer: {
    position: 'absolute',
    right: 5,
    top: 10,
  },
  loadingText: {
    fontSize: 10,
    color: '#7518AA',
    fontStyle: 'italic',
  },
  refreshButton: {
    position: 'absolute',
    right: 5,
    top: 10,
    padding: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 6,
  },
  // New styles for autocomplete suggestions
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    maxHeight: 200,
    marginTop: 5,
  },
  suggestionsList: {
    borderRadius: 8,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  suggestionSecondaryText: {
    fontSize: 12,
    color: '#666',
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
  nextButtonDisabled: {
    backgroundColor: '#cccccc',
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