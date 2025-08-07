import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,Image
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

const AmbulanceSelectionScreen = ({ navigation, route }) => {
  const { pickup, destination, pickupCoords, dropCoords, } = route?.params || {};

  const [expandedDropdown, setExpandedDropdown] = useState(null);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [mapRegion, setMapRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const GOOGLE_MAPS_APIKEY = 'AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E';

  const ambulanceData = {
    patientTransfer: {
      title: 'Patient transfer',
      icon: 'ambulance',
      options: [
        {
          id: 'pt_small',
          ambulance_type: 'Small',
          details: '( ECG only etc. )',
          average_arrival_minutes: '15 mins',
          icon: require('../../Assets/ambualnce.png'),
          total_fare: '₹ 1,500',
          color: '#E8F5E8',
          iconColor: '#4CAF50',
          available_driver_count: 4,
        },
        {
          id: 'pt_large',
          ambulance_type: 'Large',
          details: '( Emerg Transfer, Ambu etc. )',
          average_arrival_minutes: '12 mins',
         icon: require('../../Assets/ambualnce.png'),

          total_fare: '₹ 2,500',
          color: '#E3F2FD',
          iconColor: '#2196F3',
          available_driver_count: 6,
        },
        {   
          id: 'pt_basic',
          ambulance_type: 'Basic life support',
          Includes:
            'Emergency Kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
          average_arrival_minutes: '10 mins',
          total_fare: '₹ 2,000',
        icon: require('../../Assets/ambualnce.png'),

          color: '#F3E5F5',
          iconColor: '#9C27B0',
          available_driver_count: 20,
        },
        {
          id: 'pt_advance',
          ambulance_type: 'Advance life support',
          Includes:
            'Emergency Kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Ventilator support with nursing Support',
          average_arrival_minutes: '8 mins',
          total_fare: '₹ 2,000',
        icon: require('../../Assets/ambualnce.png'),

          color: '#E8F5E8',
          iconColor: '#4CAF50',
          available_driver_count: 20,
        },
      ],
    },
    deadBodyTransfer: {
      title: 'Dead Body Transfer',
      icon: 'car-side',
      options: [
        {
          id: 'db_small',
          ambulance_type: 'Small',
          details: '(Dead- Est.)',
          average_arrival_minutes: '20 mins',
        icon: require('../../Assets/ambualnce.png'),

          total_fare: '₹ 1,500',
          color: '#FAFAFA',
          iconColor: '#757575',
          available_driver_count: 2,
        },
        {
          id: 'db_large',
          ambulance_type: 'Large',
          details: '(Hearse Traveller, SUV)',
          average_arrival_minutes: '25 mins',
          total_fare: '₹ 2,500',
          color: '#FAFAFA',
        icon: require('../../Assets/ambualnce.png'),

          iconColor: '#757575',
          available_driver_count: 4,
        },
      ],
    },
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

    navigation.navigate('BookingConfirmation', {
      pickup,
      destination,
      pickupCoords,
      dropCoords,
      selectedAmbulance,
    });
  };

  const renderAmbulanceOption = (option, category) => {
    const isSelected = selectedAmbulance?.id === option.id;

    return (
      <TouchableOpacity
        key={option.id}
        style={[
          styles.ambulanceOption,
          { backgroundColor: option.color || '#fff' },
          isSelected && styles.selectedOption,
        ]}
        onPress={() => selectAmbulance(option, category)}
        activeOpacity={0.8}
      >
      <View style={styles.ambulanceHeader}>
  <View style={styles.ambulanceIconContainer}>
    <Image
      source={option.icon}
      style={styles.ambulanceImage}
    />
    <View style={styles.countBadge}>
      <Text style={styles.countText}>{option.available_driver_count}</Text>
    </View>
  </View>


          <View style={styles.ambulanceInfo}>
            <Text style={styles.ambulanceType}>{option.ambulance_type}</Text>
            {option.details ? (
              <Text style={styles.ambulanceDescription} numberOfLines={3}>
                {option.details}
              </Text>
            ) : option.Includes ? (
              <Text style={styles.ambulanceDescription} numberOfLines={3}>
                {option.Includes}
              </Text>
            ) : null}

            {option.duration ? (
              <Text style={styles.ambulanceDuration}>{option.average_arrival_minutes}</Text>
            ) : null}
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.ambulancePrice}>{option.total_fare}</Text>
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

  const renderDropdown = (dropdownType, data) => {
    const isExpanded = expandedDropdown === dropdownType;

    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdownHeader}
          onPress={() => toggleDropdown(dropdownType)}
          activeOpacity={0.7}
        >
          <View style={styles.dropdownHeaderContent}>
            <MaterialCommunityIcons
              name={data.icon}
              size={24}
              color={Colors.statusBar}
            />
            <Text style={styles.dropdownTitle}>{data.title}</Text>
          </View>
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.dropdownContent}>
            {data.options.map(option =>
              renderAmbulanceOption(option, dropdownType),
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
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
              <View style={styles.greenDot} />
              <Text style={styles.locationText} numberOfLines={2}>
                {pickup}
              </Text>
            </View>
            <View style={styles.locationRow}>
              <View style={styles.redDot} />
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

          {renderDropdown('patientTransfer', ambulanceData.patientTransfer)}
          {renderDropdown('deadBodyTransfer', ambulanceData.deadBodyTransfer)}

          {selectedAmbulance && (
            <View style={styles.bookButtonWrapper}>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={handleBookAmbulance}
                activeOpacity={0.8}
              >
                <Text style={styles.bookButtonText}>
                  Book Ambulance - {selectedAmbulance.price}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollWrapper: {
    paddingBottom: hp('2%'),
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
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginRight: 12,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F44336',
    marginRight: 12,
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
}

});

export default AmbulanceSelectionScreen;
