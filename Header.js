import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from './Components/Fonts/Fonts';

const CustomHeader = ({ username = 'Akash Ambulance', onNotificationPress, onWalletPress }) => {

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
          <Text style={styles.usernameText}>GokulRaja</Text>
        </View>
      </View>

      {/* Notification and Wallet Icons */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#000000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onWalletPress}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color="#B04FE8" style={styles.icon} />
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
  },
  icon: {
    marginLeft: 16,
    borderWidth:1,
    borderRadius:20,
    padding:5,
    borderColor:'#ffffff',
    backgroundColor:'#ffffff'
  },
});

export default CustomHeader;
