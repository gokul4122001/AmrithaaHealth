import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Image,SafeAreaView
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import logo from '../../Assets/logos.png';
import Icons from 'react-native-vector-icons/Feather';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const HospitalListingScreen = ({ navigation }) => {
  const hospitalData = [
    {
      id: 1,
      name: 'Bavaa Medicals',
      timing: 'Open 10:00 am to 10:00 pm',
      address: 'No.29, 1 street, West Mambalam, Chennai - 33',
      image: require('../../Assets/Hospital.png'), // Replace with your hospital image
      rating: '4.3',
      patientName: 'Sanjay Kumar. S',
      mobile: '9345664547',
      age: '22',
      gender: 'Male',
      date: '28/03/2023',
      time: '05:00 PM',
      reason: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      id: 2,
      name: 'Bavaa Medicals',
      timing: 'Open 10:00 am to 10:00 pm',
      address: 'No.29, 1 street, West Mambalam, Chennai - 33',
      image: require('../../Assets/Hospital.png'),
      rating: '4.3',
      patientName: 'Sanjay Kumar. S',
      mobile: '9345664547',
      age: '22',
      gender: 'Male',
      date: '28/03/2023',
      time: '05:00 PM',
      reason: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
    {
      id: 3,
      name: 'Bavaa Medicals',
      timing: 'Open 10:00 am to 10:00 pm',
      address: 'No.29, 1 street, West Mambalam, Chennai - 33',
      image: require('../../Assets/Hospital.png'),
      rating: '4.3',
      patientName: 'Sanjay Kumar. S',
      mobile: '9345664547',
      age: '22',
      gender: 'Male',
      date: '28/03/2023',
      time: '05:00 PM',
      reason: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    },
  ];

  const HospitalCard = ({ hospital }) => (
    <TouchableOpacity >
    <View style={styles.cardContainer}>
      <View style={styles.hospitalInfoSection}>
        <Image source={hospital.image} style={styles.hospitalImage} />
        <View style={styles.hospitalDetails}>
          <Text style={styles.hospitalName}>{hospital.name}</Text>
          <Text style={styles.hospitalTiming}>{hospital.timing}</Text>
          <View style={styles.addressContainer}>
            <Entypo name="location-pin" size={14} color="#FF6B6B" />
            <Text style={styles.address}>{hospital.address}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <AntDesign name="star" size={14} color="#FFD700" />
            <Text style={styles.rating}>{hospital.rating}</Text>
            <TouchableOpacity style={styles.viewDetailsButton}>
              <Text style={styles.viewDetailsText}>View Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.patientInfoSection}>
        <View style={styles.patientRow}>
          <Text style={styles.patientLabel}>Name:</Text>
          <Text style={styles.patientValue}>{hospital.patientName}</Text>
        </View>
        <View style={styles.patientRow}>
          <Text style={styles.patientLabel}>Mobile:</Text>
          <Text style={styles.patientValue}>{hospital.mobile}</Text>
        </View>
        <View style={styles.patientDetailsRow}>
          <View style={styles.patientDetail}>
            <Text style={styles.patientLabel}>Age:</Text>
            <Text style={styles.patientValue}>{hospital.age}</Text>
          </View>
          <View style={styles.patientDetail}>
            <Text style={styles.patientLabel}>Gender:</Text>
            <Text style={styles.patientValue}>{hospital.gender}</Text>
          </View>
        </View>
        <View style={styles.patientDetailsRow}>
          <View style={styles.patientDetail}>
            <Text style={styles.patientLabel}>Date:</Text>
            <Text style={styles.patientValue}>{hospital.date}</Text>
          </View>
          <View style={styles.patientDetail}>
            <Text style={styles.patientLabel}>Time:</Text>
            <Text style={styles.patientValue}>{hospital.time}</Text>
          </View>
        </View>
        <View style={styles.reasonContainer}>
          <Text style={styles.patientLabel}>Reason:</Text>
          <Text style={styles.reasonText}>{hospital.reason}</Text>
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
      
    

      {/* Title Section */}
     
<View style={styles.titleSection}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Icon name="chevron-left" size={24} color="#000" style={{ marginRight: 8 }} />
  </TouchableOpacity>
  <Text style={styles.titleText}>List of enquiry</Text>
</View>
<Text style={styles.subtitleText}>Hospital</Text>
      {/* Hospital List */}
    <ScrollView 
  style={styles.scrollContainer}
  contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]} // adjust the value as needed
  showsVerticalScrollIndicator={false}
>

        {hospitalData.map((hospital) => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </ScrollView>
     </LinearGradient>
         </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
 
 titleSection: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingBottom:20,
  paddingTop: 20,
},
  titleText: {
       fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
     fontFamily:Fonts.family.regular
  },
  subtitleText: {
     fontSize:  Fonts.size.PageHeading,
    color: '#7416B2',
    fontWeight: '800',
   textAlign:'center',
    fontFamily:Fonts.family.regular
  },
  // scrollContainer: {
  // top:'5%'
  // },
  scrollContent: {
    padding: 16,
    
  },
 cardContainer: {
  backgroundColor: '#FFF',
  borderRadius: 12,
  marginBottom: 40,
  padding: 16,
  width: '100%',
  paddingBottom: 30,

  // iOS shadow
  shadowColor: '#000',
  shadowOffset: {
    width: 1,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 3.84,

  // Android shadow
  elevation: 2,
 
},
  hospitalInfoSection: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  hospitalImage: {
    width: 100,
    height: 150,
    borderRadius: 8,
    marginRight: 12,
  },
  hospitalDetails: {
    flex: 1,
  },
  hospitalName: {
     fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
     fontFamily:Fonts.family.regular
  },
  hospitalTiming: {
      fontSize:  Fonts.size.PageSubheading,
    color: '#4CAF50',
    fontWeight: '500',
    marginBottom: 4,
     fontFamily:Fonts.family.regular
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  address: {
    fontSize:  Fonts.size.PageSubheading,
    color: '#666',
    marginLeft: 4,
    flex: 1,
     fontFamily:Fonts.family.regular
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rating: {
     fontSize:  Fonts.size.PageSubheading,
    fontWeight: 'bold',
    color: '#333',
     fontFamily:Fonts.family.regular,
     right:22
  },
  viewDetailsButton: {
    backgroundColor: '#8E24AA',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  viewDetailsText: {
   fontSize:  Fonts.size.PageSubheading,
    color: '#FFF',
    fontWeight: '500',
     fontFamily:Fonts.family.regular
  },
  patientInfoSection: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
  },
  patientRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  patientDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  patientDetail: {
    flexDirection: 'row',
    flex: 1,
  },
  patientLabel: {
    fontSize:  Fonts.size.PageSubheading,
    fontWeight: '500',
    color: '#666',
    marginRight: 8,
     fontFamily:Fonts.family.regular
  },
  patientValue: {
    fontSize:  Fonts.size.PageSubheading,
    color: '#333',
    fontWeight: '500',
     fontFamily:Fonts.family.regular
  },
  reasonContainer: {
    marginTop: 4,
  },
  reasonText: {
    fontSize:  Fonts.size.PageHeading,
    color: '#666',
    lineHeight: 16,
    marginTop: 4,
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

export default HospitalListingScreen;