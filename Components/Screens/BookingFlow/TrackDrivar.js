import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Colors from '../../Colors/Colors';
import {  
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
const { width, height } = Dimensions.get('window');
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Fonts/Fonts';

const AmbulanceTrackingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { ambulanceType, price } = route.params || {};

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />

      {/* Map Section */}
      <View style={styles.mapContainer}>
        <View style={styles.mapView}>
          <View style={styles.mapBackground}>
            <Image
              source={require('../../Assets/map.png')}
              style={styles.mapImage}
              resizeMode="cover"
            />
            
            {/* Route line and markers would be overlaid here */}
            <View style={styles.routeOverlay}>
              {/* Pickup marker */}
              <View style={[styles.marker, { top: '25%', left: '20%' }]}>
                <View style={styles.pickupMarker}>
                  <MaterialIcons name="location-pin" size={24} color="#FF0000" />
                </View>
              </View>
              
              {/* Drop marker */}
              <View style={[styles.marker, { top: '70%', right: '15%' }]}>
                <View style={styles.dropMarker}>
                  <MaterialIcons name="location-pin" size={24} color="#FF0000" />
                </View>
              </View>
              
              {/* Ambulance icon */}
              <View style={[styles.marker, { top: '40%', left: '25%' }]}>
                <View style={styles.ambulanceMarker}>
                  <Text style={styles.ambulanceIcon}>🚑</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Bottom Sheet - Fixed Position */}
      <View style={styles.bottomSheet}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ambulance Tracking</Text>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={() => navigation.navigate('SwpingPayments')} 
          >
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.sheetContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Driver Card */}
          <View style={styles.driverCard}>
            <Image
              source={{
                uri: 'https://randomuser.me/api/portraits/men/41.jpg',
              }}
              style={styles.driverImage}
            />

            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Selva Kumar</Text>
              <Text style={styles.driverId}>ID no : AK0215</Text>
            </View>

            <TouchableOpacity style={styles.callButton}>
              <MaterialIcons name="phone" size={20} color="#ffffff" style={{borderWidth:1,padding:5,borderRadius:20,backgroundColor:'#8B5CF6',borderColor:'#8B5CF6'}} />
              <Text style={styles.callButtonText}>Call Captain</Text>
            </TouchableOpacity>
          </View>

          {/* Location Details */}
          <View style={styles.locationSection}>
            {/* Pickup */}
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Pickup</Text>
           <View style={styles.locationRow}>
  <MaterialIcons name="location-on" size={18} color="#FF0000" />
  <Text style={styles.locationText}>
    NO 3/1, 1 Street west mambalam chennai -33
  </Text>
</View>

            </View>

            {/* Drop */}
            <View style={styles.locationItem}>
              <Text style={styles.locationLabel}>Drop</Text>
              <View style={styles.locationRow}>
               <MaterialIcons name="location-on" size={18} color="#FF0000" />
                <Text style={styles.locationText}>NO 3/1, 1 Street vyasarpadi chennai -33</Text>
              </View>
            </View>
          </View>

 
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  mapContainer: { 
    flex: 1, 
    backgroundColor: '#8B5CF6' 
  },
  mapView: { 
    flex: 1 
  },
  mapBackground: { 
    flex: 1, 
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  routeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marker: {
    position: 'absolute',
  },
  pickupMarker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  dropMarker: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 3,
  },
  ambulanceMarker: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    elevation: 3,
  },
  ambulanceIcon: {
    fontSize: 20,
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: height * 0.4,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 12,
  },
  viewDetailsButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth:1,
    borderColor:'#7518AA'
  },
  viewDetailsText: {
    color: '#4D2161',
    fontSize: 12,
    fontWeight: '600',
  },
  sheetContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  driverCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  driverImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  driverId: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
  
    alignItems: 'center',
  
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  callButtonText: {
    color: '#8B5CF6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
    top:5
  },
  locationSection: {
    paddingVertical: 16,
  },
  locationItem: {
    marginBottom: 16,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
  expandedContent: {
    paddingBottom: 100,
  },
 
 

});

export default AmbulanceTrackingScreen;