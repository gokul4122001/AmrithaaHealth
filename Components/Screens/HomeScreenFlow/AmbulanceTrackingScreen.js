import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const AmbulanceTrackingScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [ambulancePosition, setAmbulancePosition] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
  });

  const [driverInfo] = useState({
    name: 'Dinesh Kumar',
    id: 'TN03MA2658',
    rating: 4.3,
    phone: '+91 9876543210',
  });

  const [bookingInfo] = useState({
    pickup: 'NO 3/1, 1 Street west mambalam chennai -33',
    drop: 'NO 3/1, 1 Street vyasarpadi chennai -33',
    otp: '4154',
    bookingTime: '09:30 PM',
  });

  // Dummy route coordinates
  const routeCoordinates = [
    { latitude: 13.0827, longitude: 80.2707 },
    { latitude: 13.0830, longitude: 80.2710 },
    { latitude: 13.0835, longitude: 80.2715 },
    { latitude: 13.0840, longitude: 80.2720 },
    { latitude: 13.0845, longitude: 80.2725 },
  ];

  const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
  const [animatedValue] = useState(new Animated.Value(0));

  // Dummy tracking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentRouteIndex < routeCoordinates.length - 1) {
        const nextIndex = currentRouteIndex + 1;
        setCurrentRouteIndex(nextIndex);
        setAmbulancePosition(routeCoordinates[nextIndex]);
        
        // Animate ambulance movement
        Animated.timing(animatedValue, {
          toValue: nextIndex,
          duration: 2000,
          useNativeDriver: false,
        }).start();
      } else {
        // Reset to start for continuous loop
        setCurrentRouteIndex(0);
        setAmbulancePosition(routeCoordinates[0]);
        animatedValue.setValue(0);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentRouteIndex]);

  const handleCallDriver = () => {
    console.log('Calling driver...');
    // Implement call functionality
  };

  const handleChangeLocation = () => {
    console.log('Change location pressed');
    // Implement location change functionality
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#8B5CF6" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ambulance Tracking</Text>
      </View>

      {/* Map View */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          showsMyLocationButton={false}
        >
          {/* Route Polyline */}
          <Polyline
            coordinates={routeCoordinates}
            strokeColor="#8B5CF6"
            strokeWidth={4}
            lineDashPattern={[5, 5]}
          />
          
          {/* Pickup Marker */}
          <Marker coordinate={routeCoordinates[0]} title="Pickup Location">
            <View style={styles.pickupMarker}>
              <Icon name="location-on" size={20} color="#fff" />
            </View>
          </Marker>
          
          {/* Drop Marker */}
          <Marker 
            coordinate={routeCoordinates[routeCoordinates.length - 1]} 
            title="Drop Location"
          >
            <View style={styles.dropMarker}>
              <Icon name="location-on" size={20} color="#fff" />
            </View>
          </Marker>
          
          {/* Ambulance Marker */}
          <Marker coordinate={ambulancePosition} title="Ambulance">
            <View style={styles.ambulanceMarker}>
              <Text style={styles.ambulanceIcon}>🚑</Text>
            </View>
          </Marker>
        </MapView>
        
        {/* OTP Display */}
        <View style={styles.otpContainer}>
          <Text style={styles.otpLabel}>OTP :</Text>
          <Text style={styles.otpValue}>{bookingInfo.otp}</Text>
        </View>
      </View>

      {/* Driver Info Card */}
      <View style={styles.driverCard}>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: 'https://via.placeholder.com/50' }}
            style={styles.driverImage}
          />
          <View style={styles.driverDetails}>
            <View style={styles.driverNameRow}>
              <Text style={styles.driverName}>{driverInfo.name}</Text>
              <View style={styles.ratingContainer}>
                <Icon name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{driverInfo.rating}</Text>
              </View>
            </View>
            <Text style={styles.driverId}>{driverInfo.id}</Text>
          </View>
          <TouchableOpacity style={styles.callButton} onPress={handleCallDriver}>
            <Icon name="phone" size={20} color="#8B5CF6" />
            <Text style={styles.callButtonText}>Call Driver</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Location Details */}
      <View style={styles.locationCard}>
        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>Pickup</Text>
          <View style={styles.locationRow}>
            <Icon name="radio-button-checked" size={16} color="#FF6B6B" />
            <Text style={styles.locationAddress}>{bookingInfo.pickup}</Text>
          </View>
        </View>
        
        <View style={styles.locationItem}>
          <Text style={styles.locationLabel}>Drop</Text>
          <View style={styles.locationRow}>
            <Icon name="radio-button-checked" size={16} color="#FF6B6B" />
            <Text style={styles.locationAddress}>{bookingInfo.drop}</Text>
          </View>
        </View>
      </View>

      {/* Booking Time */}
      <View style={styles.bookingTimeCard}>
        <Text style={styles.bookingTimeLabel}>Booking Date & Time</Text>
        <Text style={styles.bookingTimeValue}>{bookingInfo.bookingTime}</Text>
      </View>

      {/* Change Location Button */}
      <TouchableOpacity style={styles.changeLocationButton} onPress={handleChangeLocation}>
        <Text style={styles.changeLocationText}>Change Location</Text>
      </TouchableOpacity>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home" size={24} color="#8B5CF6" />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="apps" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="bookmark" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="notifications" size={24} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="person" size={24} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  mapContainer: {
    height: height * 0.35,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  pickupMarker: {
    backgroundColor: '#FF6B6B',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  dropMarker: {
    backgroundColor: '#4ECDC4',
    borderRadius: 20,
    padding: 5,
    borderWidth: 2,
    borderColor: '#fff',
  },
  ambulanceMarker: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ambulanceIcon: {
    fontSize: 20,
  },
  otpContainer: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  otpLabel: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  otpValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  driverCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  driverId: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButtonText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  locationItem: {
    marginBottom: 15,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationAddress: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  bookingTimeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  bookingTimeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  bookingTimeValue: {
    fontSize: 13,
    color: '#666',
  },
  changeLocationButton: {
    backgroundColor: '#8B5CF6',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  changeLocationText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 10,
    color: '#8B5CF6',
    marginTop: 2,
  },
});

export default AmbulanceTrackingScreen;