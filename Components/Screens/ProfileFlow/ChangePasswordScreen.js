import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  TextInput,
  Alert,ScrollView,
   Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import logo from '../../Assets/logos.png';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const ChangePasswordScreen = ({navigation}) => {
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const handleBack = () => {
    console.log('Back pressed');
    // Add navigation back logic
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const updatePassword = (field, value) => {
    setPasswords(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validatePasswords = () => {
    if (!passwords.currentPassword.trim()) {
      Alert.alert('Error', 'Please enter your current password');
      return false;
    }
    if (!passwords.newPassword.trim()) {
      Alert.alert('Error', 'Please enter a new password');
      return false;
    }
    if (passwords.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match');
      return false;
    }
    return true;
  };

  const handleApplyChanges = () => {
    if (validatePasswords()) {
      console.log('Password change request:', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      Alert.alert(
        'Success',
        'Password changed successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate back or to login screen
              console.log('Password changed successfully');
            },
          },
        ],
      );
    }
  };

  const renderPasswordField = (
    label,
    value,
    onChangeText,
    fieldKey,
    isRequired = true,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>
        {label} {isRequired && <Text style={styles.required}>*</Text>}
      </Text>
      <Text style={styles.fieldDescription}>
        {fieldKey === 'currentPassword'
          ? ''
          : ''}
      </Text>
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!showPasswords[fieldKey]}
          placeholder="••••••••••••"
          placeholderTextColor="#C1C7CD"
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => togglePasswordVisibility(fieldKey)}>
          <Icon
            name={showPasswords[fieldKey] ? 'visibility' : 'visibility-off'}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
 <LinearGradient
             colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
           style={styles.topBackground}
         >

            <View style={styles.header}>
                       <Image source={logo} style={styles.logo} />
                       <View style={styles.greetingContainer}>
                         <Text style={styles.greeting}>Hi, Welcome</Text>
                         <Text style={styles.userName}>Janmani Kumar</Text>
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

                       <View style={styles.headered}>
                             <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                               <Icon name="arrow-back" size={24} color="#000000" />
                             </TouchableOpacity>
                             <Text style={{fontSize:  Fonts.size.PageHeading,fontWeight:'700', fontFamily:Fonts.family.regular}}>Change Password</Text>
                            
                           </View>
    

      {/* Content */}
      <View style={styles.content}>
        {/* Change Password Card */}
        <View style={styles.passwordCard}>
          <View style={styles.cardHeader}>
            <Icon name="lock" size={24} color="grey" style={{borderWidth:1,borderRadius:30,padding:5,borderColor:'grey'}} />
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Change Password</Text>
              <Text style={styles.cardSubtitle}>
                Update Password for enhanced account security.
              </Text>
            </View>
          </View>

 
          {/* Password Fields */}
          <View style={styles.formContainer}>
            {renderPasswordField(
              'Current Password',
              passwords.currentPassword,
              text => updatePassword('currentPassword', text),
              'currentPassword',
            )}

            {renderPasswordField(
              'New Password',
              passwords.newPassword,
              text => updatePassword('newPassword', text),
              'newPassword',
            )}

            {renderPasswordField(
              'Confirm New Password',
              passwords.confirmPassword,
              text => updatePassword('confirmPassword', text),
              'confirmPassword',
            )}
          </View>
        
        </View>

        {/* Apply Changes Button */}
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyChanges}>
          <Text style={styles.applyButtonText}>Apply Changes</Text>
        </TouchableOpacity>
      </View>


       </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '400',
  },
  welcomeName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  titleSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pageTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
   
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  cardHeaderText: {
    marginLeft: 12,
    flex: 1,
   
  },
  cardTitle: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
     fontFamily:Fonts.family.regular
  },
  cardSubtitle: {
 fontSize:  Fonts.size.PageSubheading,
    color: '#6B7280',
    lineHeight: 16,
     fontFamily:Fonts.family.regular
  },
  formContainer: {
    marginTop: 8,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#0C0B0B',
    marginBottom: 4,
     fontFamily:Fonts.family.regular
  },
  required: {
    color: '#EF4444',
  },
  fieldDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 16,
     fontFamily:Fonts.family.regular
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
    height:60,
   
  },
  eyeButton: {
    padding: 12,
  },
  applyButton: {
    backgroundColor: '#7518AA',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: '10%',
    marginBottom: 20,
  },
  applyButtonText: {
    color: '#FFFFFF',
  fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
     fontFamily:Fonts.family.regular
  },
   topBackground: {
      paddingTop: hp('4%'),
      paddingBottom: hp('2%'),
      paddingHorizontal: wp('4%'),
      height: hp('100%'),
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
     fontFamily:Fonts.family.regular
  },
  userName: {
    fontSize:  Fonts.size.TopSubheading,
    fontWeight: 'bold',
    color: 'black',
     fontFamily:Fonts.family.regular
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
     headered: {
 
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:10,
  marginLeft:-10
  
    
  },
});

export default ChangePasswordScreen;