import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import CustomHeader from '../../../Header'; // update path if needed

const SelectHospitalScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHospitals, setSelectedHospitals] = useState([]);

  const suggestedHospitals = ['Apollo', 'SIMS Hospital', 'KRS'];

  const handleHospitalSelect = (hospitalName) => {
    if (!selectedHospitals.includes(hospitalName)) {
      setSelectedHospitals([...selectedHospitals, hospitalName]);
    }
  };

  const handleRemoveHospital = (hospitalName) => {
    setSelectedHospitals(selectedHospitals.filter((h) => h !== hospitalName));
  };

  const handleSubmit = () => {

    navigation.navigate('LiveTrakingScreen');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
        <LinearGradient
          colors={['#ffffff', '#C3DFFF']}
          start={{ x: 0, y: 0.3 }}
          end={{ x: 0, y: 0 }}
          style={styles.topBackground}
        >
           <ScrollView
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
       
          <CustomHeader
            username="Jeswanth Kumar"
            onNotificationPress={() => {}}
            onWalletPress={() => {}}
          />

         
            {/* Title and Back */}
            <View style={styles.titleContainer}>
              <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={30} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>Select Hospital</Text>
            </View>

            <View style={{ top: 20 }}>
              <Text style={styles.subtitle}>You can also choose hospitals on your own</Text>

              {/* Search Bar */}
              <View style={styles.searchBarContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search your hospital"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholderTextColor="#999"
                />
                <Icon name="arrow-drop-down" size={24} color="#000" />
              </View>

              {/* Suggested Hospitals */}
              <View style={styles.suggestedHospitalsContainer}>
                {[...suggestedHospitals, 'Apollo'].map((hospital, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.hospitalTag}
                    onPress={() => handleHospitalSelect(hospital)}
                  >
                    <Text style={styles.hospitalTagText}>+ {hospital}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Selected Hospitals */}
            {selectedHospitals.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.selectedHospitalsScroll}
              >
                {selectedHospitals.map((hospital, index) => (
                  <View key={index} style={styles.selectedHospitalBadge}>
                    <Text style={styles.selectedHospitalText}>{hospital}</Text>
                    <TouchableOpacity onPress={() => handleRemoveHospital(hospital)}>
                      <Icon name="close" size={16} color="#fff" style={styles.removeIcon} />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </ScrollView>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FF' },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
    position: 'relative',
  },
  titleContainer: {
    position: 'relative',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 180,
  },
  subtitle: {
    fontSize: Fonts.size.PageSubheading,
    color: '#666',
    marginBottom: 12,
    fontFamily: Fonts.family.regular,
    alignSelf: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 70,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  searchInput: {
    flex: 1,
    fontSize: Fonts.size.PageSubheading,
    color: '#000',
  },
  suggestedHospitalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  hospitalTag: {
    backgroundColor: '#ffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  hospitalTagText: {
    fontSize: Fonts.size.PageSubheading,
    color: '#333',
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
  selectedHospitalsScroll: {
    marginBottom: 20,
  },
  selectedHospitalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7518AA',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  selectedHospitalText: {
    color: '#fff',
    marginRight: 5,
    fontFamily: Fonts.family.regular,
  },
  submitButton: {
    backgroundColor: '#7518AA',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '5%',
    left: 20,
    right: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    height: 50,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '600',
    fontFamily: Fonts.family.regular,
  },
});

export default SelectHospitalScreen;
