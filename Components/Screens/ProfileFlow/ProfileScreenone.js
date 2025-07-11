import React, {useState} from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const ProfileFormScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    dateOfBirth: '',
    emailId: '',
    mobileNumber: '',
    age: '',
    gender: 'Select Gender',
    profileImage: null,
  });

  const [familyMembers, setFamilyMembers] = useState([
    {
      id: 1,
      name: '',
      dateOfBirth: '',
      emailId: '',
      mobileNumber: '',
      age: '',
      gender: 'Select Gender',
    },
  ]);

  const [includeFamilyMembers, setIncludeFamilyMembers] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showFamilyDatePickers, setShowFamilyDatePickers] = useState([]);
  const [datePickerFor, setDatePickerFor] = useState('');

  const updateProfileData = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateFamilyMember = (index, field, value) => {
    const updatedMembers = [...familyMembers];
    updatedMembers[index][field] = value;
    setFamilyMembers(updatedMembers);
  };

  const addFamilyMember = () => {
    setFamilyMembers(prev => [
      ...prev,
      {
        id: Date.now(),
        name: '',
        dateOfBirth: '',
        emailId: '',
        mobileNumber: '',
        age: '',
        gender: 'Select Gender',
      },
    ]);
    setShowFamilyDatePickers(prev => [...prev, false]);
  };

  const selectImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.error) {
        return;
      }
      if (response.assets && response.assets[0]) {
        updateProfileData('profileImage', response.assets[0].uri);
      }
    });
  };

  const showGenderPicker = (isProfile = true, memberIndex = 0) => {
    Alert.alert(
      'Select Gender',
      '',
      [
        {
          text: 'Male',
          onPress: () => {
            if (isProfile) {
              updateProfileData('gender', 'Male');
            } else {
              updateFamilyMember(memberIndex, 'gender', 'Male');
            }
          },
        },
        {
          text: 'Female',
          onPress: () => {
            if (isProfile) {
              updateProfileData('gender', 'Female');
            } else {
              updateFamilyMember(memberIndex, 'gender', 'Female');
            }
          },
        },
        {
          text: 'Other',
          onPress: () => {
            if (isProfile) {
              updateProfileData('gender', 'Other');
            } else {
              updateFamilyMember(memberIndex, 'gender', 'Other');
            }
          },
        },
        {text: 'Cancel', style: 'cancel'},
      ],
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    setShowFamilyDatePickers([]);
    
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      if (datePickerFor === 'profile') {
        updateProfileData('dateOfBirth', formattedDate);
      } else if (typeof datePickerFor === 'number') {
        updateFamilyMember(datePickerFor, 'dateOfBirth', formattedDate);
      }
    }
  };

  const openDatePicker = (forWhom) => {
    setDatePickerFor(forWhom);
    if (forWhom === 'profile') {
      setShowDatePicker(true);
    } else {
      const newPickers = familyMembers.map((_, i) => i === forWhom);
      setShowFamilyDatePickers(newPickers);
    }
  };

  const handleSave = () => {
    console.log('Profile Data:', profileData);
    console.log('Family Members:', familyMembers);

    Alert.alert('Success', 'Profile saved successfully!', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('ProfileTwo'),
      },
    ]);
  };

  const renderFormField = (
    label,
    value,
    onChangeText,
    placeholder,
    isDropdown = false,
    onPress = () => {},
    isDateField = false
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isDropdown ? (
        <TouchableOpacity style={styles.dropdownContainer} onPress={onPress}>
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
          >
            <Text style={value ? styles.dropdownText : styles.placeholderText}>
              {value || placeholder}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onPress} style={styles.calendarIcon}>
            <Icon name="calendar-today" size={20} color="#7518AA" />
          </TouchableOpacity>
        </View>
      ) : (
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onText => onChangeText(onText)}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
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
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            {renderFormField(
              'Name',
              profileData.name,
              text => updateProfileData('name', text),
              'Enter Your Name'
            )}

            {renderFormField(
              'Date of Birth',
              profileData.dateOfBirth,
              null,
              'Select Date of Birth',
              false,
              () => openDatePicker('profile'),
              true
            )}

            {renderFormField(
              'E-mail ID',
              profileData.emailId,
              text => updateProfileData('emailId', text),
              'Enter mail id'
            )}

            {renderFormField(
              'Mobile Number',
              profileData.mobileNumber,
              text => updateProfileData('mobileNumber', text),
              'Enter mobile number'
            )}

            <View style={styles.rowContainer}>
              <View style={styles.halfField}>
                {renderFormField(
                  'Age',
                  profileData.age,
                  text => updateProfileData('age', text),
                  'Enter your Age'
                )}
              </View>
              <View style={styles.halfField}>
                {renderFormField(
                  'Gender',
                  profileData.gender,
                  null,
                  '',
                  true,
                  () => showGenderPicker(true)
                )}
              </View>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Upload Profile Image</Text>
              <TouchableOpacity style={styles.uploadContainer} onPress={selectImage}>
                {profileData.profileImage ? (
                  <Image
                    source={{uri: profileData.profileImage}}
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
              onPress={() => setIncludeFamilyMembers(!includeFamilyMembers)}>
              <Icon
                name={includeFamilyMembers ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color="#4CAF50"
              />
              <Text style={styles.toggleText}>
                Would you like to include your family members details?
              </Text>
            </TouchableOpacity>
          </View>

          {includeFamilyMembers && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Family Members Details</Text>

              {familyMembers.map((member, index) => (
                <View key={member.id} style={styles.familyMemberContainer}>
                  {renderFormField(
                    'Name',
                    member.name,
                    text => updateFamilyMember(index, 'name', text),
                    'Enter Your Name'
                  )}

                  {renderFormField(
                    'Date of Birth',
                    member.dateOfBirth,
                    null,
                    'Select Date of Birth',
                    false,
                    () => openDatePicker(index),
                    true
                  )}

                  {renderFormField(
                    'E-mail ID',
                    member.emailId,
                    text => updateFamilyMember(index, 'emailId', text),
                    'Enter mail id'
                  )}

                  {renderFormField(
                    'Mobile Number',
                    member.mobileNumber,
                    text => updateFamilyMember(index, 'mobileNumber', text),
                    'Enter mobile number'
                  )}

                  <View style={styles.rowContainer}>
                    <View style={styles.halfField}>
                      {renderFormField(
                        'Age',
                        member.age,
                        text => updateFamilyMember(index, 'age', text),
                        'Enter your Age'
                      )}
                    </View>
                    <View style={styles.halfField}>
                      {renderFormField(
                        'Gender',
                        member.gender,
                        null,
                        '',
                        true,
                        () => showGenderPicker(false, index)
                      )}
                    </View>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.addButton} onPress={addFamilyMember}>
                <Icon name="add" size={20} color="#8B5CF6" />
                <Text style={styles.addButtonText}>Add one more Person</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        {showFamilyDatePickers.map((show, index) => (
          show && (
            <DateTimePicker
              key={index}
              value={familyMembers[index].dateOfBirth ? new Date(familyMembers[index].dateOfBirth) : new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, date) => {
                const newPickers = [...showFamilyDatePickers];
                newPickers[index] = false;
                setShowFamilyDatePickers(newPickers);
                if (date) {
                  const formattedDate = date.toISOString().split('T')[0];
                  updateFamilyMember(index, 'dateOfBirth', formattedDate);
                }
              }}
              maximumDate={new Date()}
            />
          )
        ))}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headered: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: -10
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
     fontFamily:Fonts.family.regular
  },
  sectionTitle: {
     fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    marginTop: 10,
     fontFamily:Fonts.family.regular
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
      fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#4F4C4C',
    marginBottom: 8,
    fontFamily:Fonts.family.regular
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
     fontSize:  Fonts.size.PageHeading,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    width: wp('92%'),
    height: hp('6%'),
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
     fontSize:  Fonts.size.PageHeading,
    color: '#1F2937',
     fontFamily:Fonts.family.regular
  },
  placeholderText: {
    color: '#9CA3AF',
     fontFamily:Fonts.family.regular
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
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
    width: wp('92%'),
    height: hp('6%'),
    overflow: 'hidden',
  },
  dateInput: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
    height: '100%',
  },
  calendarIcon: {
    paddingHorizontal: 12,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#ffff',

  },
  uploadContainer: {
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 8,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
  },
  uploadedImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  uploadText: {
    marginTop: 8,
     fontSize:  Fonts.size.PageHeading,
    color: '#6B7280',
     fontFamily:Fonts.family.regular
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    marginTop: 8,
  },
  toggleText: {
    fontSize:  Fonts.size.PageSubheading,
 left:10,
    color: '#166534',
    flex: 1,
     fontFamily:Fonts.family.regular
  },
  familyMemberContainer: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    borderRadius: 8,
    backgroundColor: '#FAFAFA',
  },
  addButtonText: {
    marginLeft: 8,
   fontSize:  Fonts.size.PageHeading,
    color: '#8B5CF6',
    fontWeight: '500',
     fontFamily:Fonts.family.regular
  },
  saveButton: {
    backgroundColor: '#7518AA',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginVertical: 24,
    marginHorizontal: 16,
    marginBottom: 100
  },
  saveButtonText: {
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
  content: {
    marginTop: 20
  },
});

export default ProfileFormScreen;