import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSelector } from 'react-redux';

import { Term_Condition } from '../APICall/ProfileApi';
import CustomHeader from '../../../Header'; 
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';

const TermsAndConditionsScreen = ({ navigation }) => {
  const token = useSelector(state => state.auth.token);
  const [terms, setTerms] = useState({});

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const data = await Term_Condition(token);
        setTerms(data?.terms_conditions || {});
      } catch (err) {
        console.error('Error fetching Terms & Conditions:', err);
      }
    };
    fetchTerms();
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.gradientBackground}
      >

        {/* ✅ Reusable Header */}
        <CustomHeader
          onNotificationPress={() => console.log("Notification Pressed")}
          onImagePress={() => console.log("Emergency Icon Pressed")}
        />

        {/* Title */}
        <View style={styles.titleContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <FontAwesome6 name="angle-left" size={18} color="black" />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>
            {terms?.name || 'Terms & Conditions'}
          </Text>
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.contentText}>
            {terms?.message || 'No terms and conditions found.'}
          </Text>
        </ScrollView>

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
  gradientBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  backButton: {
    padding: 6,
    marginRight: wp('2%'),
  },
  pageTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: Fonts.family.regular,
    flex: 1,
  },
  scrollView: {
    paddingVertical: hp('2%'),
    paddingBottom: hp('10%'),
    paddingHorizontal: wp('3%'),
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
