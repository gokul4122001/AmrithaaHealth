import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Modal,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Colors from '../../Colors/Colors'; // Ensure this exists or use '#000'
import Fonts from '../../Fonts/Fonts';

const { width, height } = Dimensions.get('window');

const CongratulationsScreen = ({ navigation }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowModal(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  const handleOK = () => {
    setShowModal(false);
    navigation.navigate('UnavailabledrivingConnectScreen');
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      <StatusBar backgroundColor={Colors.statusBar || '#6200EE'} barStyle="light-content" />

      <View style={styles.contentWrapper}>
        <LottieView
          source={require('../../Assets/lottie/Loading1.json')}
          autoPlay
          loop={!showModal}
          style={styles.lottieStyle}
        />
      </View>

      {/* Modal after 5 seconds */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Note</Text>
            <Text style={styles.modalMessage}>
              Selected Vehicle is unavailable{'\n'}try another Vehicle
            </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.okBtn} onPress={handleOK}>
                <Text style={styles.okText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottieStyle: {
    width: width * 0.7,
    height: height * 0.6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontWeight: '700',
   
    color: '#000',
    marginBottom: 10,
         fontSize: Fonts.size.addition,

  },
  modalMessage: {
   
    textAlign: 'center',
    color: '#333',
    marginBottom: 25,
         fontSize: Fonts.size.PageSubheading,
         lineHeight:16

  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
    marginRight: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelText: {
    color: '#000',
    fontWeight: 'bold',
         fontSize: Fonts.size.PageSubheading,

  },
  okBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#6A1B9A',
    borderRadius: 6,
    alignItems: 'center',
  },
  okText: {
    color: '#fff',
    fontWeight: 'bold',
         fontSize: Fonts.size.PageSubheading,

  },
});



export default CongratulationsScreen;
