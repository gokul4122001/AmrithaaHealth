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

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import logo from '../../Assets/logos.png';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import CustomHeader from '../../../Header';

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
          
          {/* Custom Header Integration */}
          <CustomHeader
            username="Jeswanth Kumar"
            onNotificationPress={() => console.log('Notification Pressed')}
            onWalletPress={() => console.log('Alarm Pressed')}
          />

          {/* Pickup & Destination Card */}
          <View style={styles.cardContainer}>
            {/* Dots and Arrow */}
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
                <MaterialCommunityIcons name="arrow-down-bold" size={18} color="#888" />
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
    position: 'absolute',
    bottom: '20%',
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
