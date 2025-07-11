// screens/MyReportsScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const MyReportsScreen = ({ navigation }) => {
  const services = [
    {
      id: '1',
      name: 'Hospital',
      image: require('../../Assets/report1.png'),
      screen: 'ListofHospitals',
    },
    {
      id: '2',
      name: 'Clinics',
      image: require('../../Assets/report2.png'),
      screen: 'ClinicsScreen',
    },
    {
      id: '3',
      name: 'Blood Bank',
      image: require('../../Assets/report3.png'),
      screen: 'BloodBankScreen',
    },
    {
      id: '4',
      name: 'Pharmacy',
      image: require('../../Assets/report4.png'),
      screen: 'PharmacyScreen',
    },
    {
      id: '5',
      name: 'Medical Equipment',
      image: require('../../Assets/report5.png'),
      screen: 'MedicalEquipmentScreen',
    },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        if (item.screen) {
          navigation.navigate(item.screen);
        }
      }}
      style={styles.cardContainer}
    >
      <Image source={item.image} style={styles.cardImage} />
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

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

        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name="chevron-back" size={24} />
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>My Reports</Text>
        </View>

        <Text style={styles.serviceLabel}>Service</Text>
        <FlatList
          data={services}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          columnWrapperStyle={styles.columnWrapper}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FF',
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
    marginLeft: wp('2%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 20,
  },
  sectionTitle: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: 10,
     fontFamily:Fonts.family.regular
  },
  serviceLabel: {
    fontSize:  Fonts.size.PageHeading,
    fontWeight: '700',
    marginVertical: 10,
    color: '#000',
    marginHorizontal: 13,
     fontFamily:Fonts.family.regular
  },
  gridContainer: {
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  cardContainer: {
    alignItems: 'center',
    marginHorizontal: wp('3%'),
    marginBottom: hp('2%'),
    width: wp('26%'), // Ensures 3 items per row with margin
  },
  cardImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  cardText: {
      fontSize:  Fonts.size.PageHeading,
    color: '#4a4a4a',
    textAlign: 'center',
    fontWeight: '600',
     fontFamily:Fonts.family.regular
  },
});

export default MyReportsScreen;
