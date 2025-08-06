// screens/ProfileFormScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import { MAX_IMAGE_SIZE, ALLOWED_IMAGE_TYPES, IMAGE_URL } from '../Config';
import { updateUserProfile } from '../APICall/ProfileApi';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import { useDispatch, useSelector } from 'react-redux';

const ProfileFormScreen = ({ navigation, route }) => {
  const authToken = useSelector(state => state?.auth?.token);
  const { profileData: initialData } = route.params || {};
  const addperson = route?.params?.addperson || false;
  
  const [profileData, setProfileData] = useState({
    name: '',
    dob: '',
    email: '',
    mobileNumber: '',
    age: '',
    gender: 'Select Gender',
    profile_photo: null,
    familyDetails: [],
  });

  const [includeFamilyMembers, setIncludeFamilyMembers] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [activeDatePickerFor, setActiveDatePickerFor] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData) {
      console.log(initialData, 'initialData');
      setProfileData({
        ...initialData,
        age: initialData?.age?.toString(),
        mobileNumber: initialData?.mobile,
        profile_photo: initialData?.profile_photo || null,
        gender: initialData?.gender || 'Select Gender',
        // Keep existing family details if they exist
        familyDetails: initialData?.familyDetails || [],
      });
      
      // If there are existing family members or if addperson is true, show family section
      if (initialData?.familyDetails?.length > 0 || addperson) {
        setIncludeFamilyMembers(true);
      }
    }
  }, [initialData, addperson]);

  // Helper functions
  const updateProfileData = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...profileData.familyDetails];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    setProfileData(prev => ({ ...prev, familyDetails: updatedMembers }));
  };

  const addFamilyMember = () => {
    setProfileData(prev => ({
      ...prev,
      familyDetails: [
        ...prev.familyDetails,
        {
          name: '',
          dob: '',
          email: '',
          mobile: '',
          age: '',
          gender: 'Select Gender',
        },
      ],
    }));
  };

  const removeFamilyMember = (index) => {
    setProfileData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (addperson) {
      setIncludeFamilyMembers(true);
      // Only add a new family member if we don't already have empty ones
      const hasEmptyMember = profileData.familyDetails.some(member => 
        !member.name && !member.email && !member.mobile
      );
      if (!hasEmptyMember) {
        addFamilyMember();
      }
    }
  }, [addperson]);

  const selectImage = async () => {
    if (isSubmitting) return;

    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 2000,
        maxHeight: 2000,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        throw new Error(result.errorMessage || 'Image selection failed');
      }

      const selectedImage = result.assets?.[0];
      if (!selectedImage) return;

      if (selectedImage.fileSize > MAX_IMAGE_SIZE) {
        throw new Error('Image size should be less than 2MB');
      }

      if (!ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
        throw new Error('Only JPEG and PNG images are allowed');
      }

      updateProfileData('profile_photo', selectedImage.uri);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (!selectedDate) return;

    const formattedDate = selectedDate.toISOString().split('T')[0];

    if (activeDatePickerFor === 'profile') {
      updateProfileData('dob', formattedDate);
    } else if (typeof activeDatePickerFor === 'number') {
      updateFamilyMember(activeDatePickerFor, 'dob', formattedDate);
    }
  };

  const showGenderPicker = (isProfile = true, memberIndex = 0) => {
    Alert.alert('Select Gender', '', [
      {
        text: 'Male',
        onPress: () => updateGender('Male', isProfile, memberIndex),
      },
      {
        text: 'Female',
        onPress: () => updateGender('Female', isProfile, memberIndex),
      },
      {
        text: 'Other',
        onPress: () => updateGender('Other', isProfile, memberIndex),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const updateGender = (gender, isProfile, memberIndex) => {
    if (isProfile) {
      updateProfileData('gender', gender);
    } else {
      updateFamilyMember(memberIndex, 'gender', gender);
    }
  };

  const validateForm = () => {
    if (!profileData.name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!profileData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!profileData.dob) {
      Alert.alert('Error', 'Please select your date of birth');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      await updateUserProfile(
        {
          ...profileData,
          familyDetails: includeFamilyMembers ? profileData.familyDetails : [],
        },
        authToken,
        dispatch,
      );

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('ProfileTwo') },
      ]);
    } catch (error) {
      console.log('Error', error.message);
      // Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormField = (
    label,
    value,
    onChangeText,
    placeholder,
    isDropdown = false,
    onPress = () => {},
    isDateField = false,
    keyboardType = 'default',
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isDropdown ? (
        <TouchableOpacity
          style={styles.dropdownContainer}
          onPress={onPress}
          disabled={isSubmitting}
        >
          <Text
            style={[
              styles.dropdownText,
              value === 'Select Gender' && styles.placeholderText,
            ]}
          >
            {value}
          </Text>
          <Icon name="keyboard-arrow-down" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      ) : isDateField ? (
        <View style={styles.dateInputContainer}>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={onPress}
            disabled={isSubmitting}
          >
            <Text style={value ? styles.dropdownText : styles.placeholderText}>
              {value || placeholder}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPress}
            style={styles.calendarIcon}
            disabled={isSubmitting}
          >
            <Icon name="calendar-today" size={20} color="#7518AA" />
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!isSubmitting}
          keyboardType={keyboardType}
        />
      )}
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
        {/* Header Section - Fixed */}
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} resizeMode="contain" />
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi, Welcome</Text>
            <Text style={styles.userName}>
              {profileData.name || 'Janmani Kumar'}
            </Text>
          </View>
          <View style={styles.notificationIcons}>
            <TouchableOpacity
              style={[styles.notificationButton, { right: hp('2%') }]}
            >
              <Icon name="notifications" size={24} color="black" />
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
        </View>

        <View style={styles.headered}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            disabled={isSubmitting}
          >
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {addperson ? 'Add Family Member' : 'My Profile'}
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Section */}
          {!addperson && (
            <View style={styles.section}>
              {renderFormField(
                'Name*',
                profileData.name,
                text => updateProfileData('name', text),
                'Enter Your Name',
              )}

              {renderFormField(
                'Date of Birth*',
                profileData.dob,
                null,
                'Select Date of Birth',
                false,
                () => {
                  setActiveDatePickerFor('profile');
                  setShowDatePicker(true);
                },
                true,
              )}

              {renderFormField(
                'E-mail ID*',
                profileData.email,
                text => updateProfileData('email', text),
                'Enter mail id',
                false,
                null,
                false,
                'email-address',
              )}

              {renderFormField(
                'Mobile Number',
                profileData.mobileNumber,
                text => updateProfileData('mobileNumber', text),
                'Enter mobile number',
                false,
                null,
                false,
                'phone-pad',
              )}

              <View style={styles.rowContainer}>
                <View style={styles.halfField}>
                  {renderFormField(
                    'Age',
                    profileData.age,
                    text => updateProfileData('age', text),
                    'Enter your Age',
                    false,
                    null,
                    false,
                    'numeric',
                  )}
                </View>
                <View style={styles.halfField}>
                  {renderFormField(
                    'Gender*',
                    profileData.gender,
                    null,
                    '',
                    true,
                    () => showGenderPicker(true),
                  )}
                </View>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Upload Profile Image</Text>
                <TouchableOpacity
                  style={styles.uploadContainer}
                  onPress={selectImage}
                  disabled={isSubmitting}
                >
                  {profileData.profile_photo ? (
                    <Image
                      source={{
                        uri: profileData.profile_photo.startsWith('http')
                          ? profileData.profile_photo
                          : `${IMAGE_URL}${profileData.profile_photo}`,
                      }}
                      style={styles.uploadedImage}
                    />
                  ) : (
                    <>
                      <Icon name="cloud-upload" size={40} color="#7518AA" />
                      <Text style={styles.uploadText}>Upload image</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.toggleContainer}
                onPress={() => setIncludeFamilyMembers(!includeFamilyMembers)}
                disabled={isSubmitting}
              >
                <Icon
                  name={
                    includeFamilyMembers
                      ? 'check-box'
                      : 'check-box-outline-blank'
                  }
                  size={24}
                  color="#4CAF50"
                />
                <Text style={styles.toggleText}>
                  Would you like to include your family members details?
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Family Members Section */}
          {includeFamilyMembers && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Family Members Details</Text>

              {profileData.familyDetails.map((member, index) => (
                <View
                  key={`member-${index}`}
                  style={styles.familyMemberContainer}
                >
                  <View style={styles.familyMemberHeader}>
                    <Text style={styles.familyMemberTitle}>
                      Family Member {index + 1}
                    </Text>
                    {profileData.familyDetails.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => removeFamilyMember(index)}
                        disabled={isSubmitting}
                      >
                        <Icon name="close" size={20} color="#EF4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {renderFormField(
                    'Name',
                    member.name,
                    text => updateFamilyMember(index, 'name', text),
                    'Enter Your Name',
                  )}

                  {renderFormField(
                    'Date of Birth',
                    member.dob,
                    null,
                    'Select Date of Birth',
                    false,
                    () => {
                      setActiveDatePickerFor(index);
                      setShowDatePicker(true);
                    },
                    true,
                  )}

                  {renderFormField(
                    'E-mail ID',
                    member.email,
                    text => updateFamilyMember(index, 'email', text),
                    'Enter mail id',
                    false,
                    null,
                    false,
                    'email-address',
                  )}

                  {renderFormField(
                    'Mobile Number',
                    member.mobile,
                    text => updateFamilyMember(index, 'mobile', text),
                    'Enter mobile number',
                    false,
                    null,
                    false,
                    'phone-pad',
                  )}

                  <View style={styles.rowContainer}>
                    <View style={styles.halfField}>
                      {renderFormField(
                        'Age',
                        member.age,
                        text => updateFamilyMember(index, 'age', text),
                        'Enter your Age',
                        false,
                        null,
                        false,
                        'numeric',
                      )}
                    </View>
                    <View style={styles.halfField}>
                      {renderFormField(
                        'Gender',
                        member.gender,
                        null,
                        '',
                        true,
                        () => showGenderPicker(false, index),
                      )}
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={styles.addButton}
                onPress={addFamilyMember}
                disabled={isSubmitting}
              >
                <Icon name="add" size={20} color="#8B5CF6" />
                <Text style={styles.addButtonText}>Add one more Person</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[styles.saveButton, isSubmitting && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Date Pickers */}
        {showDatePicker && (
          <DateTimePicker
            value={
              activeDatePickerFor === 'profile'
                ? profileData.dob
                  ? new Date(profileData.dob)
                  : new Date()
                : profileData.familyDetails[activeDatePickerFor]?.dob
                ? new Date(profileData.familyDetails[activeDatePickerFor].dob)
                : new Date()
            }
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('4%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('12%'),
    height: hp('6%'),
  },
  greetingContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  greeting: {
    fontSize: Fonts.size.TopHeading,
    color: 'black',
    opacity: 0.9,
    fontFamily: Fonts.family.regular,
  },
  userName: {
    fontSize: Fonts.size.TopSubheading,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: Fonts.family.regular,
  },
  notificationIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
  },
  headered: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  backButton: {
    padding: wp('1%'),
  },
  headerTitle: {
    flex: 1,
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: wp('2%'),
    fontFamily: Fonts.family.regular,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: hp('10%'),
  },
  section: {
    marginBottom: hp('2%'),
    backgroundColor: 'white',
    borderRadius: 10,
    padding: wp('4%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: hp('2%'),
    fontFamily: Fonts.family.regular,
  },
  fieldContainer: {
    marginBottom: hp('2%'),
  },
  fieldLabel: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#4F4C4C',
    marginBottom: hp('1%'),
    fontFamily: Fonts.family.regular,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    fontSize: Fonts.size.PageHeading,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: Fonts.size.PageHeading,
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontFamily: Fonts.family.regular,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    justifyContent: 'center',
  },
  calendarIcon: {
    paddingHorizontal: wp('3%'),
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: wp('6%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadedImage: {
    width: wp('20%'),
    height: wp('20%'),
    borderRadius: wp('10%'),
  },
  uploadText: {
    marginTop: hp('1%'),
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    fontFamily: Fonts.family.regular,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    marginTop: hp('1%'),
  },
  toggleText: {
    fontSize: Fonts.size.PageSubheading,
    marginLeft: wp('2%'),
    color: '#166534',
    flex: 1,
    fontFamily: Fonts.family.regular,
  },
  familyMemberContainer: {
    marginBottom: hp('3%'),
    paddingBottom: hp('2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  familyMemberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  familyMemberTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  removeButton: {
    padding: wp('1%'),
    backgroundColor: '#FEE2E2',
    borderRadius: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp('1.5%'),
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  addButtonText: {
    marginLeft: wp('2%'),
    fontSize: Fonts.size.PageHeading,
    color: '#8B5CF6',
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
  saveButton: {
    backgroundColor: '#7518AA',
    borderRadius: 8,
    paddingVertical: hp('2%'),
    alignItems: 'center',
    marginVertical: hp('3%'),
    marginHorizontal: wp('4%'),
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
});

export default ProfileFormScreen;