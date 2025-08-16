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
  } from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import LinearGradient from 'react-native-linear-gradient';
  import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
  import Fonts from '../../Fonts/Fonts';
  import Colors from '../../Colors/Colors';
  import { UserProfileAPI } from '../APICall/ProfileApi';
  import { useSelector } from 'react-redux';
  import { IMAGE_URL } from '../Config';
  import CustomHeader from '../../../Header'; 

  const ProfileDisplayScreen = ({ navigation }) => {
    const [profileData, setProfileData] = useState(null);
    const [familyMembers, setFamilyMembers] = useState([]);
    const token = useSelector(state => state.auth.token);

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
      navigation.navigate('Profileone', { profileData });
    };

    const handleAddPerson = () => {
      navigation.navigate('Profileone', {
        addperson: true,
        profileData,
      });
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
              <Text style={styles.infoLabel}>Name : <Text style={styles.infoValue}> {data.name}</Text></Text>
            </View>
          )}
          {renderInfoRow('Date of Birth   :' , data.dob)}
          {renderInfoRow('Email Id   :', data.email)}
          {renderInfoRow('Mobile Number   :', data.mobile)}
          <View style={styles.rowInfo}>
            <View style={styles.halfInfo}>{renderInfoRow('Age   :', data.age)}</View>
            <View style={styles.halfInfo}>{renderInfoRow('Gender   :', data.gender)}</View>
          </View>
        </View>
      </View>
    );

    if (!profileData) {
      return (
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
          <LinearGradient
            colors={['#ffffff', '#C3DFFF']}
            start={{ x: 0, y: 0.3 }}
            end={{ x: 0, y: 0 }}
            style={styles.topBackground}
          >
            <CustomHeader username="Loading..." />
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
          {/* ✅ Custom Header */}
          <CustomHeader
            username={profileData.name}
            onNotificationPress={() => console.log('Notification pressed')}
            onWalletPress={() => console.log('Wallet pressed')}
          />

          {/* Page Title */}
          <View style={styles.headered}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
          </View>

          {/* Profile Info */}
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {renderProfileCard(profileData, true)}

            {/* Family Details */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Family Details</Text>
              <TouchableOpacity style={styles.addPersonButton} onPress={handleAddPerson}>
                <Icon name="add" size={16} color="#FFFFFF" />
                <Text style={styles.addPersonText}>Add Person</Text>
              </TouchableOpacity>
            </View>

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
      shadowOffset: { width: 0, height: 2 },
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
      justifyContent: 'space-between',
      alignItems: 'center',
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
      backgroundColor: '#7518AA',
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
   infoRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 12,
  flexWrap: 'wrap',
},
infoLabel: {
  fontSize: Fonts.size.PageHeading,
  color: '#6B7280',
  fontWeight: '500',
  fontFamily: Fonts.family.regular,
  marginRight: 6,  // spacing before value
},
infoValue: {
  fontSize: Fonts.size.PageHeading,
  color: '#1F2937',
  fontWeight: '400',
  fontFamily: Fonts.family.regular,
  flexShrink: 1, // handle long text wrapping
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
      justifyContent: 'space-between',
      alignItems: 'center',
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
      backgroundColor: '#7518AA',
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
