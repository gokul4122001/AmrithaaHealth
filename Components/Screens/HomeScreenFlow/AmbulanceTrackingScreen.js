import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const AmbulanceTrackingScreen = ({ route }) => {
  const navigation = useNavigation();
  const { id } = route.params || { id: 207 };
  const token = useSelector(state => state.auth.token);

  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch booking details from backend
  const fetchBookingDetails = async () => {
    if (!token) {
      setError('Authentication token not found');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const apiUrl = `https://www.myhealth.amrithaa.net/backend/api/booking/detail?id=${id}`;

      const response = await Promise.race([
        fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout after 15 seconds')), 15000)
        ),
      ]);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status && result.data) {
        setBookingData(result.data);
        setError(null);
      } else {
        throw new Error(result.message || 'API returned false status');
      }
    } catch (err) {
      setError(err.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    } else {
      setError('Booking ID is required');
      setLoading(false);
    }
  }, [id]);

  const callCustomer = () => {
    if (bookingData?.customer_mobile) {
      Linking.openURL(`tel:${bookingData.customer_mobile}`);
    } else {
      Alert.alert('Error', 'Customer mobile number not available');
    }
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'Do you want to call customer care?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Linking.openURL('tel:+91 9841426826') },
      ]
    );
  };

  const formatDate = dateString => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB');
    } catch {
      return 'Invalid Date';
    }
  };

  const formatTime = dateString => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return 'Invalid Time';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6B46C1" />
          <Text style={styles.loadingText}>Loading booking details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>❌ Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchBookingDetails}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.headerBackButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Ambulance Tracking</Text>
          <TouchableOpacity style={styles.viewDetailsButton}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </TouchableOpacity>
        </View>

        {/* DRIVER */}
        <View style={styles.driverSection}>
          <View style={styles.driverInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {bookingData?.driver_name?.charAt(0)?.toUpperCase() || 'D'}
              </Text>
            </View>
            <View style={styles.driverDetails}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{bookingData?.driver_name || 'Driver Name'}</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.star}>⭐</Text>
                  <Text style={styles.rating}>
                    {bookingData?.driver_ratings !== 'NA'
                      ? bookingData?.driver_ratings
                      : '4.3'}
                  </Text>
                </View>
              </View>
              <Text style={styles.vehicleNumber}>
                {bookingData?.ambulance_number_plate || 'Vehicle Number'}
              </Text>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={callCustomer}>
              <Text style={styles.callIcon}>📞</Text>
              <Text style={styles.callText}>Call Customer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PICKUP */}
        <View style={styles.locationSection}>
          <Text style={styles.locationLabel}>Pickup</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationMarker}>📍</Text>
            <Text style={styles.locationText}>
              {bookingData?.pick_address || 'Pickup address not available'}
            </Text>
          </View>
        </View>

        {/* DROP */}
        <View style={styles.locationSection}>
          <Text style={styles.locationLabel}>Drop</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationMarker}>📍</Text>
            <Text style={styles.locationText}>
              {bookingData?.drop_address?.[0] || 'Drop address not available'}
            </Text>
          </View>
        </View>

        {/* BOOKING DATE/TIME */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Date & Time</Text>
          <View style={styles.dateTimeRow}>
            <Text style={styles.dateTimeLabel}>Booking Date</Text>
            <Text style={styles.dateTimeValue}>
              {bookingData?.booking_date ? formatDate(bookingData.booking_date) : 'N/A'}
            </Text>
          </View>
          <View style={styles.dateTimeRow}>
            <Text style={styles.dateTimeLabel}>Booking Time</Text>
            <Text style={styles.dateTimeValue}>
              {bookingData?.booking_time ? formatTime(bookingData.booking_time) : 'N/A'}
            </Text>
          </View>
        </View>

        {/* CUSTOMER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer Details</Text>
          <Text style={styles.customerDetail}>
            Name: {bookingData?.customer_name || 'N/A'}
          </Text>
          <Text style={styles.customerDetail}>
            Mobile Number: {bookingData?.customer_mobile || 'N/A'}
          </Text>
        </View>

        {/* PRICE */}
    

        {/* EMERGENCY */}
        <View style={styles.emergencySection}>
          <Text style={styles.emergencyTitle}>
            Call customer care in case of any emergency
          </Text>
          <Text style={styles.emergencySubtitle}>
            Press the call button if there's a query or complaint
          </Text>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Text style={styles.emergencyButtonIcon}>📞</Text>
            <Text style={styles.emergencyButtonText}>Emergency</Text>
          </TouchableOpacity>
        </View>

            <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Ambulance Cost</Text>
            <Text style={styles.priceValue}>₹ {Math.round(bookingData?.ambulance_cost || 0)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Additional charges for patient assistance</Text>
            <Text style={styles.priceValue}>₹ {bookingData?.assistent_amount || '0'}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Price</Text>
            <Text style={styles.totalValue}>₹ {bookingData?.total_amount || '0'}</Text>
          </View>
        </View>

        {/* STATUS */}
        <View style={styles.statusSection}>
          <Text style={styles.statusText}>
            Status: {bookingData?.status_text || 'Unknown'}
          </Text>
          <Text style={styles.otpText}>OTP: {bookingData?.otp || 'N/A'}</Text>
          <Text style={styles.bookingIdText}>
            Booking ID: {bookingData?.booking_id || 'N/A'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B46C1',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  debugContainer: {
    maxHeight: 200,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
  },
  debugSection: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  debugSectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 4,
  },
  debugSectionText: {
    fontSize: 10,
    color: '#92400E',
    fontFamily: 'monospace',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#6B46C1',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#6B7280',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerBackButton: {
    padding: 8,
  },
  headerBackButtonText: {
    fontSize: 24,
    color: '#374151',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  viewDetailsButton: {
    borderWidth: 1,
    borderColor: '#6B46C1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  viewDetailsText: {
    color: '#6B46C1',
    fontSize: 14,
    fontWeight: '500',
  },
  driverSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  driverDetails: {
    flex: 1,
    marginLeft: 12,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    fontSize: 16,
    marginRight: 4,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  vehicleNumber: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  callButton: {
    alignItems: 'center',
    marginLeft: 12,
  },
  callIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  callText: {
    fontSize: 12,
    color: '#6B46C1',
    fontWeight: '500',
  },
  locationSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationMarker: {
    fontSize: 16,
    color: '#EF4444',
  },
  locationText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeLabel: {
    fontSize: 14,
    color: '#374151',
  },
  dateTimeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  customerDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  emergencySection: {
    backgroundColor: '#6B46C1',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  emergencyTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  emergencySubtitle: {
    color: '#E5E7EB',
    fontSize: 12,
    marginBottom: 16,
  },
  emergencyButton: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 6,
  },
  emergencyButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  emergencyButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '500',
  },
  statusSection: {
    padding: 16,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  otpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  bookingIdText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default AmbulanceTrackingScreen;