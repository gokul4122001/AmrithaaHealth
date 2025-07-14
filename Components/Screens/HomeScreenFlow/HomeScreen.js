import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Iconed from 'react-native-vector-icons/MaterialCommunityIcons';
import { useState, useRef } from 'react';
import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';

const { width: screenWidth } = Dimensions.get('window');

const services = [
  { title: 'Ambulance', image: require('../../Assets/HomeAmbulance.png'), screen: 'AmbulanceBookingScreen' },
  { title: 'Home care Nursing', image: require('../../Assets/Homecarenursing.png') },
  { title: 'Physiotherapy', image: require('../../Assets/phisiotherapy.png') },
  { title: 'Lab', image: require('../../Assets/lap.png') },
  { title: 'Funeral & Mortuary Service', image: require('../../Assets/murchary.png') },
  { title: 'Emergency', image: require('../../Assets/emergency.png') },
];

const listings = [
  { title: 'Hospital', image: require('../../Assets/report1.png') },
  { title: 'Clinics', image: require('../../Assets/report2.png') },
  { title: 'Blood Bank', image: require('../../Assets/report3.png') },
  { title: 'Pharmacy', image: require('../../Assets/report4.png') },
  { title: 'Medical Equipment', image: require('../../Assets/report5.png') },
];

const transactions = [
  { service: 'Pharmacy', date: 'April 2, 2025', amount: '- ₹150', icon: require('../../Assets/tr1.png'), bgColor: '#DFFFEF' },
  { service: 'Physiotherapy', date: 'April 5, 2025', amount: '- ₹1,550', icon: require('../../Assets/tr2.png'), bgColor: '#D6FFFC' },
  { service: 'Home care Nursing', date: 'April 20, 2025', amount: '- ₹550', icon: require('../../Assets/tr3.png'), bgColor: '#E8E6FF' },
  { service: 'Pharmacy', date: 'April 2, 2025', amount: '- ₹150', icon: require('../../Assets/tr1.png'), bgColor: '#DFFFEF' },
];

// Schedule data for swipeable cards
const scheduleData = [
  {
    id: 1,
    doctorName: 'Dr. Gokul Raja',
    specialty: 'Physiotherapy',
    date: 'Monday, 17 March',
    time: '09:00 to 10:30',
    avatar: require('../../Assets/profile.png'),
    phoneIcon: require('../../Assets/calling.png'),
  },
  {
    id: 2,
    doctorName: 'Dr. Saran Kumar',
    specialty: 'Cardiology',
    date: 'Tuesday, 18 March',
    time: '11:00 to 12:00',
    avatar: require('../../Assets/profile.png'),
    phoneIcon: require('../../Assets/calling.png'),
  },
  {
    id: 3,
    doctorName: 'Dr. Anandtha ',
    specialty: 'Orthopedics',
    date: 'Wednesday, 19 March',
    time: '14:00 to 15:30',
    avatar: require('../../Assets/profile.png'),
    phoneIcon: require('../../Assets/calling.png'),
  },
  {
    id: 4,
    doctorName: 'Dr. Emily Davis',
    specialty: 'Dermatology',
    date: 'Thursday, 20 March',
    time: '10:00 to 11:00',
    avatar: require('../../Assets/profile.png'),
    phoneIcon: require('../../Assets/calling.png'),
  },
];

export default function App({ navigation }) {
  const [showAll, setShowAll] = useState(false);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 2);

  const handleCardPress = () => {
    // Move to next card, loop back to 0 when reaching the end
    setCurrentScheduleIndex((prevIndex) => (prevIndex + 1) % scheduleData.length);
  };

  const ScheduleCard = ({ item }) => (
    <View style={styles.scheduleCard}>
      <View style={styles.scheduleHeader}>
        <Image source={item.avatar} style={styles.scheduleAvatar} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={styles.doctorName}>{item.doctorName}</Text>
          <Text style={styles.specialty}>{item.specialty}</Text>
        </View>
        <TouchableOpacity>
          <Image source={item.phoneIcon} style={styles.phoneIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleDetailsRow}>
          <View style={styles.dateBox}>
            <Iconed name="calendar-month-outline" size={20} color="#555" />
            <Text style={styles.scheduleText}>{item.date}</Text>
          </View>

          <View style={styles.timeBox}>
            <Iconed name="clock-outline" size={20} color="#555" />
            <Text style={styles.scheduleText}>{item.time}</Text>
          </View>
        </View>
      </View>
    </View>
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

        {/* Search */}
        <View style={styles.searchContainer}>
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchBox}
            placeholder="Search for your service"
            placeholderTextColor="#888"
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          {/* Services */}
          <Text style={styles.sectionTitle}>Book Your Services</Text>
          <View style={styles.grid}>
            {services.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.card}
                onPress={() => {
                  if (item.screen) {
                    navigation.navigate(item.screen);
                  }
                }}
              >
                <Image source={item.image} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
            {services.length % 3 === 2 && <View style={styles.card} />}
          </View>

          {/* Listings */}
          <Text style={styles.sectionTitle}>Listing</Text>
          <View style={styles.grid}>
            {listings.map((item, index) => (
              <View key={index} style={styles.card}>
                <Image source={item.image} style={styles.cardImage} />
                <Text style={styles.cardTitle}>{item.title}</Text>
              </View>
            ))}
            {listings.length % 3 === 2 && <View style={styles.card} />}
          </View>

          {/* Stacked Swipeable Schedule Cards */}
          <Text style={styles.sectionTitle}>Upcoming Schedule</Text>
          
          <View style={styles.stackedCardsContainer}>
            {scheduleData.map((item, index) => {
              const isVisible = index >= currentScheduleIndex;
              const cardIndex = index - currentScheduleIndex;
              
              if (!isVisible) return null;
              
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.stackedCard,
                    {
                      zIndex: scheduleData.length - index,
                      transform: [
                        { translateY: cardIndex * 8 },
                        { scale: 1 - cardIndex * 0.02 },
                      ],
                      opacity: cardIndex < 3 ? 1 - cardIndex * 0.1 : 0,
                    }
                  ]}
                  onPress={handleCardPress}
                  disabled={index !== currentScheduleIndex}
                >
                  <ScheduleCard item={item} />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Transactions */}
          <View style={styles.containers}>
            <View style={styles.headers}>
              <Text style={styles.sectionTitle}>Transactions</Text>
              <TouchableOpacity onPress={() => setShowAll(!showAll)}>
                <Text style={styles.seeAll}>{showAll ? 'See less' : 'See all'}</Text>
              </TouchableOpacity>
            </View>

            {displayedTransactions.map((item, index) => (
              <View key={index} style={styles.transactionCard}>
                <View style={[styles.iconContainer, { backgroundColor: item.bgColor }]}>
                  <Image source={item.icon} style={styles.transactionIcon} />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.transactionTitle}>{item.service}</Text>
                  <Text style={styles.transactionDate}>{item.date}</Text>
                </View>
                <Text style={styles.transactionAmount}>{item.amount}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    height: 60,
    marginTop: 20
  },
  searchIcon: {
    marginRight: 8,
  },
  searchBox: {
    flex: 1,
    fontSize: Fonts.size.PageSubheading,
    color: '#000',
  },
  
  // Stacked Schedule Card Styles
  stackedCardsContainer: {
    height: 200,
    position: 'relative',
    top:'1%'
  
  },
  stackedCard: {
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
  },
  scheduleCard: {
    backgroundColor: '#6A1B9A',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    shadowColor: '#ffffff',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10
  },
  scheduleAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  doctorName: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.PageSubheading
  },
  specialty: {
    color: '#ddd',
    fontFamily: Fonts.family.regular,
    fontSize: Fonts.size.PageSubSubHeading
  },
  phoneIcon: {
    width: 34,
    height: 34,
  },
  scheduleContainer: {
    marginTop: 10,
  },
  scheduleDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 40,
    marginRight: 5,
  },
  timeBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 40,
    marginLeft: 5,
  },
  scheduleText: {
    marginLeft: 8,
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#333',
    fontFamily: Fonts.family.regular,
  },

  // Existing Styles
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '30%',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardImage: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  cardTitle: {
    marginTop: 5,
    fontSize: Fonts.size.PageSubheading,
    textAlign: 'center',
    fontWeight: '500',
    color: '#000000'
  },
  topBackground: {
    paddingTop: hp('5%'),
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
    fontSize: Fonts.size.TopHeading,
    color: 'black',
    fontWeight: '500'
  },
  userName: {
    fontSize: Fonts.size.TopSubheading,
    fontWeight: '700',
    color: '#000000',
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containers: {
    padding: 10,
    paddingBottom: 50
  },
  headers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    marginBottom: 15,
    color: 'black'
  },
  seeAll: {
    fontSize: Fonts.size.PageSubheading,
    color: '#4E4E4E',
    fontWeight: '500',
    fontFamily: Fonts.family.regular
  },
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  transactionTitle: {
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#888',
    marginTop: 2,
  },
  transactionAmount: {
    color: '#4E4E4E',
    fontSize: Fonts.size.PageSubheading,
  },
});