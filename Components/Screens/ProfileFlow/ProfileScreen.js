import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput,
  Animated,
  ImageBackground,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { UserProfileAPI } from '../APICall/ProfileApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setClear } from '../../redux/slice/authSlice';
import { BASE_URL, IMAGE_URL } from '../Config';

const ProfileScreen = ({ navigation }) => {
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = useSelector(state => state.auth.token);
  const UserProfile = useSelector(state => state.auth.UserProfile);
  const dispatch = useDispatch();

  const menuItems = [
    {
      id: 1,
      title: 'My Profile',
      icon: 'person',
      isActive: true,
    },
    {
      id: 2,
      title: 'Change Password',
      icon: 'lock',
      isActive: false,
    },
    {
      id: 3,
      title: 'Emergency Contact',
      icon: 'phone',
      isActive: false,
    },
    {
      id: 4,
      title: 'My Reports',
      icon: 'description',
      isActive: false,
    },
    {
      id: 5,
      title: 'Terms and Conditions',
      icon: 'article',
      isActive: false,
    },
    {
      id: 6,
      title: 'Logout',
      icon: 'logout',
      isActive: false,
    },
  ];

  const checkProfileData = async () => {
    UserProfileAPI(token)
      .then(data => {
        if (data.data) {
          navigation.navigate('ProfileTwo');
        } else {
          navigation.navigate('Profileone');
        }
      })
      .catch(error => {
        console.error('Error fetching profile data:', error);
      });
  };

  const handleMenuPress = item => {
    setSelectedItem(item.id);
    console.log(`Pressed: ${item.title}`);

    switch (item.title) {
      case 'My Profile':
        checkProfileData();
        break;
      case 'Change Password':
        navigation.navigate('ChangePassword');
        break;
      case 'Emergency Contact':
        navigation.navigate('EmergencyContactScreen');
        break;
      case 'My Reports':
        navigation.navigate('MyReport');
        break;
      case 'Terms and Conditions':
        navigation.navigate('TermsAndConditionsScreen');
        break;
      case 'Logout':
        setIsLogoutPopupVisible(true);
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    setIsLogoutPopupVisible(false);

    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('token');
    dispatch(setClear());
    navigation.navigate('Login6');

  };

  const handleCancelLogout = () => {
    setIsLogoutPopupVisible(false);
  };

  const renderBottomTab = (iconName, label, isActive = false) => (
    <TouchableOpacity style={styles.tabItem}>
      <Icon
        name={iconName}
        size={24}
        color={isActive ? '#8B5CF6' : '#9CA3AF'}
      />
      {label && (
        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.content}>
          <ImageBackground
            source={require('../../Assets/profileframe.png')}
            style={styles.profileCardBackground}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.profileCard}>
              <Image
                source={{
                  uri: UserProfile?.profile_photo
                    ? `${IMAGE_URL}${UserProfile.profile_photo}`
                    : 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y',
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{UserProfile?.name || "UserName"}</Text>
            </View>
          </ImageBackground>

          <View style={{ top: '15%', left: '4%' }}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  selectedItem === item.id && styles.activeMenuItem,
                  index === 0 && { marginTop: 20 },
                ]}
                onPress={() => handleMenuPress(item)}
              >
                <ScrollView>
                  <View style={styles.menuItemContent}>
                    <Icon
                      name={item.icon}
                      size={25}
                      color={selectedItem === item.id ? '#7518AA' : '#6B7280'}
                      style={styles.menuIcon}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        selectedItem === item.id && styles.activeMenuText,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                </ScrollView>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Popup */}
        <Modal
          visible={isLogoutPopupVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsLogoutPopupVisible(false)}
        >
          <View style={styles.logoutOverlay}>
            <View style={styles.logoutPopup}>
              <View style={styles.logoutContent}>
                <View style={styles.logoutIconContainer}>
                  <Icon name="logout" size={24} color="#EF4444" />
                </View>
                <Text style={styles.logoutTitle}>Note</Text>
                <Text style={styles.logoutMessage}>
                  Selected Vehicle is unavailable{'\n'}
                  try another Vehicle
                </Text>

                <View style={styles.logoutButtons}>
                  <TouchableOpacity
                    style={styles.logoutCancelButton}
                    onPress={handleCancelLogout}
                  >
                    <Text style={styles.logoutCancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.logoutConfirmButton}
                    onPress={handleLogout}
                  >
                    <Text style={styles.logoutConfirmText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    top: -10,
  },
  profileCard: {
    backgroundColor: '#ffff', // light/transparent background
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: '50%',
    marginTop: 10,
    alignSelf: 'center',
    position: 'absolute',
    top: '60%',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 12,
  },
  userName: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '800',
    color: '#4a4a4a',
    fontFamily: Fonts.family.regular,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    marginTop: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomColor: '#F3F4F6',
  },

  activeMenuItem: {
    borderLeftWidth: 7,
    borderLeftColor: '#7518AA',
    borderRadius: 10,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    fontWeight: '800',
    fontFamily: Fonts.family.regular,
  },
  activeMenuText: {
    color: '#7518AA',
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
  activeTabLabel: {
    color: '#8B5CF6',
    fontFamily: Fonts.family.regular,
  },

  // Logout Popup Styles
  logoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  logoutPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    fontFamily: Fonts.family.regular,
  },
  logoutMessage: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    fontFamily: Fonts.family.regular,
  },
  logoutButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  logoutCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoutCancelText: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Fonts.family.regular,
  },
  logoutConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#7416B2',
    alignItems: 'center',
  },
  logoutConfirmText: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Fonts.family.regular,
  },
  profileCardBackground: {
    width: '100%',
    height: 230,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
});

export default ProfileScreen;
