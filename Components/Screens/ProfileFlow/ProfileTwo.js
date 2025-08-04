import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import { UserProfileAPI } from '../APICall/ProfileApi'; // API calls
import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { IMAGE_URL } from '../Config';

const ProfileDisplayScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  console.log(profileData, 'profileData');
  const token = useSelector(state => state.auth.token);
  console.log(profileData, 'token');

  useEffect(() => {
    UserProfileAPI(token)
      .then(data => {
        setProfileData(data.data);
        setFamilyMembers(data.data.familyDetails);
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  }, []);

  const handleEdit = () => {
    console.log('Edit profile pressed');
    navigation.navigate('Profileone', { profileData: profileData }); // <-- pass data here
  };

  const handleAddPerson = () => {
    console.log('Add person pressed');
    navigation.navigate('Profileone', { addperson: true,profileData:profileData });
    // Add navigation to add family member screen
  };

  const handleBack = () => {
    console.log('Back pressed');
    // Add navigation back
  };

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );

  const renderProfileCard = (data, isMainProfile = false) => (
    <View style={styles.profileCard}>
      {isMainProfile && (
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: `${IMAGE_URL}${data.profile_photo}` }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{data.name}</Text>
            <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
              <Icon name="edit" size={16} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.infoContainer}>
        {!isMainProfile && (
          <View style={styles.familyMemberHeader}>
            <Text style={styles.familyMemberName}>{data.name}</Text>
          </View>
        )}

        {renderInfoRow('Date of Birth', data.dob)}
        {renderInfoRow('Email Id', data.email)}
        {renderInfoRow('Mobile Number', data.mobile)}

        <View style={styles.rowInfo}>
          <View style={styles.halfInfo}>{renderInfoRow('Age', data.age)}</View>
          <View style={styles.halfInfo}>
            {renderInfoRow('Gender', data.gender)}
          </View>
        </View>
      </View>
    </View>
  );
  if (!profileData) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.statusBar}
        />
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 0 }}
          style={styles.topBackground}
        >
          <View style={styles.header}>
            <Image source={logo} style={styles.logo} />
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Loading...</Text>
            </View>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.userName}>{profileData.name}</Text>
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Main Profile */}
          {renderProfileCard(profileData, true)}

          {/* Family Details Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Family Details</Text>
            <TouchableOpacity
              style={styles.addPersonButton}
              onPress={handleAddPerson}
            >
              <Icon name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addPersonText}>Add Person</Text>
            </TouchableOpacity>
          </View>

          {/* Family Members */}
          {familyMembers.map(member => (
            <View key={member.id}>{renderProfileCard(member, false)}</View>
          ))}
        </ScrollView>
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
    paddingHorizontal: 10,
    paddingTop: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileName: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: Fonts.family.regular,
  },
  infoContainer: {
    padding: 16,
  },
  familyMemberHeader: {
    marginBottom: 12,
  },
  familyMemberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 4,
    fontFamily: Fonts.family.regular,
  },
  infoValue: {
    fontSize: Fonts.size.PageHeading,
    color: '#1F2937',
    fontWeight: '400',
    fontFamily: Fonts.family.regular,
  },
  rowInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInfo: {
    width: '48%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
  },
  addPersonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addPersonText: {
    color: '#FFFFFF',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: Fonts.family.regular,
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
    marginTop: 10,
    marginLeft: -10,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 8,
    fontFamily: Fonts.family.regular,
  },
});

export default ProfileDisplayScreen;
