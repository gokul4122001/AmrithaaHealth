import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,Image
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from 'react-native-vector-icons/MaterialIcons';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import logo from '../../Assets/logos.png';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const RideBookingScreen = ({ navigation }) => {
  const [pickup, setPickup] = useState('West Mambalam, Chennai-33');
  const [destination, setDestination] = useState('Apollo Hospital, Thousand Lights, Chennai');
  const [userName] = useState('Jeswanth Kumar');

const handleConfirmLocation = () => {
  if (!pickup.trim() || !destination.trim()) {
    Alert.alert('Error', 'Please enter both pickup and destination locations');
    return;
  }

  // Navigate to the next screen (e.g., BookingSuccessScreen)
  navigation.navigate('AmbulanceSelectionScreen', {
    pickup,
    destination,
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
          {/* Header */}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hi, Welcome</Text>
              <Text style={styles.userName}>Jeswanth Kumar</Text>
            </View>
            <TouchableOpacity style={[styles.notificationButton, { right: hp('2%') }]}>
              <Icons name="notifications-on" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'red' }]}>
              <MaterialCommunityIcons name="alarm-light-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>
    <View style={styles.cardContainer}>
  {/* Dots and Arrow */}
  <View style={styles.dotsContainer}>
    <View style={styles.dotRow}>
      <View style={styles.dotGreen} />
    </View>
    <View style={styles.verticalLine}>
      <View style={styles.dashedLine} />
   <MaterialCommunityIcons name="arrow-down-bold" size={18} color="#888" />
    </View>
    <View style={styles.dotRow}>
      <View style={styles.dotRed} />
    </View>
  </View>

  {/* Text Inputs */}
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


      {/* Map Placeholder */}
      <View style={styles.mapContainer}>
        <View style={styles.mapPlaceholder}>
          <Text style={styles.mapText}>Map View</Text>
          <Text style={styles.mapSubText}>Static map without location tracking</Text>
          
          {/* Route visualization */}
          <View style={styles.routeContainer}>
            <View style={styles.routePoint}>
              <View style={styles.startPoint} />
              <Text style={styles.pointLabel}>Start</Text>
            </View>
            <View style={styles.routeLine} />
            <View style={styles.routePoint}>
              <View style={styles.endPoint} />
              <Text style={styles.pointLabel}>End</Text>
            </View>
          </View>
          
          {/* Mock cars around */}
          <View style={styles.carsContainer}>
            <View style={[styles.carIcon, { top: 50, left: 30 }]}>
              <Icon name="car" size={16} color="#7C3AED" />
            </View>
            <View style={[styles.carIcon, { top: 80, right: 40 }]}>
              <Icon name="car" size={16} color="#7C3AED" />
            </View>
            <View style={[styles.carIcon, { bottom: 60, left: 50 }]}>
              <Icon name="car" size={16} color="#7C3AED" />
            </View>
            <View style={[styles.carIcon, { bottom: 40, right: 30 }]}>
              <Icon name="car" size={16} color="#7C3AED" />
            </View>
          </View>
        </View>
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
        <Text style={styles.confirmButtonText}>Confirm Location</Text>
      </TouchableOpacity>
       </LinearGradient>
    </SafeAreaView>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  
  width:'100%'
},

dotsContainer: {
  width: 30,
  alignItems: 'center',
  justifyContent: 'space-between',
},

dotRow: {
  height: 20,
  justifyContent: 'center',
  alignItems: 'center',
},

dotGreen: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#22C55E',
  borderWidth: 2,
  borderColor: '#fff',
},

dotRed: {
  width: 12,
  height: 12,
  borderRadius: 6,
  backgroundColor: '#EF4444',
  borderWidth: 2,
  borderColor: '#fff',
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

inputContainer: {
  flex: 1,
  justifyContent: 'space-between',
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

 
 mapContainer: {
  width: '100%', // full width of the parent
  height: hp('35%'), // or try 250, or adjust as needed
  borderRadius: 12,
  overflow: 'hidden',
  marginTop: 20,
},

mapPlaceholder: {
  flex: 1,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
},

  mapText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 5,
      fontFamily:Fonts.family.regular
  },
  mapSubText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 30,
      fontFamily:Fonts.family.regular
  },
  routeContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  routePoint: {
    alignItems: 'center',
    marginVertical: 10,
  },
  startPoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22C55E',
    marginBottom: 5,
  },
  endPoint: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    marginBottom: 5,
      fontFamily:Fonts.family.regular
  },
  routeLine: {
    width: 2,
    height: 40,
    backgroundColor: '#7C3AED',
    marginVertical: 5,
  },
  pointLabel: {
    fontSize: 12,
    color: '#666',
      fontFamily:Fonts.family.regular
  },
  carsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  carIcon: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  confirmButton: {
    backgroundColor: Colors.statusBar ,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    position:'absolute',
    bottom:'15%',
    width:'90%',
    height:'7%',
left:10
   
  },
  confirmButtonText: {
    color: '#fff',
   fontSize: Fonts.size.PageSubheading,
    fontWeight: 'bold',
      fontFamily:Fonts.family.regular
  },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  greetingContainer: { flex: 1, marginLeft: wp('3%') },
  greeting: { fontSize: Fonts.size.TopHeading, color: 'black', fontFamily: Fonts.family.regular },
  userName: { fontSize: Fonts.size.TopSubheading, fontWeight: 'bold', color: 'black', fontFamily: Fonts.family.regular },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
  },
});

export default RideBookingScreen;