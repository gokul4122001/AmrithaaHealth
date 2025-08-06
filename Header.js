import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fonts from './Components/Fonts/Fonts';
import { useSelector } from 'react-redux';

const CustomHeader = ({ username = 'Akash Ambulance', onNotificationPress, onImagePress }) => {
  const UserProfile = useSelector(state => state.auth.UserProfile);

  return (
    <View style={styles.headerContainer}>
      {/* Logo & Welcome Message */}
      <View style={styles.leftSection}>
        <Image
          source={require('./Components/Assets/logos.png')}
          style={styles.logo}
        />
        <View style={{ marginLeft: 10 }}>
          <Text style={styles.welcomeText}>Hi, Welcome</Text>
          <Text style={styles.usernameText}>{UserProfile?.name || "UserName"}</Text>
        </View>
      </View>

      {/* Notification Icon and Image */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#000000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onImagePress}>
          <Image
            source={require('./Components/Assets/emergencyicon.png')} // Replace with your image path
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: Fonts.size.TopHeading,
    color: '#444',
  },
  usernameText: {
    fontSize: Fonts.size.TopSubheading,
    fontWeight: 'bold',
    color: '#000',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 16,
    borderWidth: 1,
    borderRadius: 20,
    padding: 7,
    borderColor: '#ffffff',
    backgroundColor: '#ffffff',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 15,
    marginLeft: 16,
  },
});

export default CustomHeader;
