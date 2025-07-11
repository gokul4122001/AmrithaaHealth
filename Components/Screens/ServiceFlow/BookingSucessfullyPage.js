// screens/BookingSuccessScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import Colors from '../../Colors/Colors';
import LottieView from 'lottie-react-native';
import Fonts from '../../Fonts/Fonts';

const BookingSuccessScreen = ({ navigation }) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Show feedback modal after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFeedbackModal(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleRatingPress = (selectedRating) => {
    setRating(selectedRating);
  };

  const handleFeedbackSubmit = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return;
    }

    // Close modal and navigate to next screen
    setShowFeedbackModal(false);
    
    // Navigate to home or dashboard screen after feedback submission
    setTimeout(() => {
      navigation.navigate('ServiceHospitalScreen'); // Change this to your desired screen
    }, 500);
  };

  const handleFeedbackCancel = () => {
    setShowFeedbackModal(false);
    // Navigate to home screen even if cancelled
    setTimeout(() => {
      navigation.navigate('ServiceHospitalScreen'); // Change this to your desired screen
    }, 500);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => handleRatingPress(i)}
          style={styles.starButton}
        >
          <Text style={[styles.star, rating >= i ? styles.starFilled : styles.starEmpty]}>
            ⭐
          </Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.statusBar} barStyle="light-content" />
    <View style={styles.container}>
      <LottieView
        source={require('../../Assets/lottie/tick.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
      />
      <Text style={styles.successText}>Booking Successful</Text>
    </View>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFeedbackModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Feedback</Text>
            
            <View style={styles.ratingSection}>
              <Text style={styles.ratingLabel}>Enter Your Ratings</Text>
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>
            </View>

            <View style={styles.feedbackSection}>
              <Text style={styles.feedbackLabel}>Share Feedback</Text>
              <TextInput
                style={styles.feedbackInput}
                placeholder="Enter Your Feedback"
                multiline={true}
                numberOfLines={4}
                value={feedback}
                onChangeText={setFeedback}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleFeedbackCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleFeedbackSubmit}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
   container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  lottie: {
    width: 300,
    height: 300,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2ecc71',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  ratingSection: {
    marginBottom: 20,
  },
  ratingLabel: {
      fontSize:  Fonts.size.PageHeading,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  starButton: {
    padding: 4,
  },
  star: {
       fontSize:  Fonts.size.PageHeading,

  },
  starFilled: {
    opacity: 1,
  },
  starEmpty: {
    opacity: 0.3,
  },
  feedbackSection: {
    marginBottom: 24,
  },
  feedbackLabel: {
      fontSize:  Fonts.size.PageHeading,

    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    height: 80,
    textAlignVertical: 'top',
     fontSize:  Fonts.size.PageHeading,
    color: '#374151',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#6B7280',
      fontSize:  Fonts.size.PageHeading,

    fontWeight: '500',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#7518AA',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
      fontSize:  Fonts.size.PageHeading,
    fontWeight: 'bold',
  },
});

export default BookingSuccessScreen;