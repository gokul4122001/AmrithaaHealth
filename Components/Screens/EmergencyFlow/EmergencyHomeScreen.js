import React from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import LinearGradient from 'react-native-linear-gradient';
import Colors from '../../Colors/Colors';
import CustomHeader from '../../../Header';
import Fonts from '../../Fonts/Fonts';

const EmergencyHomeScreen = ({ navigation }) => {
  const services = [
    { id: 1, name: 'Accident/Trauma', Image: require('../../Assets/em1.png'), route: 'EmergencyHospitalScreen', params: { serviceType: 'Accident/Trauma' }},
    { id: 2, name: 'Stroke', Image: require('../../Assets/em2.png'), route: 'EmergencyHospitalScreen', params: { serviceType: 'Stroke' }},
    { id: 3, name: 'Burns', Image: require('../../Assets/em3.png'), route: 'EmergencyHospitalScreen', params: { serviceType: 'Burns' }},
    { id: 4, name: 'Cardiac', Image: require('../../Assets/em4.png'), route: 'EmergencyHospitalScreen', params: { serviceType: 'Cardiac' }},
    { id: 5, name: 'Bites/Poisoning', Image: require('../../Assets/em5.png'), route: 'EmergencyHospitalScreen', params: { serviceType: 'Bites/Poisoning' }},
    { id: 6, name: '24/7 Pharmacy', Image: require('../../Assets/em6.png'), route: 'EmergencyHospitalScreen', params: { serviceType: '24/7 Pharmacy' }},
    { id: 7, name: 'Maternity', Image: require('../../Assets/em7.png'), route: 'EmergencyHospitalScreen', params: { serviceType: 'Maternity' }},
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate(item.route, item.params)}
    >
      <Image source={item.Image} style={styles.serviceIcon} />
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const formatData = (data, numColumns) => {
    const numberOfFullRows = Math.floor(data.length / numColumns);
    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);

    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ id: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
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
        {/* Custom Header Integration */}
        <CustomHeader
          onNotificationPress={() => navigation.navigate('NotificationsScreen')}
          onImagePress={() => navigation.navigate('AlarmScreen')}
        />

        <View style={styles.sectionHeader}>
          <FontAwesome6 name="angle-left" size={18} color="black" />
          <Text style={styles.type}>Emergency list</Text>
        </View>

        <FlatList
          data={formatData([...services], 3)}
          renderItem={({ item }) =>
            item.empty ? <View style={[styles.card, styles.invisible]} /> : renderItem({ item })
          }
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.flatListContent}
        />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  type: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10,
    fontFamily: Fonts.family.regular,
  },
  flatListContent: {
    marginTop: hp('3%'),
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    margin: 10,
    maxWidth: Dimensions.get('window').width / 3 - 20,
  },
  serviceIcon: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
    marginBottom: 5,
  },
  serviceName: {
    fontSize: Fonts.size.PageSubheading,
    fontWeight: '700',
    color: '#4a4a4a',
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
  },
  invisible: {
    backgroundColor: 'transparent',
  },
});

export default EmergencyHomeScreen;
