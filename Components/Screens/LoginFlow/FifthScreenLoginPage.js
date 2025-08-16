import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Fonts/Fonts';
const { width, height } = Dimensions.get('window');
import Colors from '../../Colors/Colors';
export default function Onboarding() {
  const navigation = useNavigation();

  return (
    <>
      {/* StatusBar config */}
      <StatusBar backgroundColor={Colors.statusBar} barStyle="light-content" translucent />

      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.safeArea}>
          <View
            style={[
              styles.container,
              Platform.OS === 'android' && { paddingTop: StatusBar.currentHeight },
            ]}
          >
            {/* Skip Button */}
            <View style={styles.skipContainer}>
              <TouchableOpacity onPress={() => navigation.navigate('Login6')}>
                <Text style={styles.skipText}>Skip ⏭</Text>
              </TouchableOpacity>
            </View>

            {/* Logo and Title */}
            <View style={styles.logoRow1}>
              <View style={styles.logoRow}>
                <Image
                  source={require('../../Assets/logos.png')}
                  style={styles.logoImage}
                />
              </View>
              <View style={{ top: 12 }}>
                <Text style={styles.logoText}>Health</Text>
                <Text style={styles.logoText}>Umbrella</Text>
              </View>
            </View>

            <Text style={styles.title2}>A - Z Healthcare Services</Text>
            <Text style={styles.title1}>Connect with us for all your emergency and routine healthcare needs.</Text>

           
        
            {/* Center Circle Image */}
            <View style={styles.spinContainer}>
              <Image
                source={require('../../Assets/log.png')}
                style={styles.spinImage}
              />
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
      paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title2: {
    textAlign: 'center',
  fontSize:  Fonts.size.FlashScreenHeader,
     fontWeight: '700',
    marginTop: height * 0.01,
    color:Colors.black ,
     fontFamily:Fonts.family.regular,
  },
  title1: {
    textAlign: 'center',
        fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    marginTop: height * 0.01,
    color: '#4D4C4C',
   
     top:10
  },
  description: {
    fontSize: width * 0.04,
    textAlign: 'center',
  
    color: '#ffff',
    paddingHorizontal: 20,
    lineHeight: 22,
   
  },
  spinContainer: {
   
   
  },
  spinImage: {
    width: width * 1,
    height: width *1.29,
    resizeMode: 'contain',
   top:'20%',
   left:2
  },
  skipContainer: {
    position: 'absolute',
    top: height * 0.02,
    right: width * 0.05,
    zIndex: 1,
  },
  skipText: {
    color: '#555',
    fontWeight: 'bold',
     fontSize:  Fonts.size.PageHeading,
     fontFamily:Fonts.family.regular
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.03,
    marginBottom: height * 0.01,
    justifyContent: 'center',
  },
  logoImage: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  logoText: {
   fontSize:  Fonts.size.FlashScreenSubHeading,
    color: Colors.statusBar,
    fontWeight: '700',
     fontFamily:Fonts.family.regular
  },
  logoRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
});
