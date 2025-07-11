import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import logo from '../../Assets/logos.png';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import Icons from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';

const { height } = Dimensions.get('window');

const AmbulanceSelectionScreen = ({ navigation }) => {
  const [userName] = useState('Jeswanth Kumar');
  const [pickup] = useState('West Mambalam, Chennai L-33');
  const [destination] = useState('Apollo Hospital, Thousand Lights, Chennai');
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);

  const ambulanceOptions = [
    {
      id: 'large',
      type: 'Large',
      description: 'Tempo traveller, Force, etc.',
      price: '₹ 2,500',
      color: '#8B5CF6',
      minutes: 35,
      includes: 'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'basic',
      type: 'Basic life support',
      price: '₹ 2,000',
      color: '#8B5CF6',
      minutes: 15,
      includes: 'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'advance',
      type: 'Advance life support',
      price: '₹ 2,000',
      color: '#8B5CF6',
      minutes: 15,
      includes: 'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Ventilator support with nursing Support',
    },
    
  ];

  const handleSelectAmbulance = (ambulanceId) => {
    setSelectedAmbulance(ambulanceId);
  };

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
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { right: hp('2%') }]}>
            <Icons name="notifications-on" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'red' }]}>
            <MaterialCommunityIcons name="alarm-light-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        <View style={styles.locationContainer}>
          <View style={styles.locationRow}>
            <View style={styles.greenDot} />
            <Text style={styles.locationText}>{pickup}</Text>
          </View>
          <View style={styles.locationRow}>
            <View style={styles.redDot} />
            <Text style={styles.locationText}>{destination}</Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <View style={styles.routeVisualization}>
              <View style={styles.routeStart} />
              <View style={styles.routePath} />
              <View style={styles.routeEnd} />
            </View>
          </View>
        </View>

        {/* Bottom Modal */}
        <Animatable.View animation="slideInUp" style={styles.bottomModal}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}   contentContainerStyle={{ paddingBottom: 100 }}>
           <View style={styles.noteSection}>
  <Icon name="arrow-back" size={20} color="#000" />
  <Text style={styles.noteTitle}>Select the Ambulance</Text>
</View>


            {/* Transfer Dropdown */}
            <View style={styles.transferSection}>
              <View style={styles.transferRow}>
                <Image source={require('../../Assets/ambualnce.png')} style={styles.ambulanceIcon} />
                <View style={styles.transferTextContainer}>
                  <Text style={styles.transferText}>Patient transfer</Text>
                </View>
                <TouchableOpacity style={styles.dropdownButton}>
                  <Icons name="keyboard-arrow-down" size={24} color="#666666" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Ambulance Cards */}
            <View style={styles.optionsContainer}>
              {ambulanceOptions.map((option) => {
                const isSelected = selectedAmbulance === option.id;
                return (
                  <View key={option.id} style={[
                    styles.optionCard,
                    isSelected && styles.selectedOptionCard,
                  ]}>
                    <TouchableOpacity onPress={() => handleSelectAmbulance(option.id)}>
                      <View style={styles.optionHeader}>
                        <View style={styles.optionLeft}>
                          <View style={[styles.minutesBadge, { backgroundColor: option.color }]}>
                            <Text style={styles.minutesText}>{option.minutes}</Text>
                          </View>
                         <View style={styles.optionInfo}>
  <View style={styles.typeRow}>
    <Image
      source={require('../../Assets/ambualnce.png')} // Replace with your image path
      style={styles.typeIcon}
    />
    <Text style={styles.optionType}>{option.type}</Text>
  </View>

  {option.description ? (
    <Text style={styles.optionDescription}>{option.description}</Text>
  ) : null}

  <Text style={styles.optionTime}>{option.minutes} mins</Text>
</View>

                        </View>
                        <Text style={styles.optionPrice}>{option.price}</Text>
                      </View>
                      <View style={styles.includesSection}>
                        <Text style={styles.includesTitle}>Includes :</Text>
                        <Text style={styles.includesText}>{option.includes}</Text>
                      </View>
                    </TouchableOpacity>

                    {/* Inline Booking Button */}
                    {isSelected && (
                      <TouchableOpacity
                        style={styles.inlineBookingButton}
                        onPress={() =>
                          navigation.navigate('BookingoverviewScreen', {
                            ambulanceType: option.type,
                            price: option.price,
                          })
                        }
                      >
                        <Text style={styles.bookNowText}>
                          Booking - {option.price}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </Animatable.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  logo: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  typeRow: {
  flexDirection: 'row',
  alignItems: 'center',
},
typeIcon: {
  width: 20,
  height: 20,
  marginRight: 8,
},
  greetingContainer: { flex: 1, marginLeft: wp('3%') },
  greeting: { fontSize: Fonts.size.TopHeading, color: 'black' },
  userName: { fontSize: Fonts.size.TopSubheading, fontWeight: 'bold', color: 'black' },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
  },
  locationContainer: { paddingHorizontal: 20, paddingVertical: 10 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  greenDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E', marginRight: 12 },
  redDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#EF4444', marginRight: 12 },
  locationText: { fontSize: Fonts.size.TopHeading, color: '#000', flex: 1 },
  mapContainer: { height: 120, marginHorizontal: 20, marginBottom: 15, borderRadius: 8, overflow: 'hidden' },
  mapPlaceholder: { flex: 1, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  routeVisualization: { flexDirection: 'row', alignItems: 'center' },
  routeStart: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#22C55E' },
  routePath: { width: 60, height: 2, backgroundColor: '#7C3AED', marginHorizontal: 10 },
  routeEnd: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#EF4444' },

  bottomModal: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.55,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '110%',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
    alignSelf: 'center'
  },
  content: { paddingHorizontal: 16 },
  noteSection: { marginTop: 12, marginBottom: 20 ,flexDirection:'row'},
  noteTitle: { fontSize: Fonts.size.PageHeading, fontWeight: '600', color: '#333', textAlign: 'center',left:10 },
  noteDescription: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 6 },
  transferSection: { marginBottom: 20 },
  transferRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: 12, backgroundColor: '#F8F9FA',
    borderRadius: 8, borderWidth: 1, borderColor: '#E5E5E5',
  },
  ambulanceIcon: { width: 80, height: 50, marginRight: 12 },
  transferTextContainer: { flex: 1 },
  transferText: { fontSize: Fonts.size.PageHeading,fontWeight: '500', color: '#333' },
  dropdownButton: { padding: 4 },

  optionsContainer: { marginBottom: 10 },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    marginBottom: 12,
  },
  selectedOptionCard: { borderColor: '#8B5CF6', borderWidth: 2 },
  optionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  minutesBadge: {
    width: 32, height: 32, borderRadius: 4,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 12,
  },
  minutesText: { color: '#fff', fontWeight: '600',fontSize: Fonts.size.PageSubSubHeading, },
  optionInfo: { flex: 1 },
  optionType: { fontSize: Fonts.size.PageHeading, fontWeight: '600', color: '#333' },
  optionDescription: { fontSize: Fonts.size.PageSubSubHeading, color: '#666' },
  optionTime: {fontSize: Fonts.size.PageSubSubHeading, color: '#7518AA', marginTop: 2 },
  optionPrice: { fontSize: Fonts.size.PageHeading, fontWeight: '600', color: '#333' },
  includesSection: { borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 8 },
  includesTitle: { fontWeight: '600', fontSize: Fonts.size.PageSubheading, color: '#333' },
  includesText: { fontSize: Fonts.size.PageSubSubHeading, color: '#666', lineHeight: 16 },

  inlineBookingButton: {
    marginTop: 10,
    backgroundColor: '#7518AA',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookNowText: {
    color: '#fff',
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '600',
  },
});

export default AmbulanceSelectionScreen;
