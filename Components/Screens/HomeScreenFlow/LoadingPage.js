import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Image,
} from 'react-native';
import Fonts from '../../Fonts/Fonts';

const VehicleCheckScreen = ({ navigation }) => {
  const [step, setStep] = useState('initialLoading'); 
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Step 1: Initial loading spinner (5 seconds)
    const initialTimer = setTimeout(() => {
      setStep('booking');
    }, 5000);

    // Step 2: Show second loading after booking (after 5s + 3s)
    const secondLoadTimer = setTimeout(() => {
      setStep('secondLoading');
    }, 8000);

    // Step 3: Show modal after second loading (after 5s + 3s + 3s)
    const modalTimer = setTimeout(() => {
      setShowModal(true);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(secondLoadTimer);
      clearTimeout(modalTimer);
    };
  }, []);

  const handleCancel = () => setShowModal(false);

  const handleOk = () => {
    setShowModal(false);
    navigation.navigate('NoteAvaliableAmbulancePage');
  };

  return (
    <View style={styles.container}>
      {/* Step 1: Initial Loading */}
      {step === 'initialLoading' && (
        <ActivityIndicator size="large" color="#6200EE" style={styles.spinner} />
      )}

      {/* Step 2: Booking Confirmed UI */}
      {step === 'booking' && (
        <View style={styles.bookingContainer}>
          <Image
            source={require('../../Assets/Booking.png')}
            style={styles.bookingImage}
            resizeMode="contain"
          />
          <Text style={styles.bookingText}>Booking confirmed!</Text>
          <Text style={styles.subText}>Ambulance Arriving Shortly</Text>
        </View>
      )}

      {/* Step 3: Second Loading Spinner */}
      {step === 'secondLoading' && (
        <ActivityIndicator size="large" color="#6200EE" style={styles.spinner} />
      )}

      {/* Step 4: Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Note</Text>
            <Text style={styles.modalMessage}>
              Selected Vehicle is unavailable{'\n'}try another Vehicle
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleOk} style={styles.okButton}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VehicleCheckScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    transform: [{ scale: 1.5 }],
  },
  bookingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookingImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  bookingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop: 80,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
     fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 10,
    color: '#000',
  },
  modalMessage: {
    fontSize: Fonts.size.PageSubheading,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
     fontSize: Fonts.size.PageSubSubHeading,
  },
    okButton: {
    backgroundColor: '#6200EE',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 25,
  },
  okText: {
    color: '#fff',
    fontWeight: '600',
     fontSize: Fonts.size.PageSubSubHeading,

  },
});