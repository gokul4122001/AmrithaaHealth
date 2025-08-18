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
  PermissionsAndroid,
  Modal,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
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
import CustomHeader from '../../../Header';
import { useDispatch, useSelector } from 'react-redux';

const { width, height } = Dimensions.get('window');

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
  const [showImageModal, setShowImageModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData && !addperson) {
      console.log(initialData, 'initialData');
      setProfileData({
        ...initialData,
        age: initialData?.age?.toString(),
        mobileNumber: initialData?.mobile,
        profile_photo: initialData?.profile_photo || null,
        gender: initialData?.gender || 'Select Gender',
        familyDetails: initialData?.familyDetails || [],
      });

      if (initialData?.familyDetails?.length > 0 || addperson) {
        setIncludeFamilyMembers(true);
      }
    }
    if (initialData && addperson) {
      setProfileData({
        ...profileData,
        name: initialData?.name,
        dob: initialData?.dob,
        email: initialData?.email,
        age: initialData?.age?.toString(),
        mobileNumber: initialData?.mobile,
        profile_photo: initialData?.profile_photo || null,
        gender: initialData?.gender || 'Select Gender',
      });

      if (initialData?.familyDetails?.length > 0 || addperson) {
        setIncludeFamilyMembers(true);
      }
    }
  }, [initialData, addperson]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return '';
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Helper functions
  const updateProfileData = (field, value) => {
    setProfileData(prev => {
      const updatedData = { ...prev, [field]: value };
      
      if (field === 'dob' && value) {
        updatedData.age = calculateAge(value);
      }
      
      return updatedData;
    });
  };

  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...profileData.familyDetails];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    
    if (field === 'dob' && value) {
      updatedMembers[index].age = calculateAge(value);
    }
    
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

  const removeFamilyMember = index => {
    setProfileData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (addperson) {
      setIncludeFamilyMembers(true);
      const hasEmptyMember = profileData.familyDetails.some(
        member => !member.name && !member.email && !member.mobile,
      );
      if (!hasEmptyMember) {
        addFamilyMember();
      }
    }
  }, [addperson]);

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Open camera
  const openCamera = async () => {
    setShowImageModal(false);
    
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
      saveToPhotos: false,
    };

    launchCamera(options, handleImageResponse);
  };

  // Open gallery
  const openGallery = () => {
    setShowImageModal(false);
    
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  // Handle image response
  const handleImageResponse = (response) => {
    try {
      if (response.didCancel) {
        console.log('User cancelled image picker');
        return;
      }

      if (response.errorCode) {
        throw new Error(response.errorMessage || 'Image selection failed');
      }

      const selectedImage = response.assets?.[0];
      if (!selectedImage) {
        throw new Error('No image selected');
      }

      // Check file size
      if (selectedImage.fileSize && selectedImage.fileSize > MAX_IMAGE_SIZE) {
        Alert.alert('Error', 'Image size should be less than 2MB');
        return;
      }

      // Check file type
      if (selectedImage.type && !ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
        Alert.alert('Error', 'Only JPEG and PNG images are allowed');
        return;
      }

      // Immediately update the image
      updateProfileData('profile_photo', selectedImage.uri);
      
      // Show success message
      // Alert.alert('Success', 'Profile image updated successfully!');
      
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
    if (!profileData.name.trim() && !addperson) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }

    if (!profileData.email.trim() && !addperson) {
      Alert.alert('Error', 'Please enter your email');
      return false;
    } else if (!/^\S+@\S+\.\S+$/.test(profileData.email) && !addperson) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (!profileData.dob && !addperson) {
      Alert.alert('Error', 'Please select your date of birth');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (isSubmitting || !validateForm()) return;

    setIsSubmitting(true);

    try {
      const mergedFamilyDetails = includeFamilyMembers
        ? [
            ...(initialData?.familyDetails || []),
            ...(profileData.familyDetails || []),
          ]
        : [];

      const edit = addperson
        ? { ...profileData, familyDetails: mergedFamilyDetails }
        : { ...profileData, familyDetails: mergedFamilyDetails };

      console.log('Final payload edit:', edit);

      await updateUserProfile(edit, authToken, dispatch);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('ProfileTwo') },
      ]);
    } catch (error) {
      console.log('Error', error.message);
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
    isReadOnly = false,
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
          style={[styles.textInput, isReadOnly && styles.readOnlyInput]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!isSubmitting && !isReadOnly}
          keyboardType={keyboardType}
        />
      )}
    </View>
  );

  // Image Picker Modal Component
  const ImagePickerModal = () => (
    <Modal
      visible={showImageModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowImageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Profile Image</Text>
            <TouchableOpacity
              onPress={() => setShowImageModal(false)}
              style={styles.modalCloseButton}
            >
              <Icon name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSubtitle}>Choose an option to select your profile image</Text>

          <View style={styles.modalOptions}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={openCamera}
              disabled={isSubmitting}
            >
              <View style={styles.modalOptionIcon}>
                <Icon name="camera-alt" size={32} color="#7518AA" />
              </View>
              <Text style={styles.modalOptionText}>Camera</Text>
              <Text style={styles.modalOptionSubtext}>Take a new photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={openGallery}
              disabled={isSubmitting}
            >
              <View style={styles.modalOptionIcon}>
                <Icon name="photo-library" size={32} color="#7518AA" />
              </View>
              <Text style={styles.modalOptionText}>Gallery</Text>
              <Text style={styles.modalOptionSubtext}>Choose from gallery</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.modalCancelButton}
            onPress={() => setShowImageModal(false)}
          >
            <Text style={styles.modalCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
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
        <CustomHeader
          username={profileData.name}
          onNotificationPress={() => console.log('Notification pressed')}
          onWalletPress={() => console.log('Wallet pressed')}
        />

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
                    null,
                    'Auto calculated from DOB',
                    false,
                    null,
                    false,
                    'numeric',
                    true,
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
                  onPress={() => setShowImageModal(true)}
                  disabled={isSubmitting}
                >
                  {profileData.profile_photo ? (
                    <View style={styles.imageContainer}>
                      <Image
                        source={{
                          uri: profileData.profile_photo.startsWith('http')
                            ? profileData.profile_photo
                            : profileData.profile_photo.startsWith('file://')
                            ? profileData.profile_photo
                            : `${IMAGE_URL}${profileData.profile_photo}`,
                        }}
                        style={styles.uploadedImage}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.changeImageButton}
                        onPress={() => setShowImageModal(true)}
                        disabled={isSubmitting}
                      >
                        <Icon name="edit" size={16} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Icon name="add-a-photo" size={40} color="#7518AA" />
                      <Text style={styles.uploadText}>Upload Profile Image</Text>
                      <Text style={styles.uploadSubText}>Tap to select from Camera or Gallery</Text>
                    </View>
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
          {includeFamilyMembers && addperson && (
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
                        null,
                        'Auto calculated from DOB',
                        false,
                        null,
                        false,
                        'numeric',
                        true,
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

        {/* Image Picker Modal */}
        <ImagePickerModal />
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
    height: hp('100%'),
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
    minHeight: hp('6%'),
  },
  readOnlyInput: {
    backgroundColor: '#F9FAFB',
    color: '#6B7280',
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
    minHeight: hp('6%'),
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
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: wp('4%'),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    minHeight: hp('15%'),
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  uploadedImage: {
    width: wp('24%'),
    height: wp('24%'),
    borderRadius: wp('12%'),
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  changeImageButton: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#7518AA',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  uploadText: {
    marginTop: hp('1%'),
    fontSize: Fonts.size.PageHeading,
    color: '#374151',
    fontFamily: Fonts.family.regular,
    fontWeight: '600',
  },
  uploadSubText: {
    fontSize: Fonts.size.PageSubheading,
    color: '#9CA3AF',
    fontFamily: Fonts.family.regular,
    marginTop: hp('0.5%'),
    textAlign: 'center',
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
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: wp('5%'),
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: wp('5%'),
    width: '100%',
    maxWidth: 400,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  modalTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  modalCloseButton: {
    padding: wp('2%'),
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  modalSubtitle: {
    fontSize: Fonts.size.PageSubheading,
    color: '#6B7280',
    fontFamily: Fonts.family.regular,
    marginBottom: hp('3%'),
    lineHeight: 20,
  },
  modalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('3%'),
  },
  modalOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: hp('3%'),
    paddingHorizontal: wp('3%'),
    marginHorizontal: wp('1%'),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FAFBFC',
  },
  modalOptionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1.5%'),
  },
  modalOptionText: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
    marginBottom: hp('0.5%'),
  },
  modalOptionSubtext: {
    fontSize: Fonts.size.PageSubheading,
    color: '#6B7280',
    fontFamily: Fonts.family.regular,
    textAlign: 'center',
  },
  modalCancelButton: {
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#F9FAFB',
  },
  modalCancelText: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
});

export default ProfileFormScreen;