import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,

} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const Header = () => {
  return (
   <>
     
    <LinearGradient
             colors={['#ffffff', '#C3DFFF']}
             start={{ x: 0.1, y: 0 }}
             end={{ x: 1, y: 0 }}
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
                     
                           </LinearGradient>
                           </>
                        
  )
}

export default Header

const styles = StyleSheet.create({
     
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
    fontSize: hp('2%'),
    color: 'black',
    opacity: 0.9,
  },
  userName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: 'black',
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
})