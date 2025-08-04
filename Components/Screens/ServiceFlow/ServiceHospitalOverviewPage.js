import React, { useState } from 'react';
import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import logo from '../../Assets/logos.png'; // update this path
import Colors from '../../Colors/Colors'; // update this path
import Fonts from '../../Fonts/Fonts';

const AccidentScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const hospitals = [
    {
      id: 1,
      name: 'Dr. Kamakshi Memorial Hospital',
      timing: 'Open 24 hours',
      address: 'No 3/1, 1 street, West Mambalam, Chennai- 33',
      Image: require('../../Assets/Hospital.png'),
      route: 'ServiceHospitalDetailScreen',
      rating: '4.3',
    },
    {
      id: 2,
      name: 'Apollo Speciality Hospital',
      timing: 'Open 24 hours',
      address: 'Mount Road, Chennai',
      Image: require('../../Assets/Hospital.png'),
      route: 'StrokeScreen',
      rating: '4.3',
    },
    {
      id: 3,
      name: 'Kovai Medical Center',
      timing: 'Open 24 hours',
      address: 'Coimbatore',
      Image: require('../../Assets/Hospital.png'),
      route: 'AccidentScreen',
      rating: '4.3',
    },
  ];

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const HospitalCard = ({ hospital }) => (
    <TouchableOpacity
      style={styles.serviceCard}
      onPress={() => navigation.navigate(hospital.route)}
    >
      <View style={{ flexDirection: 'row' }}>
        <Image style={styles.serviceIcon} source={hospital.Image} />
        <View style={[styles.serviceNameContainer, { marginLeft: 15, flex: 1 ,top:7}]}>
          <Text style={styles.serviceName}>
            {hospital.name.length > 20 ? hospital.name.substring(0, 20) + '...' : hospital.name}
          </Text>
          <Text style={styles.timing}>{hospital.timing}</Text>
          <Text style={styles.address}>
            <Entypo name="location-pin" size={16} color="red" />{' '}
            {hospital.address.length > 30 ? hospital.address.substring(0, 30) + '...' : hospital.address}
          </Text>

          <View style={styles.ratingRow}>
            <AntDesign name="star" size={14} color="gold" />
            <Text style={styles.ratingText}>{hospital.rating}</Text>
          </View>

          <View style={styles.iconGroup}>
            <TouchableOpacity style={[styles.iconCircle, { backgroundColor: '#BDEDFF' }]}>
              <Entypo name="phone" size={16} color="#043446" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconCircle, { backgroundColor: '#FDDCCE' }]}>
              <Entypo name="globe" size={16} color="#AC4A15" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconCircle, { backgroundColor: '#FFE2E2' }]}>
              <Entypo name="location-pin" size={16} color="#FF0000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
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
          <TouchableOpacity style={styles.notificationButton}>
            <Icon name="notifications-on" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'red' }]}>
            <MaterialCommunityIcons name="alarm-light-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Page Title */}
        <View style={styles.pageTitle}>
          <FontAwesome6 name="angle-left" size={16} color="black" />
          <Text style={styles.type}>Hospital</Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholder="By doctor, hospital, city, pincode..."
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationRow}>
          <Entypo name="location-pin" size={20} color="red" />
          <Text style={styles.locationLabel}>Your Location: </Text>
          <Text style={styles.locationText}>
            {'West Mambalam, Chennai - 33'.length > 20
              ? 'West Mambalam, Chennai...'
              : 'West Mambalam, Chennai - 33'}
          </Text>
        </View>

        {/* Scrollable Hospital Cards */}
        <ScrollView contentContainerStyle={styles.scrollCardsOnly} showsVerticalScrollIndicator={false}>
          {filteredHospitals.map((item, index) => (
            <HospitalCard key={index} hospital={item} />
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AccidentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
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
  },
  userName: {
    fontSize:  Fonts.size.TopSubheading,
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
    marginLeft: 8,
  },
  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('3%'),
  },
  type: {
       fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
    color: '#7416B2',
    marginLeft: 10,
    position: 'absolute',
    left: '40%',
  },
  searchContainer: {
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: wp('7%'),
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: wp('2%'),
    fontSize:  Fonts.size.PageHeading,
    color: '#333',
  },
  locationRow: {
    flexDirection: 'row',
    marginHorizontal: wp('5%'),
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  locationLabel: {
    fontSize:  Fonts.size.PageHeading,

    fontWeight: '500',
    color: '#535a5b',
  },
  locationText: {
       fontSize:  Fonts.size.PageSubheading,
    fontWeight: '500',
    color: '#000',
    textDecorationLine: 'underline',
  },
  scrollCardsOnly: {
    paddingBottom: hp('5%'),
    paddingTop: hp('1%'),
  },
  serviceCard: {
    width: wp('90%'),
    height: hp('20%'),
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    padding: wp('3%'),
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  serviceIcon: {
    width: 100,
    height:150,
    borderRadius: wp('1%'),
  },
  serviceNameContainer: {
    flexDirection: 'column',
  },
  serviceName: {
      fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
    color: '#333',
    flexWrap: 'wrap',
  },
  timing: {
     fontSize:  Fonts.size.PageSubheading,

    color: '#177C1B',
    marginTop: hp('0.5%'),
    fontWeight: 'bold',
  },
  address: {
      fontSize:  Fonts.size.PageSubheading,

    color: '#555',
    marginTop: hp('0.5%'),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  ratingText: {
        fontSize:  Fonts.size.PageSubheading,

    color: '#000',
    marginLeft: wp('1%'),
  },
  iconGroup: {
    flexDirection: 'row',
    marginTop: hp('1.5%'),
    gap: wp('4%'),
    left:10
  },
  iconCircle: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
