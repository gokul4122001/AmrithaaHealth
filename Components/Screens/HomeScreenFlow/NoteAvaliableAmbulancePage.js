import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AmbulanceSelectionPage = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const ambulanceOptions = [
    {
      id: 1,
      type: 'Large',
      subtitle: 'Tempo traveller, Force, etc.',
      price: '₹ 2,500',
      time: '35 mins',
      color: '#8B5CF6',
      icon: '🚐',
    },
    {
      id: 2,
      type: 'Basic life support',
      subtitle: '',
      price: '₹ 2,000',
      time: '15 mins',
      color: '#EF4444',
      icon: '🚑',
      includes: 'Emergency Kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Patient Stretchers',
    },
    {
      id: 3,
      type: 'Advance life support',
      subtitle: '',
      price: '₹ 2,000',
      time: '15 mins',
      color: '#10B981',
      icon: '🚑',
      includes: 'Emergency Kit, Oxygen Tanks, IV equipment, Cardiac Monitors, Ambulance Bed, Ventilator support with nursing support',
    },
  ];


const handleOptionSelect = (option) => {
  setSelectedOption(option.id);
  
};

  const renderAmbulanceOption = (option) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionCard,
        selectedOption === option.id && styles.selectedCard,
      ]}
      onPress={() => handleOptionSelect(option)}
    >
      <View style={styles.optionHeader}>
        <View style={styles.iconContainer}>
          <View style={[styles.iconCircle, { backgroundColor: option.color }]}>
            <Text style={styles.iconText}>{option.icon}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{option.time}</Text>
          </View>
        </View>

        <View style={styles.optionContent}>
          <View style={styles.optionInfo}>
            <Text style={styles.optionType}>{option.type}</Text>
            {option.subtitle ? (
              <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
            ) : null}
          </View>
          <Text style={styles.optionPrice}>{option.price}</Text>
        </View>

        <View style={styles.chevronContainer}>
          <Icon name="chevron-down" size={20} color="#666" />
        </View>
      </View>

      {option.includes && (
        <View style={styles.includesContainer}>
          <Text style={styles.includesLabel}>Includes :</Text>
          <Text style={styles.includesText}>{option.includes}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="white" />
      
      {/* White Top Section - 30% */}
      <View style={styles.whiteTopSection}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Icon name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section - 70% */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          {/* Title Section */}
          <Text style={styles.title}>Note</Text>
          <Text style={styles.subtitle}>
            Ambulance with additional life care Supports
          </Text>

          {/* Patient Transfer Section */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Text style={styles.sectionIcon}>🚑</Text>
            </View>
            <Text style={styles.sectionTitle}>Patient transfer</Text>
            <Icon name="chevron-down" size={20} color="#333" />
          </View>

          {/* Ambulance Options */}
          <ScrollView contentContainerStyle={styles.optionsContainer}>
      {ambulanceOptions.map(renderAmbulanceOption)}
    </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  whiteTopSection: {
    height: '30%',
    backgroundColor: 'white',
    justifyContent: 'flex-start',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    marginTop: 10,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  mainContent: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionIconContainer: {
    marginRight: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#8B5CF6',
    shadowOpacity: 0.15,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconText: {
    fontSize: 22,
  },
  timeContainer: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
    minWidth: 50,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  optionContent: {
    flex: 1,
    marginRight: 12,
  },
  optionInfo: {
    marginBottom: 6,
  },
  optionType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  optionSubtitle: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  optionPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  chevronContainer: {
    padding: 4,
  },
  includesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  includesLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  includesText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
});

export default AmbulanceSelectionPage;