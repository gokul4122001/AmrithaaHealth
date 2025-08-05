import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import {  
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../Colors/Colors';
import Fonts from '../../Fonts/Fonts';
import CustomHeader from '../../../Header';
import CurrentBookingTab from './CurrentBookingTab';
import ScheduleBookingTab from './ScheduleBookingTab';
import CompleteBookingTab from './CompleteBookingTab';
import CancellationBookingTab from './CancelBookingTab';

const BookingListScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('current');
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDate, setCustomDate] = useState(new Date());

  const tabs = [
    { id: 'current', label: 'Emergency Booking', key: 'current' },
    { id: 'schedule', label: 'Schedule Booking', key: 'schedule' },
    { id: 'complete', label: 'Completed Booking', key: 'complete' },
    { id: 'cancellation', label: 'Cancelled Booking', key: 'cancellation' },
  ];

  const dateFilterOptions = [
    { id: 1, label: 'Today', value: 'today' },
    { id: 2, label: 'Yesterday', value: 'yesterday' },
    { id: 3, label: 'This Week', value: 'thisWeek' },
    { id: 4, label: 'Last Month', value: 'lastMonth' },
    { id: 5, label: 'Select Date', value: 'selectDate', icon: 'calendar' },
  ];

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
  };

  const handleDateFilterSelect = (option) => {
    setSelectedDateFilter(option.label);
    setShowDateDropdown(false);
    if (option.value === 'selectDate') {
      setShowDatePicker(true);
    }
  };

  const renderTabButton = (tab) => (
    <TouchableOpacity
      key={tab.id}
      style={[styles.tabButton, activeTab === tab.key && styles.activeTabButton]}
      onPress={() => handleTabChange(tab.key)}
    >
      <Text style={[styles.tabButtonText, activeTab === tab.key && styles.activeTabButtonText]}>
        {tab.label}
      </Text>
    </TouchableOpacity>
  );

  const renderDateDropdownMenu = () => {
    if (!showDateDropdown) return null;

    return (
      <View style={styles.dropdownMenuContainer}>
        {dateFilterOptions.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.dropdownMenuItem,
              selectedDateFilter === item.label && styles.selectedDropdownItem,
              index !== 0 && styles.dropdownSeparator,
            ]}
            onPress={() => handleDateFilterSelect(item)}
          >
            <Text
              style={[
                styles.dropdownMenuText,
                selectedDateFilter === item.label && styles.selectedDropdownItemText,
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'current':
        return <CurrentBookingTab  />;
      case 'schedule':
        return <ScheduleBookingTab />;
      case 'complete':
        return <CompleteBookingTab dateFilter={selectedDateFilter} />;
      case 'cancellation':
        return <CancellationBookingTab dateFilter={selectedDateFilter} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      <LinearGradient
        colors={['#ffffff', '#C3DFFF']}
        start={{ x: 0, y: 0.8 }}
        end={{ x: 0, y: 0 }}
        style={styles.headerBackground}
      >
        <CustomHeader
          username="Janmani Kumar"
          onNotificationPress={() => console.log('Notification Pressed')}
          onWalletPress={() => console.log('Wallet Pressed')}
        />

        <View style={styles.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icons name="chevron-back" size={24} />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Booking List</Text>
          </View>
          {(activeTab === 'complete' || activeTab === 'cancellation') && (
  <View style={styles.inlineDateDropdownContainer}>
    <TouchableOpacity
      style={styles.dateDropdownButton}
      onPress={() => setShowDateDropdown(!showDateDropdown)}
    >
      <Text style={styles.dateDropdownText}>{selectedDateFilter}</Text>
      <Icons name="chevron-down" size={20} color="#666" />
    </TouchableOpacity>
  </View>
)}


        </View>
      </LinearGradient>

      <View style={styles.content}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabScrollContent}
        >
          {tabs.map(renderTabButton)}
        </ScrollView>

        <View style={styles.tabContent}>{renderTabContent()}</View>
      </View>

      {renderDateDropdownMenu()}

      {showDatePicker && (
        <DateTimePicker
          value={customDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            if (selectedDate) {
              setCustomDate(selectedDate);
              setSelectedDateFilter(selectedDate.toDateString());
            }
            setShowDatePicker(false);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  headerBackground: {
    paddingBottom: hp('1.2%'),
    paddingHorizontal: wp('4%'),
    paddingTop: '4%',
  },
  content: { flex: 1, backgroundColor: '#F5F5F5' },
  tabContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    maxHeight: hp('8%'),
  },
  tabScrollContent: { alignItems: 'center', paddingRight: wp('4%') },
  tabButton: {
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1.5%'),
    marginRight: wp('5%'),
    borderRadius: 10,
    backgroundColor: 'white',
    minWidth: wp('42%'),
    alignItems: 'center',
    elevation: 5,
    minHeight: wp('10%'),
  },
  activeTabButton: { backgroundColor: Colors.statusBar || '#007AFF' },
  tabButtonText: { fontSize: Fonts.size.PageHeading, color: '#666', fontWeight: '600' },
  activeTabButtonText: { color: 'white' },
  tabContent: { flex: 1, backgroundColor: '#fff' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 10,
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  inlineDateDropdownContainer: { marginLeft: wp('2%'), alignItems: 'flex-end' },
  dateDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    minWidth: wp('25%'),
    justifyContent: 'space-between',
  },
  dateDropdownText: {
    fontSize: Fonts.size.PageHeading,
    color: '#333',
    fontWeight: '500',
    marginRight: wp('2%'),
  },
  dropdownMenuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? hp('20%') : hp('18%'),
    right: wp('4%'),
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    paddingVertical: hp('1%'),
    zIndex: 999,
    minWidth: wp('45%'),
  },
  dropdownMenuItem: {
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('4%'),
  },
  dropdownSeparator: {
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    borderStyle: 'dashed',
  },
  dropdownMenuText: {
    fontSize: Fonts.size.PageHeading,
    color: '#333',
    fontWeight: '500',
  },
  selectedDropdownItem: {
    backgroundColor: '#F0F8FF',
  },
  selectedDropdownItemText: {
    color: Colors.statusBar || '#007AFF',
    fontWeight: '600',
  },
});

export default BookingListScreen;
