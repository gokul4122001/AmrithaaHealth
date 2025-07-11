import React, { useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import Colors from '../../Colors/Colors';

const { width, height } = Dimensions.get('window');

const CongratulationsScreen = ({ navigation }) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('MainApp'); // Change to your desired screen
    }, 2500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  return (
    <LinearGradient
      colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
      style={styles.gradientContainer}
    >
      <StatusBar backgroundColor={Colors.statusBar} barStyle="light-content" />

      <View style={styles.contentWrapper}>
      
        <LottieView
          source={require('../../Assets/lottie/tick.json')}
          autoPlay
          loop={true} // ✅ makes the animation repeat forever
          style={styles.lottieStyle}
        />

         <Text style={styles.congratsText}>Congratulations</Text>
      </View>
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
  congratsText: {
    fontSize: 35,
    fontWeight: '700',
    color: '#7518AA',
    textAlign: 'center',
    position:'absolute',
    top:'75%'
   
  },
  lottieStyle: {
    width: width * 0.9,
    height: height * 0.6,
  },
});

export default CongratulationsScreen;
