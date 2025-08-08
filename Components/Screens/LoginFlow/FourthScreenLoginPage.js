import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Dimensions,
  StatusBar as RNStatusBar,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const { width, height } = Dimensions.get('window');

const HealthUmbrellaScreen = () => {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      <StatusBar backgroundColor={Colors.statusBar} barStyle="light-content" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          {/* Skip Button */}
          <View style={styles.skipContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Login6')}>
              <Text style={styles.skipText}>Skip ⏭</Text>
            </TouchableOpacity>
          </View>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoRow1}>
              <View style={styles.logoRow}>
                <Image
                  source={require('../../Assets/logos.png')}
                  style={styles.logoImage}
                />
              </View>
              <View>
                <Text style={styles.logoTitle}>Health</Text>
                <Text style={styles.logoTitle}>Umbrella</Text>
              </View>
            </View>

            {/* Title and Subtitle */}
            <View style={styles.centeredContent}>
              <Text style={styles.title}>Book Your Physiotherapist</Text>
              <Text style={styles.subtitle}>
               Home Visit / Clinic Appointment
              </Text>
            </View>
          </View>
        </ScrollView>

       
        <View style={styles.bottomImageContainer}>
          <Image
            source={require('../../Assets/fourthscreen.png')}
            style={styles.bottomImage}
          />
          
        </View>
        
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HealthUmbrellaScreen;

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
  },
  skipContainer: {
    alignItems: 'flex-end',
    padding: 16,
  },
  skipText: {
    color: '#555',
    fontWeight: 'bold',
     fontFamily:Fonts.family.regular,
        fontSize:  Fonts.size.PageHeading,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'center',
  },
  logoImage: {
    width: 70,
    height: 70,
    marginRight: 8,
  },
  logoTitle: {
    fontSize:  Fonts.size.FlashScreenSubHeading,
    color: Colors.statusBar,
    fontWeight: '700',
    fontFamily:Fonts.family.regular,
  },
  centeredContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  title: {
     fontSize:  Fonts.size.FlashScreenHeader,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
     fontFamily:Fonts.family.regular
  },
  subtitle: {
     fontSize:  Fonts.size.PageHeading,
    color: '#666',
    textAlign: 'center',
      fontWeight: '500',
     top:20
  },
  logoRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    top: 10,
  },
   bottomImageContainer: {
   
    bottom: '10%',
    width: width,
   
  },
  bottomImage: {
    width: width * 1,
    height: width * 1.2,
    resizeMode: 'contain',
    top:'10%'
  },
});
