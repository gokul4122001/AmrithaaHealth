import React, { useEffect, useState } from 'react';
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
  Platform,
  ActivityIndicator,
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
import {
  booking_Create,
  Select_AmbulanceDetails,
} from '../APICall/HomeScreenApi';
import { useSelector } from 'react-redux';

const AmbulanceBookingScreen = ({ navigation, route }) => {
  const {
    pickup,
    destination,
    pickupCoords,
    dropCoords,
    selectedAmbulance,
    booking_type,
    booking_for,
  } = route.params;

  const [selectedAssistance, setSelectedAssistance] = useState('not-required');
  const [customerName, setCustomerName] = useState('');
  const [customerMobile, setCustomerMobile] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [selectedSubOption, setSelectedSubOption] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector(state => state.auth);
  const [showNameDropdown, setShowNameDropdown] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [data, setData] = useState(null);
  console.log(booking_for, 'booking_for');

  const handlePayment = async () => {
    if (!customerName.trim() || !customerMobile.trim()) {
      Alert.alert('Error', 'Please fill in all required customer details');
      return;
    }

    const totalAmount =
      selectedAssistance === 'required' && selectedSubOption === 'common'
        ? data?.total_fare_with_patient_assistent || 0
        : data?.total_fare || 0;

    const res = await booking_Create(token, pickupCoords, dropCoords,pickup,destination,booking_type,totalAmount,selectedAmbulance?.id,customerName,customerMobile);
    console.log(res,"res booking ");
    
    navigation.navigate('Bookingconformation', {
      id :res?.data?.id,
      name: customerName,
      mobile: customerMobile,
      additionalInfo: additionalInfo,
      totalAmount: totalAmount,
      ambulanceDetails: data,
      selectedAssistance,
      pickup,
      destination,
    });
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await Select_AmbulanceDetails(
        token,
        pickupCoords,
        dropCoords,
        selectedAmbulance,
        booking_type,
        booking_for,
      );
      console.log(res, 'Ambulance Details Response');
      setData(res.data);
    } catch (error) {
      console.error('Error fetching ambulance details:', error);
      Alert.alert('Error', 'Failed to load ambulance details');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Calculate total amount based on assistance selection
  const getTotalAmount = () => {
    if (!data) return 0;
    return selectedAssistance === 'required' && selectedSubOption === 'common'
      ? data.total_fare_with_patient_assistent
      : data.total_fare;
  };

  const dummyCustomers = [
    { id: 1, name: 'John Doe', mobile: '9876543210' },
    { id: 2, name: 'Jane Smith', mobile: '9876543211' },
    { id: 3, name: 'Mike Johnson', mobile: '9876543212' },
    { id: 4, name: 'Sarah Wilson', mobile: '9876543213' },
    { id: 5, name: 'David Brown', mobile: '9876543214' },
  ];

  const handleCustomerSelection = customer => {
    setSelectedCustomer(customer);
    setCustomerName(customer.name);
    setCustomerMobile(customer.mobile);
    setShowNameDropdown(false);
  };

  const renderCustomerNameInput = () => {
    if (booking_for === 'others') {
      return (
        <View style={styles.inputGroup}>
          <TouchableOpacity
            style={styles.dropdownInput}
            onPress={() => setShowNameDropdown(!showNameDropdown)}
          >
            <Text
              style={[
                styles.dropdownInputText,
                !selectedCustomer && styles.placeholderText,
              ]}
            >
              {selectedCustomer
                ? selectedCustomer.name
                : 'Select Customer Name'}
            </Text>
            <Icon
              name={
                showNameDropdown ? 'keyboard-arrow-up' : 'keyboard-arrow-down'
              }
              size={24}
              color="#666"
            />
          </TouchableOpacity>

          {showNameDropdown && (
            <View style={styles.dropdownList}>
              {dummyCustomers.map(customer => (
                <TouchableOpacity
                  key={customer.id}
                  style={styles.dropdownItem}
                  onPress={() => handleCustomerSelection(customer)}
                >
                  <Text style={styles.dropdownItemText}>{customer.name}</Text>
                  <Text style={styles.dropdownItemSubText}>
                    {customer.mobile}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.textInput}
            value={customerName}
            onChangeText={setCustomerName}
            placeholder="Customer Name"
            placeholderTextColor="#999"
          />
        </View>
      );
    }
  };

  const renderIncludesSection = () => {
    if (!data?.ambulance_include || data.ambulance_include.length === 0) {
      return null;
    }

    const items = data.ambulance_include;
    const rows = [];

    // Split items into rows of 3
    for (let i = 0; i < items.length; i += 3) {
      rows.push(items.slice(i, i + 3));
    }

    return (
      <View style={styles.categorySection}>
        <Text style={styles.categoryHeader}>Includes</Text>
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            style={[
              styles.row,
              row.length < 3 && { justifyContent: 'flex-start' },
            ]}
          >
            {row.map((item, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <Image
                  source={{ uri: item.icon }}
                  style={styles.categoryImage}
                  defaultSource={require('../../Assets/emkit.png')}
                />
                <Text style={styles.categoryLabel}>
                  {item.ambulance_include}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.statusBar}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.statusBar} />
          <Text style={styles.loadingText}>Loading ambulance details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.3 }}
        end={{ x: 0, y: 0 }}
        style={styles.topBackground}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Booking Overview</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 200 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Location Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pickup</Text>
            <View style={styles.locationRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-sharp" size={18} color="#D30000" />
              </View>
              <Text style={styles.locationText} numberOfLines={2}>
                {pickup || 'Pickup location not available'}
              </Text>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Drop</Text>
            <View style={styles.locationRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="location-sharp" size={18} color="#D30000" />
              </View>
              <Text style={styles.locationText} numberOfLines={2}>
                {destination || 'Destination not available'}
              </Text>
            </View>
          </View>

          {/* Ambulance Details */}
          {data && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Ambulance Details</Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text style={styles.changeLink}>Change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.ambulanceCard}>
                <View style={styles.ambulanceHeader}>
                  <Image
                    source={{ uri: data.icon }}
                    style={styles.ambulanceImage}
                    defaultSource={require('../../Assets/ambualnce.png')}
                  />
                  <View style={styles.ambulanceInfo}>
                    <Text style={styles.ambulanceTitle}>
                      {data.ambulance_type}
                    </Text>
                    <Text style={styles.ambulanceSubTitle}>{data.details}</Text>
                    <Text style={styles.arrivalTime}>
                      Arrival Timing: {data.average_arrival_minutes} mins
                    </Text>
                    <Text style={styles.distanceInfo}>
                      Distance: {data.distance_km} km
                    </Text>
                  </View>
                  <Text style={styles.price}>₹ {data.total_fare}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Includes Section */}
          {renderIncludesSection()}

          {/* Patient Assistance Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Assistance</Text>

            {/* Not Required */}
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => {
                setSelectedAssistance('not-required');
                setSelectedSubOption(null);
              }}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedAssistance === 'not-required' && styles.radioSelected,
                ]}
              >
                {selectedAssistance === 'not-required' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text style={styles.radioText}>
                Not Required Patient Assistance
              </Text>
            </TouchableOpacity>

            {/* Required */}
            <TouchableOpacity
              style={styles.radioOption}
              onPress={() => setSelectedAssistance('required')}
            >
              <View
                style={[
                  styles.radioButton,
                  selectedAssistance === 'required' && styles.radioSelected,
                ]}
              >
                {selectedAssistance === 'required' && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <View style={styles.radioContent}>
                <Text style={styles.radioText}>
                  Required Patient Assistance
                </Text>
              </View>
            </TouchableOpacity>

            {/* Sub Option - only visible if required selected */}
            {selectedAssistance === 'required' && data && (
              <TouchableOpacity
                style={styles.subOptionCard}
                onPress={() => setSelectedSubOption('common')}
              >
                <View
                  style={[
                    styles.radioButton,
                    selectedSubOption === 'common' && styles.radioSelected,
                  ]}
                >
                  {selectedSubOption === 'common' && (
                    <View style={styles.radioInner} />
                  )}
                </View>
                <View style={styles.subOptionContent}>
                  <Text style={styles.subOptionText}>
                    Patient assistance service
                  </Text>
                  <Text style={styles.subOptionPrice}>
                    ₹ {data.patient_assistance}
                  </Text>
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
              {renderCustomerNameInput()}

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
                  placeholder="Write Additional information here"
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Price Details */}
          {data && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Price Details</Text>

              <View style={styles.priceContainer}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>
                    Base Fare ({data.base_km} km)
                  </Text>
                  <Text style={styles.priceValue}>₹ {data.base_fare}</Text>
                </View>

                {data.extra_km > 0 && (
                  <View style={styles.priceRow}>
                    <Text style={styles.priceLabel}>
                      Extra Distance ({data.extra_km.toFixed(2)} km)
                    </Text>
                    <Text style={styles.priceValue}>₹ {data.extra_charge}</Text>
                  </View>
                )}

                {selectedAssistance === 'required' &&
                  selectedSubOption === 'common' && (
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Patient Assistance</Text>
                      <Text style={styles.priceValue}>
                        ₹ {data.patient_assistance}
                      </Text>
                    </View>
                  )}

                <View style={styles.divider} />

                <View style={styles.priceRow}>
                  <Text style={styles.totalLabel}>Total Price</Text>
                  <Text style={styles.totalValue}>₹ {getTotalAmount()}</Text>
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.floatingButtonWrapper}>
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={handlePayment}
            disabled={isLoading}
          >
            <Text style={styles.payNowButtonText}>
              Pay Now - ₹ {getTotalAmount()}
            </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  topBackground: {
    flex: 1,
    paddingTop: hp('4%'),
    paddingHorizontal: wp('5%'),
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  headerTitle: {
    alignSelf: 'center',
    marginLeft: 10,
    fontSize: Fonts.size.PageHeading,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
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
    flex: 1,
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
  distanceInfo: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#666',
    marginTop: 2,
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
  textInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 18,
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
    color: '#000',
    flex: 1,
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
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 18,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownInputText: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#333',
    flex: 1,
  },
  placeholderText: {
    color: '#999',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: '#fff',
    maxHeight: 200,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: Fonts.size.PageSubheading,
    color: '#333',
    fontWeight: '600',
  },
  dropdownItemSubText: {
    fontSize: Fonts.size.PageSubSubHeading,
    color: '#666',
    marginTop: 2,
  },
  disabledInput: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
});

export default AmbulanceBookingScreen;
