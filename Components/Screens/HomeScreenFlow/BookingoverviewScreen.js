import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  Image,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
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

const AmbulanceBookingScreen = ({ navigation }) => {
  const [selectedAssistance, setSelectedAssistance] = useState('required');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedSubOption, setSelectedSubOption] = useState(null);

  const handlePayment = () => {
    if (!customerName.trim() || !customerMobile.trim()) {
      Alert.alert('Error', 'Please fill in all required customer details');
      return;
    }

    navigation.navigate('Bookingconformation', {
      name: customerName,
      mobile: customerMobile,
      additionalInfo: additionalInfo,
      totalAmount: 1750,
    });
  };

  const categories = [
    { id: 'heart', title: 'Emergency Kit', image: require('../../Assets/emkit.png') },
    { id: 'poisoning', title: 'Oxygen Tank', image: require('../../Assets/oxgenTank.png') },
    { id: 'accident', title: 'IV Equipment', image: require('../../Assets/ivequp.png') },
    { id: 'skin', title: 'Cardiac Monitors', image: require('../../Assets/cardiomonitor.png') },
    { id: 'cpr', title: 'Ambulance Bed', image: require('../../Assets/ambulancebet.png') },
  ];

  const firstRow = categories.slice(0, 3);
  const secondRow = categories.slice(3);

  const handleCategorySelect = (category) => {
 
  };

  // ...


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.topBackground}
      >
        

<View style={{flexDirection:'row'}}>
  <Icons name="arrow-back" size={24} color="black" />
  <Text style={{alignSelf:'center',left:10,fontSize: Fonts.size.PageHeading,fontWeight:'700'}}>Booking Overview</Text>
</View>
        
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
  <Text style={styles.sectionTitle}>Pickup</Text>
  <View style={styles.locationRow}>
    <View style={styles.iconCircle}>
      <Ionicons name="location-sharp" size={18} color="#D30000" />
    </View>
    <Text style={styles.locationText}>West Mambalam, Chennai - 33</Text>
  </View>

  <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Drop</Text>
  <View style={styles.locationRow}>
    <View style={styles.iconCircle}>
      <Ionicons name="location-sharp" size={18} color="#D30000" />
    </View>
    <Text style={styles.locationText}>Vyasarpadi, Chennai - 39</Text>
  </View>
</View>

          {/* Ambulance Details */}
          <View style={styles.section}>
          <View style={styles.sectionHeader}>
  <Text style={styles.sectionTitle}>Ambulance Details</Text>
  <TouchableOpacity>
    <Text style={styles.changeLink}>Change</Text>
  </TouchableOpacity>
</View>


            <View style={styles.ambulanceCard}>
              <View style={styles.ambulanceHeader}>
                <Image source={require('../../Assets/ambualnce.png')} style={styles.ambulanceImage} />
                <View style={styles.ambulanceInfo}>
                  <Text style={styles.ambulanceTitle}>Patient Transfer</Text>
                  <Text style={styles.ambulanceSubTitle}>Small ( Omni, etc )</Text>
                  <Text style={styles.arrivalTime}>Arrival Timing: 15 mins</Text>
                </View>
                <Text style={styles.price}>₹ 1,500</Text>
              </View>
            </View>
          </View>

            <View style={styles.categorySection}>
      <Text style={styles.categoryHeader}>Includes</Text>

      <View style={styles.row}>
        {firstRow.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryButton}
            onPress={() => onSelect?.(item)}
          >
            <Image source={item.image} style={styles.categoryImage} />
            <Text style={styles.categoryLabel}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {secondRow.length > 0 && (
        <View style={[styles.row, { justifyContent: 'flex-start' }]}>
          {secondRow.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.categoryButton}
              onPress={() => onSelect?.(item)}
            >
              <Image source={item.image} style={styles.categoryImage} />
              <Text style={styles.categoryLabel}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
          <View style={styles.section}>
     

      {/* Not Required */}
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => {
          setSelectedAssistance('not-required');
          setSelectedSubOption(null); // hide sub-options
        }}
      >
        <View style={[styles.radioButton, selectedAssistance === 'not-required' && styles.radioSelected]}>
          {selectedAssistance === 'not-required' && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.radioText}>Not Required Patient Assistance</Text>
      </TouchableOpacity>

      {/* Required */}
      <TouchableOpacity
        style={styles.radioOption}
        onPress={() => setSelectedAssistance('required')}
      >
        <View style={[styles.radioButton, selectedAssistance === 'required' && styles.radioSelected]}>
          {selectedAssistance === 'required' && <View style={styles.radioInner} />}
        </View>
        <View style={styles.radioContent}>
          <Text style={styles.radioText}>Required Patient Assistance</Text>
        </View>
      </TouchableOpacity>

      {/* Sub Option - only visible if required selected */}
      {selectedAssistance === 'required' && (
        <TouchableOpacity
          style={styles.subOptionCard}
          onPress={() => setSelectedSubOption('common')}
        >
          <View style={[styles.radioButton, selectedSubOption === 'common' && styles.radioSelected]}>
            {selectedSubOption === 'common' && <View style={styles.radioInner} />}
          </View>
          <View style={styles.subOptionContent}>
            <Text style={styles.subOptionText}>The common amount</Text>
            <Text style={styles.subOptionPrice}>₹ 250</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>

          {/* Customer Details */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.expandableHeader}>
              <Text style={styles.sectionTitle}>Add Customer Details</Text>
              <Icon name="keyboard-arrow-down" size={24} color="#666" />
            </TouchableOpacity>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
               
                <TextInput
                  style={styles.textInput}
                  value={customerName}
                  onChangeText={setCustomerName}
                  placeholder=" Customer Name"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.inputGroup}>
           
                <TextInput
                  style={styles.textInput}
                  value={customerMobile}
                  onChangeText={setCustomerMobile}
                  placeholder="Customer Mobile Number"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>

              <View style={styles.inputGroup}>
         
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={additionalInfo}
                  onChangeText={setAdditionalInfo}
                  placeholder="Write Additional information here "
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Price Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Details</Text>

            <View style={styles.priceContainer}>
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Ambulance Cost</Text>
                <Text style={styles.priceValue}>₹ 1,500</Text>
              </View>

              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Assistance for the Patient</Text>
                <Text style={styles.priceValue}>₹ 250</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total Price</Text>
                <Text style={styles.totalValue}>₹ 1,750</Text>
              </View>
            </View>
          </View>
        </ScrollView>

     
        <View style={styles.floatingButtonWrapper}>
          <TouchableOpacity style={styles.payNowButton} onPress={handlePayment}>
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
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
  greetingContainer: { flex: 1, marginLeft: wp('3%') },
  greeting: { fontSize: hp('2%'), color: 'black', fontFamily: Fonts.family.regular },
  userName: { fontSize: hp('2%'), fontWeight: 'bold', color: 'black', fontFamily: Fonts.family.regular },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('2%'),
  },
  content: { flex: 1 },
  section: {
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  sectionTitle: {
  fontSize: Fonts.size.PageHeading,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
   
  },
 
  ambulanceCard: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 12,
  },
  ambulanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ambulanceImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginRight: 12,
  },
  ambulanceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  ambulanceTitle: {
   fontSize: Fonts.size.PageHeading,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    fontFamily: Fonts.family.regular,
  },
  ambulanceSubTitle: {
   fontSize: Fonts.size.PageSubheading,
    color: '#666',
    marginBottom: 2,
    fontFamily: Fonts.family.regular,
  },
  arrivalTime: {
      fontSize: Fonts.size.PageSubSubHeading,

    color: '#28a745',
    fontFamily: Fonts.family.regular,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    fontFamily: Fonts.family.regular,
  },
  categorySection: {
    marginVertical: 20,
    paddingHorizontal: 5,
  },
  categoryHeader: {
      fontSize: Fonts.size.PageHeading,

    fontWeight: '700',
    color: '#222',
    marginBottom: 16,
   
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 8,
  },
  categoryLabel: {
     fontSize: Fonts.size.PageSubheading,

    color: '#333',
    textAlign: 'center',
    fontWeight: '600',

  },
 
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  formContainer: {
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
       fontSize: Fonts.size.PageSubheading,

    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: Fonts.family.regular,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 18 ,
      fontSize: Fonts.size.PageSubSubHeading,

    color: '#333',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priceContainer: {
    marginTop: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
      fontSize: Fonts.size.PageHeading,
 fontWeight: '700',
    color: '#00000',
  },
  priceValue: {
       fontSize: Fonts.size.PageHeading,

    color: '#333',
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 8,
  },
  totalLabel: {
      fontSize: Fonts.size.PageHeading,

    color: '#333',
    fontWeight: '600',
   
  },
  totalValue: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    fontFamily: Fonts.family.regular,
  },

  // Floating Pay Now Button
  floatingButtonWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 30 : '15%',
    left: 20,
    right: 20,
    zIndex: 10,
    elevation: 10,
  },
  payNowButton: {
    backgroundColor: Colors.statusBar,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
  },
  payNowButtonText: {
    color: '#fff',
      fontSize: Fonts.size.PageSubheading,

    fontWeight: 'bold',
  },
   radioOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#7518AA',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7518AA',
  },
  radioText: {
      fontSize: Fonts.size.PageSubheading,

    color: '#000',
  },
  radioContent: {
    flex: 1,
  },
  radioSubText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
  },
  radioPrice: {
    fontSize: 14,
    color: '#000',
    marginTop: 4,
  },
  subOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    borderColor: '#E5E5E5',
    borderWidth: 1,
    padding: 16,
    marginTop: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  subOptionContent: {
    flex: 1,
    marginLeft: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subOptionText: {
    fontSize: Fonts.size.PageSubheading,

    color: '#000',
  },
  subOptionPrice: {
      fontSize: Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#000',
  },
   categorySection: {
    marginVertical: 20,
    paddingHorizontal: 5,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 8,
  },
  
 
  sectionHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 12,
},
changeLink: {
fontSize: Fonts.size.PageSubheading,
  color: 'red',
  fontWeight: '700',
 
},
locationRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginTop: 10,
},
iconCircle: {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: '#FFECEC',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
locationText: {
  fontSize: Fonts.size.PageSubheading,
  color: '#000',

},



});

export default AmbulanceBookingScreen;
