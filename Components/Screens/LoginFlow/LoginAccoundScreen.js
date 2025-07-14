import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Keyboard,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { countries } from './CountryJson';
import { useNavigation } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import { sendOtp } from '../APICall/LoginApi'; // update path as needed

/* Toast Component with Slide Animation */
const Toast = ({ visible, message, backgroundColor }) => {
  const slideAnim = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2000),
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        { backgroundColor: backgroundColor || 'black', transform: [{ translateY: slideAnim }] },
      ]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
};

const LoginScreen = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation();

  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('#000');

  const showToast = (message, color) => {
    setToastMessage(message);
    setToastColor(color);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };
const handleSendOTP = async () => {
  Keyboard.dismiss();

  if (mobileNumber.length === 0) {
    showToast('Invalid Number', '#FFA500');
    return;
  }

  const isValidNumber = /^[0-9]{10}$/.test(mobileNumber);
  if (!isValidNumber) {
    showToast('Please enter a valid 10-digit number', '#FF4C4C');
    return;
  }

  try {
    console.log('Sending OTP to:', mobileNumber); // ✅ Debug log
    const result = await sendOtp(mobileNumber);

    console.log('OTP response:', result); // ✅ Debug response

    if (result.message === 'OTP sent successfully') {
      showToast('OTP Sent', '#28a745');
      navigation.navigate('Login7', {
        phoneNumber: mobileNumber,
      });
    } else {
      showToast(result.message || 'Failed to send OTP', '#FF4C4C');
    }
  } catch (error) {
    console.error('Send OTP Error:', error);
    showToast('Error sending OTP', '#FF4C4C');
  }
};


  const renderCountryItem = ({ item }) => (
    <TouchableOpacity
      style={styles.countryItem}
      onPress={() => {
        setSelectedCountry(item);
        setShowModal(false);
      }}
    >
      <Image
        source={{ uri: `https://flagcdn.com/w80/${item.code}.png` }}
        style={styles.modalFlag}
        resizeMode="contain"
      />
      <Text style={styles.countryText}>
        {item.name} ({item.dial_code})
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} translucent />

      <SafeAreaView style={styles.container}>
        <Toast visible={toastVisible} message={toastMessage} backgroundColor={toastColor} />

        {/* Logo Section */}
        <View style={styles.logoRow1}>
          <Image source={require('../../Assets/logos.png')} style={styles.logoImage} />
          <View>
            <Text style={styles.logoBrand}>Health</Text>
            <Text style={styles.logoBrand}>Umbrella</Text>
          </View>
        </View>

        {/* Login Content */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Login your <Text style={{ color: '#7518AA' ,fontWeight:'bold'}}>Account</Text>
          </Text>

          <Text style={styles.label}>Enter Mobile Number</Text>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.countryPickerContainer}
              onPress={() => setShowModal(true)}
            >
              <Image
                source={{ uri: `https://flagcdn.com/w80/${selectedCountry.code}.png` }}
                style={styles.flagIcon}
                resizeMode="contain"
              />
              <Icons name="keyboard-arrow-down" size={25} color="#333" style={styles.arrowIcon} />
            </TouchableOpacity>

            <TextInput
              style={styles.mobileInput}
              placeholder="Enter mobile number"
              placeholderTextColor="#999"
              value={mobileNumber}
              onChangeText={(text) => setMobileNumber(text.replace(/\s+/g, ''))}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>
        </View>

        {/* Send OTP Button */}
        
       <View style={styles.bottomButtonContainer}>
  <TouchableOpacity onPress={handleSendOTP} activeOpacity={0.8}>
    <LinearGradient
      colors={['#7518AA', '#370B63']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      style={styles.otpButton}
    >
      <Text style={styles.otpButtonText}>Send OTP</Text>
    </LinearGradient>
  </TouchableOpacity>
</View>

        {/* Modal */}
        <Modal visible={showModal} animationType="slide">
          <SafeAreaView style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Country</Text>
            <FlatList
              data={countries}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderCountryItem}
            />
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, marginTop: 40 },
  title: {
   fontSize:  Fonts.size.FlashScreenHeader,
    fontWeight: 'bold',
    color:Colors.black ,
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  label: {
     fontSize:  Fonts.size.PageHeading,
    color: 'black',
    marginBottom: 15,
    fontWeight: '700',
    fontFamily: Fonts.family.regular,
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    paddingHorizontal: 10,
    minHeight: 70,
    top:10
  },
  countryPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    paddingHorizontal: 5,
  },
  flagIcon: {
    width: 40,
    height: 30,
    borderRadius: 6,
    marginRight: 5,
  },
  arrowIcon: {
    color: 'grey',
  },
  mobileInput: {
    flex: 1,
    fontSize:  Fonts.size.PageSubSubHeading,
    color: '#333',
    paddingVertical: 10,
  },
  bottomButtonContainer: {
  paddingHorizontal: 20,
  paddingBottom: 100,
  backgroundColor: 'transparent',
},
otpButton: {
  paddingVertical: 16,
  borderRadius: 8,
  alignItems: 'center',
  shadowColor: '#7c3aed',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
otpButtonText: {
  color: 'white',
  fontSize: Fonts.size.PageHeading,
  fontWeight: '600',
  fontFamily: Fonts.family.regular,
},

  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    fontFamily: Fonts.family.regular,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  modalFlag: {
    width: 50,
    height: 36,
    marginRight: 15,
    borderRadius: 6,
  },
  countryText: {
    fontSize: 16,
    fontFamily: Fonts.family.regular,
  },
  closeButton: {
    backgroundColor: '#7c3aed',
    padding: 15,
    marginVertical: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: Fonts.family.regular,
  },
  logoRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  logoImage: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  logoBrand: {
   fontSize:  Fonts.size.FlashScreenSubHeading,
    color: Colors.statusBar,
    fontWeight: '700',
    fontFamily: Fonts.family.regular,
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    zIndex: 999,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  toastText: {
    color: '#fff',
  fontSize:  Fonts.size.PageHeading,
    textAlign: 'center',
  },
});

export default LoginScreen;
