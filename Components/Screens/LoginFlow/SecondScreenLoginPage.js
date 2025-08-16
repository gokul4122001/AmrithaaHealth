import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  SafeAreaView,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Fonts from '../../Fonts/Fonts';
import SecoundSlide from '../LoginFlow/ThirdScreenLoginPage';
import ThirdSlide from '../LoginFlow/FourthScreenLoginPage';
import FourthSlide from '../LoginFlow/FifthScreenLoginPage';
import Colors from '../../Colors/Colors';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const navigation = useNavigation();

  const handleLastSlide = (index) => {
    if (index === 3) {
      setTimeout(() => {
        navigation.replace(''); 
      }, 1000);
    }
  };

  return (
    <Swiper
  loop={false}
  showsPagination={true}
  dotStyle={styles.dot}
  activeDotStyle={styles.activeDot}
  dotColor="#ccc" // Optional if using dotStyle
  activeDotColor="#6c1d95" // Optional if using activeDotStyle
  onIndexChanged={handleLastSlide}
>

      {/* Slide 1 */}
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientContainer}
      >
        <StatusBar backgroundColor={Colors.statusBar} barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.container}>
            {/* Skip Button */}
            <View style={styles.skipContainer}>
              <TouchableOpacity onPress={() => navigation.replace('Login6')}>
                <Text style={styles.skipText}>Skip ⏭</Text>
              </TouchableOpacity>
            </View>

            {/* Logo and Title */}
            <View style={styles.logoRow1}>
              <Image
                source={require('../../Assets/logos.png')}
                style={styles.logoImage}
              />
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.logoText}>Health</Text>
                <Text style={styles.logoText}>Umbrella</Text>
              </View>
            </View>

            {/* Headings */}
           
            <Text style={styles.title2}>All Your Health Needs</Text>
            <Text style={styles.title1}>Now you can Book services online</Text>

            {/* Description */}
            <Text style={styles.description}>
             Ambulance, HomeCare Nurse, Physiotherapist, Lab Test, 24/7 Pharmacy, Medical Equipments, Hospital, Speciality Clinics and Funeral Service
            </Text>

            {/* Center Circle Image */}
            <View style={styles.spinContainer}>
              <Image
                source={require('../../Assets/spin1.png')}
                style={styles.spinImage}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      {/* Slide 2 */}
      <View style={styles.page}>
        <SecoundSlide />
      </View>

      {/* Slide 3 */}
      <View style={styles.page}>
        <ThirdSlide />
      </View>

      {/* Slide 4 */}
      <View style={styles.page}>
        <FourthSlide />
      </View>
    </Swiper>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
     fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: 'Black',
    fontFamily: Fonts.family.regular,
  },
  title2: {
    textAlign: 'center',
  fontSize:  Fonts.size.FlashScreenHeader,
    fontWeight: '700',
    marginTop: height * 0.04,
    color:Colors.black ,
    fontFamily: Fonts.family.regular,
  },
  title1: {
    textAlign: 'center',
      fontSize:  Fonts.size.PageHeading,
    fontWeight: '700',
    marginTop: height * 0.01,
    color: Colors.black ,
    fontFamily: Fonts.family.regular,
  },
  description: {
    textAlign: 'center',
         fontSize:  Fonts.size.PageSubheading,
    marginVertical: height * 0.015,
    paddingHorizontal: width * 0.05,
    color: '#4D4C4C',
    fontFamily: Fonts.family.regular,
     lineHeight: 22, 
  },
  spinContainer: {
    marginTop: height * 0.02,
  },
  spinImage: {
    width: width * 1,
    height: width * 1,
    resizeMode: 'contain',
  },
  page: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontFamily: Fonts.family.regular,
  },
  logoRow1: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: height * 0.08,
    marginBottom: 10,
  },
  logoImage: {
    width: 70,
    height: 70,
  },
  logoText: {
      fontSize:  Fonts.size.FlashScreenSubHeading,
    color: Colors.statusBar,
    fontWeight: '800',
    fontFamily: Fonts.family.regular,
  },
   dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
    bottom:30
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#6c1d95',
    marginHorizontal: 4,
      bottom:30
  },
});
