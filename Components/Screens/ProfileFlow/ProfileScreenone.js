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
  Modal,
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
  const [showGenderModal, setShowGenderModal] = useState(false);
  const [activeGenderFor, setActiveGenderFor] = useState({ isProfile: true, index: 0 });
  const [showImagePicker, setShowImagePicker] = useState(false);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (initialData && !addperson) {
      console.log(initialData, 'initialData');
      setProfileData({
        ...initialData,
        age: initialData?.age?.toString() || '',
        mobileNumber: initialData?.mobile || '',
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
        name: initialData?.name || '',
        dob: initialData?.dob || '',
        email: initialData?.email || '',
        age: initialData?.age?.toString() || '',
        mobileNumber: initialData?.mobile || '',
        profile_photo: initialData?.profile_photo || null,
        gender: initialData?.gender || 'Select Gender',
      });
      
      if (initialData?.familyDetails?.length > 0 || addperson) {
        setIncludeFamilyMembers(true);
      }
    }
  }, [initialData, addperson]);

  // Calculate age from DOB
  const calculateAge = (dob) => {
    if (!dob) return '';
    
    const today = new Date();
    const birthDate = new Date(dob);
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
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate age when DOB changes
      if (field === 'dob' && value) {
        newData.age = calculateAge(value);
      }
      
      return newData;
    });
  };

  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...profileData.familyDetails];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    
    // Auto-calculate age when DOB changes for family member
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

  const removeFamilyMember = (index) => {
    setProfileData(prev => ({
      ...prev,
      familyDetails: prev.familyDetails.filter((_, i) => i !== index),
    }));
  };

  useEffect(() => {
    if (addperson) {
      setIncludeFamilyMembers(true);
      const hasEmptyMember = profileData.familyDetails.some(member => 
        !member.name && !member.email && !member.mobile
      );
      if (!hasEmptyMember) {
        addFamilyMember();
      }
    }
  }, [addperson]);

  // Image Picker Functions
  const showImagePickerOptions = () => {
    setShowImagePicker(true);
  };

  const selectImageFromGallery = async () => {
    setShowImagePicker(false);
    
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

  const selectImageFromCamera = async () => {
    setShowImagePicker(false);
    
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 2000,
        maxHeight: 2000,
      });

      if (result.didCancel) return;
      if (result.errorCode) {
        throw new Error(result.errorMessage || 'Camera capture failed');
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
    setActiveGenderFor({ isProfile, index: memberIndex });
    setShowGenderModal(true);
  };

  const updateGender = (gender) => {
    const { isProfile, index } = activeGenderFor;
    
    if (isProfile) {
      updateProfileData('gender', gender);
    } else {
      updateFamilyMember(index, 'gender', gender);
    }
    
    setShowGenderModal(false);
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

    const edit = addperson ? { ...profileData, ...initialData } : profileData;

    try {
      await updateUserProfile(
        {
          ...edit,
          mobile: profileData.mobileNumber, // Map mobileNumber to mobile for API
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
    isAge = false,
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isDropdown ? (
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={onPress}
          disabled={isSubmitting}
        >
          <Text
            style={[
              styles.inputText,
              value === 'Select Gender' && styles.placeholderText,
            ]}
          >
            {value}
          </Text>
          <Icon name="keyboard-arrow-down" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      ) : isDateField ? (
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={onPress}
          disabled={isSubmitting}
        >
          <Text style={value ? styles.inputText : styles.placeholderText}>
            {value || placeholder}
          </Text>
          <Icon name="calendar-today" size={20} color="#7518AA" style={styles.dateIcon} />
        </TouchableOpacity>
      ) : (
        <TextInput
          style={styles.inputContainer}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          editable={!isSubmitting && !isAge}
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
                    text => updateProfileData('age', text),
                    'Auto-calculated',
                    false,
                    null,
                    false,
                    'numeric',
                    true, // isAge = true to disable editing
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
                  onPress={showImagePickerOptions}
                  disabled={isSubmitting}
                >
                  {profileData.profile_photo ? (
                    <Image
                      source={{
                        uri: profileData.profile_photo.startsWith('http') || profileData.profile_photo.startsWith('file://')
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
                        text => updateFamilyMember(index, 'age', text),
                        'Auto-calculated',
                        false,
                        null,
                        false,
                        'numeric',
                        true, // isAge = true to disable editing
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

        {/* Date Picker */}
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

        {/* Gender Selection Modal */}
        <Modal
          visible={showGenderModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowGenderModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => updateGender('Male')}
              >
                <Text style={styles.modalOptionText}>Male</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => updateGender('Female')}
              >
                <Text style={styles.modalOptionText}>Female</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => updateGender('Other')}
              >
                <Text style={styles.modalOptionText}>Other</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowGenderModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Image Picker Modal */}
        <Modal
          visible={showImagePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowImagePicker(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Image Source</Text>
              
              <TouchableOpacity
                style={styles.modalOption}
                onPress={selectImageFromCamera}
              >
                <Icon name="camera-alt" size={24} color="#7518AA" />
                <Text style={styles.modalOptionText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalOption}
                onPress={selectImageFromGallery}
              >
                <Icon name="photo-library" size={24} color="#7518AA" />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowImagePicker(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  // Unified input container style for consistent width and height
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    backgroundColor: '#FFFFFF',
    minHeight: hp('6%'), // Consistent height for all fields
    fontSize: Fonts.size.PageHeading,
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  inputText: {
    flex: 1,
    fontSize: Fonts.size.PageHeading,
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontFamily: Fonts.family.regular,
  },
  dateIcon: {
    position: 'absolute',
    right: wp('3%'),
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfField: {
    width: '48%',
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
    minHeight: hp('12%'),
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
    minHeight: hp('6%'),
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
    minHeight: hp('6%'),
    justifyContent: 'center',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: wp('6%'),
    width: wp('80%'),
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: hp('2%'),
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    minHeight: hp('6%'),
  },
  modalOptionText: {
    fontSize: Fonts.size.PageHeading,
    color: '#1F2937',
    marginLeft: wp('3%'),
    fontFamily: Fonts.family.regular,
  },
  modalCancelButton: {
    marginTop: hp('2%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
    minHeight: hp('6%'),
    justifyContent: 'center',
  },
  modalCancelText: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
});

export default ProfileFormScreen;