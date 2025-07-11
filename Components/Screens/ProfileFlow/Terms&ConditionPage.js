import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,SafeAreaView
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import logo from '../../Assets/logos.png';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const TermsAndConditionsScreen = ({ navigation }) => {
  const termsContent = `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more or less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more or less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy.`;

  return (
   
         <SafeAreaView style={styles.container}>
  <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
       <LinearGradient
                 colors={['#ffffff', '#C3DFFF']}
        start={{ x: -0, y: 0.3 }}
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
      

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6 name="angle-left" size={18} color="black" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Terms and Conditions</Text>
          </View>
  <ScrollView 
  
  contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} 
  showsVerticalScrollIndicator={false}
>
          <View style={styles.contentBody}>
            <Text style={styles.contentText}>{termsContent}</Text>
          </View>
        </ScrollView>
        </View>
       
        </LinearGradient>
           </SafeAreaView>
   
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  statusBarBackground: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#8B5CF6',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerGradient: {
    paddingBottom: hp('2%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
  },
  logoContainer: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: wp('8%'),
    height: wp('8%'),
    resizeMode: 'contain',
    tintColor: 'white',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
 
  userName: {
    fontSize: hp('2%'),
    fontWeight: 'bold',
    color: 'white',
     fontFamily:Fonts.family.regular
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  alarmButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
   top:10
  },
  backButton: {
    marginRight: wp('3%'),
    padding: 8,
  },
  pageTitle: {
  fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
     fontFamily:Fonts.family.regular
  },
  contentBody: {
  top:20,
  
  
  },
  contentText: {
  fontSize:  Fonts.size.PageSubheading,
    lineHeight: hp('3%'),
    color: '#4a4a4a',
    textAlign: 'justify',
    fontWeight:'600',
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
});