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
  LayoutAnimation,
  Platform,
  UIManager,
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

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AmbulanceSelectionScreen = ({ navigation, route }) => {
  const {
    pickup,
    destination,
    pickupCoords,
    dropCoords,
    booking_type,
    booking_for,
  } = route?.params || {};

  const [data, setData] = useState([]);
  const { token } = useSelector(state => state.auth);
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [processedData, setProcessedData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  const [mapRegion, setMapRegion] = useState({
    latitude: 13.0827,
    longitude: 80.2707,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const GOOGLE_MAPS_APIKEY = 'AIzaSyBcdlNrQoO3pvPrrlS_uebDkU81sY0qj3E';

  const processApiData = apiData => {
    const processed = [];
    apiData.forEach(item => {
      if (item.id && item.ambulance_type) {
        processed.push({
          type: 'single',
          title: item.ambulance_type,
          data: [item],
        });
      } else {
        Object.keys(item).forEach(key => {
          if (Array.isArray(item[key]) && item[key].length > 0) {
            processed.push({
              type: 'group',
              title: key,
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
      setData(res.data);
      const processed = processApiData(res.data);
      setProcessedData(processed);

      const initialState = {};
      processed.forEach(cat => {
        if (cat.type === 'group') {
          initialState[cat.title] = true;
        }
      });
      setExpandedCategories(initialState);
    } catch (error) {
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

  const toggleCategory = title => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedCategories(prev => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const renderAmbulanceOption = (option, category) => {
    const isSelected = selectedAmbulance?.id === option.id;
    return (
      <TouchableOpacity
        key={option.id}
        style={[styles.card, isSelected && styles.selectedCard]}
        onPress={() => selectAmbulance(option, category)}
        activeOpacity={0.8}
      >
        <View style={styles.badge}>
          <Text style={styles.badgeCount}>{option.available_driver_count}</Text>
         
        </View>
        <View>
        <Image
          source={option.icon ? { uri: option.icon } : require('../../Assets/ambualnce.png')}
          style={styles.icon}
        />
         <Text style={styles.badgeTime}>{option.average_arrival_minutes} mins</Text>
         </View>
        <View style={{ flex: 1, marginHorizontal: 10 }}>
          <Text style={styles.type}>{option.ambulance_type}</Text>
          {option.details ? (
            <Text style={styles.details} numberOfLines={1}>
              {option.details}
            </Text>
          ) : null}
          {option.ambulance_include?.length > 0 && (
            <Text style={styles.includes} numberOfLines={2}>
              Includes: {option.ambulance_include.map(i => i.ambulance_include).join(', ')}
            </Text>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.price}>₹ {option.total_fare}</Text>
        </View>
      </TouchableOpacity>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          <CustomHeader
            username="Jeswanth Kumar"
            onNotificationPress={() => {}}
            onWalletPress={() => {}}
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
                <Text style={styles.locationText}>{pickup}</Text>
              </View>
              <View style={styles.locationRow}>
                <LottieView
                  source={require('../../Assets/lottie/reddot.json')}
                  autoPlay
                  loop
                  style={styles.dotAnimation}
                />
                <Text style={styles.locationText}>{destination}</Text>
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
              >
                {pickupCoords && (
                  <Marker coordinate={pickupCoords} pinColor="green" />
                )}
                {dropCoords && (
                  <Marker coordinate={dropCoords} pinColor="red" />
                )}
                <MapViewDirections
                  origin={pickupCoords}
                  destination={dropCoords}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeColor="#8B5CF6"
                  strokeWidth={4}
                />
              </MapView>
            </View>
          )}

          <View style={styles.ambulanceContainer}>
            {/* Back icon with title */}
            <View style={styles.ambulanceHeaderRow}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIconWrapper}>
                <MaterialIcons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.selectTitle}>Select the Ambulance</Text>
            </View>

            <ScrollView nestedScrollEnabled>
              {processedData.map((item, idx) => {
                if (item.type === 'group') {
                  const isOpen = expandedCategories[item.title];
                  return (
                   <View key={idx} style={styles.categoryWrapper}>
  <View style={styles.categoryHeader}>
    <Image
      source={require('../../Assets/ambualnce.png')}
      style={styles.categoryImage}
    />
    <Text style={styles.categoryTitle}>{item.title}</Text>

    {/* Arrow icon with click handler */}
    <TouchableOpacity
      style={styles.categoryIcon}
      onPress={() => toggleCategory(item.title)}
    >
      <MaterialIcons
        name={isOpen ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
        size={28}
        color="#333"
      />
    </TouchableOpacity>
  </View>

  {isOpen &&
    item.data.map(option =>
      renderAmbulanceOption(option, item.title)
    )}
</View>

                  );
                } else {
                  return renderAmbulanceOption(item.data[0], item.title);
                }
              })}

              {selectedAmbulance && (
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={handleBookAmbulance}
                >
                  <Text style={styles.bookText}>
                    Book Ambulance ₹{selectedAmbulance.total_fare}
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBackground: { paddingTop: hp('4%'), paddingBottom: hp('2%'), paddingHorizontal: wp('2%'), height: hp('100%'), },
  locationCard: { backgroundColor: '#fff', margin: 10, borderRadius: 12, padding: 16, elevation: 3 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  locationText: { fontSize: 14, color: '#333', flex: 1, fontWeight: '500' },
  dotAnimation: { width: 24, height: 24, marginRight: 12 },
  mapWrapper: { margin: 10, borderRadius: 12, overflow: 'hidden', elevation: 4 },
  map: { width: '100%', height: hp('20%') },

  ambulanceContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  ambulanceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  backIconWrapper: {
    marginRight: 8,
    padding: 4,
  },
  selectTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },

 categoryWrapper: {
  backgroundColor: '#fff',
  marginHorizontal: 12,
  marginTop: 14,
  borderRadius: 12,
  overflow: 'hidden',
  elevation: 5, // Android shadow
  shadowColor: '#000', // iOS shadow
  shadowOpacity: 0.1,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },
  width: wp('95%'),
  alignSelf: 'center',
  paddingBottom: 10, // space below options
},

categoryHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 12,
  backgroundColor: '#f9f9f9',
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
},

categoryImage: {
  width: 40,
  height: 40,
  marginRight: 10,
  borderRadius: 8,
},

categoryTitle: {
  flex: 1,
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
},

categoryIcon: {
  padding: 4,
},

  categoryImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 8,
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 10,
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
    elevation: 2,
  },
  selectedCard: { borderWidth: 2, borderColor: Colors.statusBar },
  badge: { alignItems: 'center', marginRight: 10 },
  badgeCount: { backgroundColor: "#AC57E8", color: '#fff', paddingHorizontal: 8, borderRadius: 4, fontWeight: 'bold',paddingVertical:8 },
  badgeTime: { fontSize: 10, color: '#AC57E8', marginTop: 2 },
  icon: { width: 40, height: 40, resizeMode: 'contain' },
  type: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  details: { fontSize: 12, color: '#555', marginTop: 2 },
  includes: { fontSize: 11, color: '#777', marginTop: 4 },
  price: { fontSize: 16, fontWeight: 'bold', color: Colors.statusBar },
  bookButton: { backgroundColor: Colors.statusBar, margin: 15, borderRadius: 8, paddingVertical: 15, alignItems: 'center' },
  bookText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default AmbulanceSelectionScreen;
