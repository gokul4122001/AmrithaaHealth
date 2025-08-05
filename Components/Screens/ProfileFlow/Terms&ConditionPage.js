import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
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
import { Term_Condition } from '../APICall/ProfileApi';
import { useSelector } from 'react-redux';

const TermsAndConditionsScreen = ({ navigation }) => {
  const token = useSelector(state => state.auth.token);
  const [terms, setTerms] = useState('');

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await Term_Condition(token);
        // ✅ Correct key is `message` not `description`
        setTerms(data?.terms_conditions || '');
        console.log('Terms & Conditions:', data);
      } catch (err) {
        console.log('Error fetching Terms & Conditions:', err);
      }
    };

    fetchTerms();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: -0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.topBackground}
      >
        {/* Header */}
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

        {/* Page Title */}
        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <FontAwesome6 name="angle-left" size={18} color="black" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}> {terms.name }</Text>
          </View>

          {/* Content */}
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentBody}>
              <Text style={styles.contentText}>
                {terms.message}
              </Text>
            </View>
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default TermsAndConditionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
    paddingHorizontal: wp('4%'),
    paddingTop: hp('1%'),
    paddingBottom: hp('1%'),
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
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  backButton: {
    marginRight: wp('3%'),
    padding: 8,
  },
  pageTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    fontFamily: Fonts.family.regular,
  },
  scrollContent: {
    paddingTop: 20,
  },
  contentBody: {
    top: 20,
  },
  contentText: {
    fontSize: Fonts.size.PageSubheading,
    lineHeight: hp('3%'),
    color: '#4a4a4a',
    textAlign: 'justify',
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
});
