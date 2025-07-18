import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Animatable from 'react-native-animatable';
import Fonts from '../../Fonts/Fonts';

const { height } = Dimensions.get('window');

const AmbulanceBookingScreen = ({ navigation }) => {
  const [selectedAmbulance, setSelectedAmbulance] = useState(null);

  const ambulanceOptions = [
    {
      id: 'large',
      type: 'Large',
      description: 'Temple traveller, Force, etc.',
      price: '₹ 2,500',
      color: '#8B5CF6',
      minutes: 40,
      includes: 'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'basic',
      type: 'Basic life support',
      description: '',
      price: '₹ 2,000',
      color: '#8B5CF6',
      minutes: 20,
      includes: 'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 'advance',
      type: 'Advance life support',
      description: '',
      price: '₹ 2,000',
      color: '#8B5CF6',
      minutes: 20,
      includes: 'Emergency kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Ventilator support with nursing Support',
    },
  ];

  const handleSelectAmbulance = (ambulanceId) => {
    setSelectedAmbulance(ambulanceId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.topHalf}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      {/* Bottom Modal View */}
      <Animatable.View animation="slideInUp" style={styles.bottomModal}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Note Section */}
          <View style={styles.noteSection}>
            <Text style={styles.noteTitle}>Note</Text>
            <Text style={styles.noteDescription}>
              Ambulance with additional life care Supports
            </Text>
          </View>

          {/* Transfer Dropdown */}
          <View style={styles.transferSection}>
            <View style={styles.transferRow}>
              <Image source={require('../../Assets/ambualnce.png')} style={styles.ambulanceIcon} />
              <View style={styles.transferTextContainer}>
                <Text style={styles.transferText}>Patient transfer</Text>
              </View>
              <TouchableOpacity style={styles.dropdownButton}>
                <Icon name="keyboard-arrow-down" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Ambulance Options */}
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
                        <View style={[styles.minutesBadge, { backgroundColor: option.color }]}>
                          <Text style={styles.minutesText}>{option.minutes}</Text>
                        </View>
                        <View>
                        <Image source={require('../../Assets/ambualnce.png')} style={styles.vehicleIcon} />
                           <Text style={styles.minutesText1}>35 min</Text>
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
                </View>
              );
            })}
          </View>

        {/* Booking Button Outside Card */}
{selectedAmbulance && (
  <TouchableOpacity
    style={styles.fixedBookingButton}
    onPress={() => {
      const selectedOption = ambulanceOptions.find(
        (item) => item.id === selectedAmbulance
      );

      if (selectedOption) {
        navigation.navigate('TrackAmulanceDriverPage', {
          ambulanceType: selectedOption.type,
          price: selectedOption.price,
        });
      }
    }}
  >
    <Text style={styles.bookNowText}>
      Booking - {ambulanceOptions.find(item => item.id === selectedAmbulance)?.price}
    </Text>
  </TouchableOpacity>
)}

        </ScrollView>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  topHalf: {
    height: height * 0.5,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-start',
    padding: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#F2F2F2',
    borderRadius: 30,
    width: 40,
    alignItems: 'center',
  },
  bottomModal: {
    position: 'absolute',
    bottom: 0,
    height: height * 0.60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    paddingBottom: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 15,
  },
  content: {
    paddingHorizontal: 16,
  },
  noteSection: {
    marginTop: 12,
    marginBottom: 20,
  },
  noteTitle: {
           fontSize: Fonts.size.PageHeading,

    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  noteDescription: {
              fontSize: Fonts.size.PageSubheading,

    color: '#666',
    textAlign: 'center',
    marginTop: 6,
  },
  transferSection: { marginBottom: 20 },
  transferRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  ambulanceIcon: { width: 70, height: 30, marginRight: 12 },
  transferTextContainer: { flex: 1 },
  transferText: {
              fontSize: Fonts.size.PageHeading,

    fontWeight: '500',
    color: '#333',
  },
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
    alignItems: 'center',
    flex: 1,
  },
  minutesBadge: {
    width: 32,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  minutesText: {
    color: '#fff',
    fontWeight: '600',
               fontSize: Fonts.size.PageSubSubHeading,

  },
  minutesText1: {
    color: '#7518AA',
    fontWeight: '600',
               fontSize: Fonts.size.PageSubSubHeading,
               left:10

  },
  vehicleIcon: {
    width: 70,
    height: 50,
    
  },
  optionInfo: { flex: 1 },
  optionType: {
              fontSize: Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#333',
  },
  optionDescription: {
                  fontSize: Fonts.size.PageSubheading,

    color: '#666',
  },
  optionPrice: {
                  fontSize: Fonts.size.PageSubheading,

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
                fontSize: Fonts.size.PageHeading,

    color: '#333',
  },
  includesText: {
                  fontSize: Fonts.size.PageSubSubHeading,

    color: '#666',
    lineHeight: 12,
  },
  fixedBookingButton: {
    backgroundColor: '#7518AA',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 30,
    marginHorizontal: 16,
  },
  bookNowText: {
    color: '#fff',
                   fontSize: Fonts.size.PageSubheading,

    fontWeight: '600',
  },
});

export default AmbulanceBookingScreen;
