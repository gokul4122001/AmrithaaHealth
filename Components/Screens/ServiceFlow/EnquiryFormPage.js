import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Icons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';

const HospitalForm = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    emailId: '',
    location: '',
    reason: '',
  });

  const handleInputChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.mobileNumber || !formData.emailId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    navigation.navigate('BookingSuccessScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : hp('2%')}
        >
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
                <Text style={styles.userName1}>Janmani Kumar</Text>
              </View>
              <TouchableOpacity
                style={[styles.notificationButton, { right: hp('2%') }]}
              >
                <Icon name="notifications-on" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.notificationButton, { backgroundColor: 'red' }]}
              >
                <MaterialCommunityIcons
                  name="alarm-light-outline"
                  size={24}
                  color="white"
                />
              </TouchableOpacity>
            </View>

            {/* Back Button & Title */}
            <View style={styles.sectionHeader}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icons name="chevron-back" size={24} />
              </TouchableOpacity>
              <Text style={styles.sectionTitle}>Hospital</Text>
            </View>

            {/* Form Scrollable Inputs */}
            <ScrollView
              contentContainerStyle={styles.formContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your Name"
                  value={formData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter mobile number"
                  value={formData.mobileNumber}
                  onChangeText={text =>
                    handleInputChange('mobileNumber', text)
                  }
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email ID</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Email Id"
                  value={formData.emailId}
                  onChangeText={text => handleInputChange('emailId', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter location"
                  value={formData.location}
                  onChangeText={text => handleInputChange('location', text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Enter your reason</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter your reason"
                  value={formData.reason}
                  onChangeText={text => handleInputChange('reason', text)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>

            {/* Submit Button Fixed at Bottom */}
            <View style={styles.submitContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  keyboardContainer: {
    flex: 1,
  },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
   fontSize:  Fonts.size.TopHeading,
    color: 'black',
    opacity: 0.9,
  },
  userName1: {
   fontSize:  Fonts.size.TopSubheading,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: '35%',
    color: '#7416B2',
    top: -5,
  },
  formContainer: {
   formContainer: {
    paddingBottom: 100,
    // Add any other styles you need
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 17,
    fontSize:  Fonts.size.PageSubheading,
    backgroundColor: '#FFFFFF',
    color: 'black',
    width: '100%',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  submitContainer: {
    position: 'absolute',
    bottom: '10%',
    left: 16,
    right: 16,
  },
  submitButton: {
    backgroundColor: '#7518AA',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  submitButtonText: {
    color: '#FFFFFF',
      fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
  },
});

export default HospitalForm;
