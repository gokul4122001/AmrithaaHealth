import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView,
} from 'react-native';

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

  const handleConfirmLocation = () => {
    if (!pickup.trim() || !destination.trim()) {
      Alert.alert('Error', 'Please enter both pickup and destination locations');
      return;
    }

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
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Hi, Welcome</Text>
              <Text style={styles.userName}>Jeswanth Kumar</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Icons name="notifications-on" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'red' }]}>
              <MaterialCommunityIcons name="alarm-light-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Pickup & Destination Card */}
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

          {/* Map Image */}
          <View style={styles.imageWrapper}>
            <Image
              source={require('../../Assets/map.png')}
              style={styles.image}
            />
          </View>

          {/* Confirm Button */}
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
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
    paddingBottom: 30,
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
  greetingContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  greeting: {
    fontSize: Fonts.size.TopHeading,
    color: 'black',
   
  },
  userName: {
    fontSize: Fonts.size.TopSubheading,
    fontWeight: 'bold',
    color: 'black',
  
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
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
    marginBottom: 20,
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
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: hp('70%'),
    resizeMode: 'cover',
    borderRadius: 12,
  },
  confirmButton: {
    backgroundColor: Colors.statusBar,
    marginHorizontal: 10,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    position:'absolute',
    bottom:'20%',
      width: '100%',
    height: hp('7%'),
    alignSelf:'center'
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: Fonts.size.PageSubheading,
    fontWeight: 'bold',
    fontFamily: Fonts.family.regular,
  },
});

export default RideBookingScreen;
