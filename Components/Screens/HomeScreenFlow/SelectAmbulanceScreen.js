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
  Dimensions,
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

const { width, height } = Dimensions.get('window');

const AmbulanceSelectionScreen = ({ navigation }) => {
  const [userName] = useState('Jeswanth Kumar');
  const [pickup] = useState('West Mambalam, Chennai L-33');
  const [destination] = useState('Apollo Hospital, Thousand Lights, Chennai');
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);
  const [isTransferSectionOpen, setIsTransferSectionOpen] = useState(false);
  const [openAmbulanceOptions, setOpenAmbulanceOptions] = useState({});

  const ambulanceOptions = [
    {
      id: 'small',
      type: 'Small',
      description: 'ECO, Omni, etc.',
      price: '₹ 1,500',
      color: '#8B5CF6',
      minutes: 15,
      includes:
        'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'large',
      type: 'Large',
      description: 'Tempo traveller, Force, etc.',
      price: '₹ 2,500',
      color: '#8B5CF6',
      minutes: 35,
      includes:
        'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'basic',
      type: 'Basic life support',
      price: '₹ 2,000',
      color: '#8B5CF6',
      minutes: 15,
      includes:
        'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'advance',
      type: 'Advance life support',
      price: '₹ 2,000',
      color: '#8B5CF6',
      minutes: 15,
      includes:
        'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Ventilator support with nursing Support',
    },
  ];

  const handleSelectAmbulance = (ambulanceId) => {
    setSelectedAmbulance(ambulanceId);
  };

  const toggleTransferSection = () => {
    setIsTransferSectionOpen(!isTransferSectionOpen);
  };

  const toggleAmbulanceOption = (ambulanceId) => {
    setOpenAmbulanceOptions(prev => ({
      ...prev,
      [ambulanceId]: !prev[ambulanceId]
    }));
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

        <View style={styles.locationContainer}>
          <View style={styles.row}>
            <View style={styles.iconColumn}>
              <View style={styles.greenDot} />
              <View style={styles.dashedLine} />
              <View style={styles.redDot} />
            </View>
            <View style={styles.textColumn}>
              <Text style={styles.locationText}>{pickup}</Text>
              <View style={styles.separator} />
              <Text style={styles.locationText}>{destination}</Text>
            </View>
          </View>
        </View>

        {/* Map */}
        <View style={styles.mapContainer}>
          <Image
            source={require('../../Assets/map.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        {/* Bottom Modal */}
        <Animatable.View animation="slideInUp" style={styles.bottomModal}>
          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <View style={styles.noteSection}>
              <Icon name="arrow-back" size={20} color="#000" />
              <Text style={styles.noteTitle}>Select the Ambulance</Text>
            </View>

            {/* Transfer Dropdown */}
            <View style={styles.transferSection}>
              <TouchableOpacity 
                style={styles.transferRow}
                onPress={toggleTransferSection}
              >
                <Image source={require('../../Assets/ambualnce.png')} style={styles.ambulanceIcon} />
                <View style={styles.transferTextContainer}>
                  <Text style={styles.transferText}>Patient transfer</Text>
                </View>
                <TouchableOpacity style={styles.dropdownButton} onPress={toggleTransferSection}>
                  <Icons 
                    name={isTransferSectionOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                    size={24} 
                    color="#666666" 
                  />
                </TouchableOpacity>
              </TouchableOpacity>
              
              {/* Collapsible Content */}
              {isTransferSectionOpen && (
                <Animatable.View 
                  animation="slideInDown" 
                  duration={300}
                  style={styles.transferDetailsContainer}
                >
                  <Text style={styles.transferDetailsText}>
                    Our ambulance service provides safe and reliable patient transportation 
                    with trained medical staff and proper equipment.
                  </Text>
                  <View style={styles.transferFeatures}>
                    <Text style={styles.featureItem}>• 24/7 availability</Text>
                    <Text style={styles.featureItem}>• Trained medical staff</Text>
                    <Text style={styles.featureItem}>• GPS tracking</Text>
                    <Text style={styles.featureItem}>• Emergency equipment</Text>
                  </View>
                </Animatable.View>
              )}
            </View>

            {/* Ambulance Cards */}
            <View style={styles.optionsContainer}>
              {ambulanceOptions.map((option) => {
                const isSelected = selectedAmbulance === option.id;
                return (
                  <View
                    key={option.id}
                    style={[
                      styles.optionCard,
                      isSelected && styles.selectedOptionCard,
                    ]}
                  >
                    <TouchableOpacity onPress={() => handleSelectAmbulance(option.id)}>
                      <View style={styles.optionHeader}>
                        <View style={styles.optionLeft}>
                          <View style={styles.ambulanceAndBadgeContainer}>
                       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
  <View style={[styles.minutesBadge, { backgroundColor: option.color }]}>
    <Text style={styles.minutesText}>{option.minutes}</Text>
  </View>

  <View style={{ flexDirection: 'column', alignItems: 'center', marginLeft: 10 }}>
 
    <Image
      source={require('../../Assets/ambualnce.png')}
      style={styles.optionAmbulanceIcon}
    />
       <Text style={styles.optionTimeBelow}>{option.minutes} mins</Text>
  </View>
</View>

                          </View>
                          <View style={styles.optionInfo}>
                            <Text style={styles.optionType}>{option.type}</Text>
                            {option.description ? (
                              <Text style={styles.optionDescription}>{option.description}</Text>
                            ) : null}
                          </View>
                        </View>
                        <Text style={styles.optionPrice}>{option.price}</Text>
                      </View>
                      <View style={styles.includesSection}>
                        <Text style={styles.includesTitle}>Includes :</Text>
                        <Text style={styles.includesText}>{option.includes}</Text>
                      </View>
                    </TouchableOpacity>

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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
  greetingContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  greeting: {
    fontSize: Fonts.size.TopHeading,
    color: 'black',
  },
  userName: {
    fontSize: Fonts.size.TopSubheading,
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
    marginLeft: wp('2%'),
  },
  
  mapContainer: {
    width: '100%',
    height: hp('30%'),
    marginBottom: hp('1%'),
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
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
    alignSelf: 'center',
  },
  content: {
    paddingHorizontal: 16,
  },
  noteSection: {
    marginTop: 12,
    marginBottom: 20,
    flexDirection: 'row',
  },
  noteTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    left: 10,
  },
  transferSection: {
    marginBottom: 20,
  },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  ambulanceIcon: {
    width: 120, // Increased size
    height: 70,  // Increased size
    marginRight: 12,
    resizeMode: 'contain',
  },
  transferTextContainer: {
    flex: 1,
  },
  transferText: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#333',
  },
  dropdownButton: {
    padding: 4,
  },
  transferDetailsContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  transferDetailsText: {
    fontSize: Fonts.size.PageSubheading,
    color: '#333',
    marginBottom: 10,
    lineHeight: 18,
  },
  transferFeatures: {
    marginTop: 5,
  },
  featureItem: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#666',
    marginBottom: 3,
  },
  optionsContainer: {
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    padding: 16,
    marginBottom: 12,
  },
  selectedOptionCard: {
    borderColor: '#8B5CF6',
    borderWidth: 2,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  ambulanceAndBadgeContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  minutesBadge: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  minutesText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: Fonts.size.PageSubSubHeading,
  },
  optionAmbulanceIcon: {
    width: 60,  // Increased size
    height: 40, // Increased size
    marginBottom: 4,
    resizeMode: 'contain',
  },
  optionTimeBelow: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#7518AA',
    textAlign: 'center',
  },
  optionInfo: {
    flex: 1,
  },
  optionType: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#666',
  },
  optionPrice: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#333',
  },
  includesSection: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  includesTitle: {
    fontWeight: '600',
    fontSize: Fonts.size.PageSubheading,
    color: '#333',
  },
  includesText: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#666',
    lineHeight: 16,
  },
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
  locationContainer: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    elevation: 3,
    margin: 10,
  },
  row: {
    flexDirection: 'row',
  },
  iconColumn: {
    alignItems: 'center',
    marginRight: 10,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'green',
    marginTop: 4,
  },
  dashedLine: {
    width: 1,
    height: 50,
    borderLeftWidth: 1,
    borderColor: 'gray',
    borderStyle: 'dashed',
    marginVertical: 4,
  },
  redDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    marginBottom: 4,
  },
  textColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationText: {
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '500',
    color: '#000',
    marginVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 4,
    width: '100%',
  },
});

export default AmbulanceSelectionScreen;