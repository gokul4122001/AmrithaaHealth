import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Image,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import CustomHeader from '../../../Header';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import { Select_Ambulance } from '../APICall/HomeScreenApi';
import { useSelector } from 'react-redux';

const AmbulanceSelectionScreen = ({ navigation, route }) => {
  const {
    pickup,
    destination,
    pickupCoords,
    dropCoords,
    pickupLocation,
    destinationLocation,
    booking_type,
    booking_for,
  } = route?.params || {};

  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [data, setData] = useState([]);
  const { token } = useSelector(state => state.auth);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [mapRegion, setMapRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const GOOGLE_MAPS_APIKEY = 'AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E';

  // Function to process API data into the required format
  const processApiData = apiData => {
    const processed = [];

    apiData.forEach(item => {
      // Handle single ambulance object (like Basic Life Support)
      if (item.id && item.ambulance_type) {
        processed.push({
          type: 'single',
          title: item.ambulance_type,
          icon: 'ambulance',
          data: item,
        });
      }
      // Handle grouped ambulances (like Patient Transfer, Dead body Transfer)
      else {
        Object.keys(item).forEach(key => {
          if (Array.isArray(item[key]) && item[key].length > 0) {
            processed.push({
              type: 'group',
              title: key,
              icon: key.toLowerCase().includes('patient')
                ? 'ambulance'
                : 'car-side',
              data: item[key],
            });
          }
        });
      }
    });

    return processed;
  };

  const fetchData = async () => {
    try {
      const res = await Select_Ambulance(
        token,
        pickupCoords,
        dropCoords,
        booking_type,
      );
      console.log(res, 'res');
      setData(res.data);
      const processed = processApiData(res.data);
      setProcessedData(processed);
    } catch (error) {
      console.error('Error fetching ambulance data:', error);
      Alert.alert('Error', 'Failed to load ambulance data');
    }
  };

  useEffect(() => {
    if (pickupCoords && dropCoords) {
      const midLat = (pickupCoords.latitude + dropCoords.latitude) / 2;
      const midLng = (pickupCoords.longitude + dropCoords.longitude) / 2;
      const deltaLat =
        Math.abs(pickupCoords.latitude - dropCoords.latitude) * 1.5;
      const deltaLng =
        Math.abs(pickupCoords.longitude - dropCoords.longitude) * 1.5;

      setMapRegion({
        latitude: midLat,
        longitude: midLng,
        latitudeDelta: Math.max(deltaLat, 0.05),
        longitudeDelta: Math.max(deltaLng, 0.05),
      });
      fetchData();
    }
  }, [pickupCoords, dropCoords]);

  const toggleDropdown = dropdownType => {
    setExpandedDropdown(
      expandedDropdown === dropdownType ? null : dropdownType,
    );
  };

  const selectAmbulance = (ambulance, category) => {
    setSelectedAmbulance({ ...ambulance, category });
  };

  const handleBookAmbulance = () => {
    if (!selectedAmbulance) {
      Alert.alert('Selection Required', 'Please select an ambulance type');
      return;
    }

    navigation.navigate('BookingoverviewScreen', {
      pickup,
      destination,
      pickupCoords,
      dropCoords,
      selectedAmbulance,
      booking_type,
      booking_for,
    });
  };

  const renderAmbulanceOption = (option, category) => {
    const isSelected = selectedAmbulance?.id === option.id;

    // Generate a background color based on the ambulance type
    const getBackgroundColor = type => {
      const colors = {
        small: '#E8F5E8',
        large: '#E3F2FD',
        basic: '#F3E5F5',
        advance: '#FFF3E0',
        default: '#F5F5F5',
      };

      const typeKey = type.toLowerCase();
      for (let key in colors) {
        if (typeKey.includes(key)) {
          return colors[key];
        }
      }
      return colors.default;
    };

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.ambulanceOption,
          { backgroundColor: getBackgroundColor(option.ambulance_type) },
          isSelected && styles.selectedOption,
        ]}
        onPress={() => selectAmbulance(option, category)}
        activeOpacity={0.8}
      >
        <View style={styles.ambulanceHeader}>
          <View style={styles.ambulanceIconContainer}>
            <Image
              source={{ uri: option.icon }}
              style={styles.ambulanceImage}
              defaultSource={require('../../Assets/ambualnce.png')}
            />
            <View style={styles.countBadge}>
              <Text style={styles.countText}>
                {option.available_driver_count}
              </Text>
            </View>
          </View>

          <View style={styles.ambulanceInfo}>
            <Text style={styles.ambulanceType}>{option.ambulance_type}</Text>

            {option.details && (
              <Text style={styles.ambulanceDescription} numberOfLines={2}>
                {option.details}
              </Text>
            )}

            {/* Display ambulance includes if available */}
            {option.ambulance_include &&
              option.ambulance_include.length > 0 && (
                <View style={styles.includesContainer}>
                  <Text style={styles.includesTitle}>Includes:</Text>
                  <Text style={styles.ambulanceDescription} numberOfLines={3}>
                    {option.ambulance_include
                      .map(item => item.ambulance_include)
                      .join(', ')}
                  </Text>
                </View>
              )}

            {option.average_arrival_minutes > 0 && (
              <Text style={styles.ambulanceDuration}>
                Arrival: ~{option.average_arrival_minutes} mins
              </Text>
            )}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.ambulancePrice}>₹{option.total_fare}</Text>
            {option.total_fare_with_patient_assistent > option.total_fare && (
              <Text style={styles.assistantPrice}>
                With Assistant: ₹{option.total_fare_with_patient_assistent}
              </Text>
            )}
            {isSelected && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color={Colors.statusBar}
                style={styles.checkIcon}
              />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDropdown = (item, index) => {
    const isExpanded = expandedDropdown === index;

    return (
      <View key={index} style={styles.dropdownContainer}>
        {item.type === 'group' ? (
          <>
            <TouchableOpacity
              style={styles.dropdownHeader}
              onPress={() => toggleDropdown(index)}
              activeOpacity={0.7}
            >
              <View style={styles.dropdownHeaderContent}>
                <MaterialCommunityIcons
                  name={item.icon}
                  size={24}
                  color={Colors.statusBar}
                />
                <Text style={styles.dropdownTitle}>{item.title}</Text>
              </View>
              <MaterialCommunityIcons
                name={isExpanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.dropdownContent}>
                {item.data.map(option =>
                  renderAmbulanceOption(option, item.title),
                )}
              </View>
            )}
          </>
        ) : (
          // For single ambulance items, show them directly without dropdown
          <View style={styles.singleAmbulanceContainer}>
            <View style={styles.dropdownHeaderContent}>
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={Colors.statusBar}
              />
              <Text style={styles.dropdownTitle}>{item.title}</Text>
            </View>
            <View style={styles.dropdownContent}>
              {renderAmbulanceOption(item.data, item.title)}
            </View>
          </View>
        )}
      </View>
    );
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
          contentContainerStyle={styles.scrollWrapper}
          showsVerticalScrollIndicator={false}
        >
          <CustomHeader
            username="Jeswanth Kumar"
            onNotificationPress={() => console.log('Notification Pressed')}
            onWalletPress={() => console.log('Wallet Pressed')}
          />

          {pickup && destination && (
            <View style={styles.locationCard}>
              <View style={styles.locationRow}>
                <LottieView
                  source={require('../../Assets/lottie/greendot.json')}
                  autoPlay
                  loop
                  style={styles.dotAnimation}
                />
                <Text style={styles.locationText} numberOfLines={2}>
                  {pickup}
                </Text>
              </View>
              <View style={styles.locationRow}>
                <LottieView
                  source={require('../../Assets/lottie/reddot.json')}
                  autoPlay
                  loop
                  style={styles.dotAnimation}
                />
                <Text style={styles.locationText} numberOfLines={2}>
                  {destination}
                </Text>
              </View>
            </View>
          )}

          {pickupCoords && dropCoords && (
            <View style={styles.mapWrapper}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={mapRegion}
                showsUserLocation
                showsMyLocationButton
              >
                {pickupCoords && (
                  <Marker
                    coordinate={pickupCoords}
                    pinColor="green"
                    title="Pickup Location"
                  />
                )}
                {dropCoords && (
                  <Marker
                    coordinate={dropCoords}
                    pinColor="red"
                    title="Destination"
                  />
                )}
                {pickupCoords && dropCoords && (
                  <MapViewDirections
                    origin={pickupCoords}
                    destination={dropCoords}
                    apikey={GOOGLE_MAPS_APIKEY}
                    strokeColor="#8B5CF6"
                    strokeWidth={4}
                    optimizeWaypoints={true}
                  />
                )}
              </MapView>
            </View>
          )}

          <View style={styles.bottomSection}>
            <View style={styles.selectHeader}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color="#333"
                />
              </TouchableOpacity>
              <Text style={styles.selectTitle}>Select the Ambulance</Text>
            </View>

            {/* Render processed data */}
            {processedData.map((item, index) => renderDropdown(item, index))}

            {selectedAmbulance && (
              <View style={styles.bookButtonWrapper}>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={handleBookAmbulance}
                  activeOpacity={0.8}
                >
                  <Text style={styles.bookButtonText}>
                    Book Ambulance ₹{selectedAmbulance.total_fare}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  scrollWrapper: {
    paddingBottom: hp('20%'),
  },
  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('2%'),
    height: hp('100%'),
  },
  locationCard: {
    backgroundColor: '#fff',
    marginHorizontal: wp('5%'),
    marginTop: hp('2%'),
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    fontWeight: '500',
  },
  mapWrapper: {
    marginHorizontal: wp('5%'),
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  map: {
    width: '100%',
    height: hp('30%'),
  },
  bottomSection: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 16,
    elevation: 8,
    paddingTop: hp('2%'),
    paddingHorizontal: wp('5%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  selectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  selectTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  dropdownContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  dropdownHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  dropdownContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  singleAmbulanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    padding: 16,
  },
  ambulanceOption: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    borderWidth: 2,
    borderColor: 'transparent',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  selectedOption: {
    borderColor: Colors.statusBar,
    elevation: 3,
    shadowOpacity: 0.15,
  },
  ambulanceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ambulanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  countBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF4444',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    paddingHorizontal: 6,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  ambulanceInfo: {
    flex: 1,
    marginRight: 12,
  },
  ambulanceType: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  ambulanceDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  includesContainer: {
    marginTop: 6,
  },
  includesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  ambulanceDuration: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
    fontWeight: '500',
  },
  priceContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  ambulancePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.statusBar,
  },
  assistantPrice: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  checkIcon: {
    marginTop: 6,
  },
  bookButtonWrapper: {
    marginTop: hp('3%'),
    marginBottom: hp('3%'),
  },
  bookButton: {
    backgroundColor: Colors.statusBar,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  ambulanceImage: {
    width: 44,
    height: 44,
    resizeMode: 'contain',
  },
  dotAnimation: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
});

export default AmbulanceSelectionScreen;
