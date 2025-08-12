import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import logo from '../../Assets/logos.png';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import CustomHeader from '../../../Header';

const RideBookingScreen = ({ navigation, route }) => {
  const {
    pickupCoords,
    dropCoords,
    pickupLocation,
    destinationLocation,
    booking_type,
    booking_for,
    ambulance_type_id,
    patient_assist,
    customer_name,
    customer_mobile,
    scheduled_at,
    selectedDate,
    selectedTime,
    bookingId,
    bookingResponse,
    goToTracking,
  } = route.params || {};

  const [pickup, setPickup] = useState(pickupLocation || '');
  const [destination, setDestination] = useState(destinationLocation || '');
  const [mapRegion, setMapRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const GOOGLE_MAPS_APIKEY = 'AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E';

  useEffect(() => {
    if (pickupCoords) {
      setMapRegion({
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    }

    if (!pickupCoords || !dropCoords) {
      setShowConfirmButton(true);
    }
  }, [pickupLocation, destinationLocation, pickupCoords]);

  // 🔁 Navigate to next screen if flag is set
  useEffect(() => {
    if (goToTracking) {
      const timeout = setTimeout(() => {
        navigation.navigate('TrackingDetailsScreen', {
          pickupCoords,
          dropCoords,
          pickupLocation,
          destinationLocation,
          booking_type,
          booking_for,
        });
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [goToTracking]);

  const handleConfirmLocation = () => {
    if (!pickup.trim() || !destination.trim()) {
      Alert.alert('Error', 'Please enter both pickup and destination');
      return;
    }

    if (!pickupCoords || !dropCoords) {
      Alert.alert('Error', 'Location coordinates are missing');
      return;
    }

    navigation.navigate('AmbulanceSelectionScreen', {
      pickup,
      destination,
      pickupCoords,
      dropCoords,
      pickupLocation,
      destinationLocation,
      booking_type,
      booking_for,
    });
  };
    
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.topBackground}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <CustomHeader
            username="Jeswanth Kumar"
            onNotificationPress={() => console.log('Notification Pressed')}
            onWalletPress={() => console.log('Alarm Pressed')}
          />

          <View style={styles.cardContainer}>
            <View style={styles.dotsContainer}>
              <View style={styles.dotRow}>
                <LottieView
                  source={require('../../Assets/lottie/greendot.json')}
                  autoPlay
                  loop
                  style={styles.lottieDot}
                />
              </View>
              <View style={styles.verticalLine}>
                <View style={styles.dashedLine} />
                <MaterialCommunityIcons
                  name="arrow-down-bold"
                  size={18}
                  color="#888"
                />
              </View>
              <View style={styles.dotRow}>
                <LottieView
                  source={require('../../Assets/lottie/reddot.json')}
                  autoPlay
                  loop
                  style={styles.lottieDot}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputText}
                value={pickup}
                onChangeText={setPickup}
                placeholder="Enter pickup location"
                placeholderTextColor="#888"
              />
              <View style={styles.separator} />
              <TextInput
                style={styles.inputText}
                value={destination}
                onChangeText={setDestination}
                placeholder="Enter destination"
                placeholderTextColor="#888"
              />
            </View>
          </View>

          <View style={styles.mapWrapper}>
            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={mapRegion}
              showsUserLocation={true}
              showsMyLocationButton={true}
              zoomEnabled={true}
              scrollEnabled={true}
            >
              {pickupCoords && (
                <Marker
                  coordinate={pickupCoords}
                  title="Pickup Location"
                  description={pickup}
                  pinColor="green"
                  identifier="pickup"
                />
              )}
              {dropCoords && (
                <Marker
                  coordinate={dropCoords}
                  title="Destination"
                  description={destination}
                  pinColor="red"
                  identifier="destination"
                />
              )}
              {pickupCoords && dropCoords && (
                <MapViewDirections
                  origin={pickupCoords}
                  destination={dropCoords}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeColor="#8B5CF6"
                  strokeWidth={5}
                  optimizeWaypoints={true}
                  onReady={result => {
                    setMapRegion({
                      latitude:
                        (pickupCoords.latitude + dropCoords.latitude) / 2,
                      longitude:
                        (pickupCoords.longitude + dropCoords.longitude) / 2,
                      latitudeDelta:
                        Math.abs(pickupCoords.latitude - dropCoords.latitude) *
                        1.5,
                      longitudeDelta:
                        Math.abs(
                          pickupCoords.longitude - dropCoords.longitude,
                        ) * 1.5,
                    });
                    setShowConfirmButton(true);
                  }}
                />
              )}
            </MapView>
          </View>

          {showConfirmButton && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmLocation}
            >
              <Text style={styles.confirmButtonText}>Confirm Location</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBackground: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    paddingBottom: 50,
  },
  cardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: '100%',
    marginBottom: 40,
    top: 20,
  },
  dotsContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dotRow: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalLine: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  dashedLine: {
    width: 1,
    height: 20,
    borderLeftWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#999',
    marginBottom: 4,
  },
  lottieDot: {
    width: 30,
    height: 30,
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginLeft: 10,
  },
  inputText: {
    fontSize: Fonts.size.PageSubheading,
    color: '#000',
    fontWeight: '500',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 6,
  },
  mapWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  map: {
    width: '100%',
    height: hp('50%'),
  },
  confirmButton: {
    backgroundColor: Colors.statusBar,
    marginHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    position: 'absolute',
    bottom: '0.2%',
    width: '100%',
    height: hp('6%'),
    alignSelf: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: Fonts.size.PageSubheading,
    fontWeight: 'bold',
    fontFamily: Fonts.family.regular,
  },
});

export default RideBookingScreen;
