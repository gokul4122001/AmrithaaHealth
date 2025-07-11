import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput,
  Animated,ImageBackground,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
const ProfileScreen = ({ navigation }) => {
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [isLogoutPopupVisible, setIsLogoutPopupVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    contactNumber: '',
  });

  const menuItems = [
    {
      id: 1,
      title: 'My Profile',
      icon: 'person',
      isActive: true,
    },
    {
      id: 2,
      title: 'Change Password',
      icon: 'lock',
      isActive: false,
    },
    {
      id: 3,
      title: 'Emergency Contact',
      icon: 'phone',
      isActive: false,
    },
    {
      id: 4,
      title: 'My Reports',
      icon: 'description',
      isActive: false,
    },
    {
      id: 5,
      title: 'Terms and Conditions',
      icon: 'article',
      isActive: false,
    },
    {
      id: 6,
      title: 'Logout',
      icon: 'logout',
      isActive: false,
    },
  ];

 const handleMenuPress = (item) => {
  setSelectedItem(item.id);  // mark the clicked item as active
  console.log(`Pressed: ${item.title}`);

  switch (item.title) {
    case 'My Profile':
      navigation.navigate('Profileone');
      break;
    case 'Change Password':
      navigation.navigate('ChangePassword');
      break;
    case 'Emergency Contact':
      setIsEmergencyModalVisible(true);
      break;
    case 'My Reports':
      navigation.navigate('MyReport');
      break;
    case 'Terms and Conditions':
      navigation.navigate('TermsAndConditionsScreen');
      break;
    case 'Logout':
      setIsLogoutPopupVisible(true);
      break;
    default:
      break;
  }
};


  const handleSaveEmergencyContact = () => {
    console.log('Emergency Contact Saved:', emergencyContact);
    setIsEmergencyModalVisible(false);

    setTimeout(() => {
      navigation.navigate('EmergencyContactScreen');
    }, 300);
  };

  const handleCancelEmergencyContact = () => {
    setIsEmergencyModalVisible(false);
    setEmergencyContact({ name: '', contactNumber: '' });
  };

  const handleLogout = () => {
    setIsLogoutPopupVisible(false);
    // Add your logout logic here
    console.log('User logged out');
    // Example: navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const handleCancelLogout = () => {
    setIsLogoutPopupVisible(false);
  };

  const renderBottomTab = (iconName, label, isActive = false) => (
    <TouchableOpacity style={styles.tabItem}>
      <Icon 
        name={iconName} 
        size={24} 
        color={isActive ? '#8B5CF6' : '#9CA3AF'} 
      />
      {label && (
        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />
      
   <ScrollView showsVerticalScrollIndicator={false}  contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.content}>
     <ImageBackground
  source={require('../../Assets/profileframe.png')}
  style={styles.profileCardBackground}
  imageStyle={{ borderRadius: 12 }}
>
  <View style={styles.profileCard}>
    <Image
      source={{
        uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face&auto=format',
      }}
      style={styles.avatar}
    />
    <Text style={styles.userName}>Jeswanth Kumar</Text>
  </View>
</ImageBackground>


      <View style={{top:'15%',left:'4%'}}>
          {menuItems.map((item, index) => (
  <TouchableOpacity
    key={item.id}
    style={[
      styles.menuItem,
      selectedItem === item.id && styles.activeMenuItem,
      index === 0 && { marginTop: 20 }  
    ]}
    onPress={() => handleMenuPress(item)}
  >
    <ScrollView>
    <View style={styles.menuItemContent}>
      <Icon
        name={item.icon}
        size={25}
        color={selectedItem === item.id ? '#7518AA' : '#6B7280'}
        style={styles.menuIcon}
      />
      <Text
        style={[
          styles.menuText,
          selectedItem === item.id && styles.activeMenuText,
        ]}
      >
        {item.title}
      </Text>
    </View>
</ScrollView>
  </TouchableOpacity>
))}
</View>


      </View>

      {/* Emergency Contact Modal */}
      <Modal
        visible={isEmergencyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsEmergencyModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Emergency Contact</Text>
              <TouchableOpacity
                onPress={handleCancelEmergencyContact}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Add your emergency contact so an enterprise call will be made in case of an emergency
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter Name"
                  placeholderTextColor="#9CA3AF"
                  value={emergencyContact.name}
                  onChangeText={(text) => 
                    setEmergencyContact(prev => ({ ...prev, name: text }))
                  }
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contact Number *</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter contact number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={emergencyContact.contactNumber}
                  onChangeText={(text) => 
                    setEmergencyContact(prev => ({ ...prev, contactNumber: text }))
                  }
                />
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleCancelEmergencyContact}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEmergencyContact}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Logout Popup */}
      <Modal
        visible={isLogoutPopupVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLogoutPopupVisible(false)}
      >
        <View style={styles.logoutOverlay}>
          <View style={styles.logoutPopup}>
            <View style={styles.logoutContent}>
              <View style={styles.logoutIconContainer}>
                <Icon name="logout" size={24} color="#EF4444" />
              </View>
              <Text style={styles.logoutTitle}>Note</Text>
              <Text style={styles.logoutMessage}>
                Selected Vehicle is unavailable{'\n'}
                try another Vehicle
              </Text>
              
              <View style={styles.logoutButtons}>
                <TouchableOpacity
                  style={styles.logoutCancelButton}
                  onPress={handleCancelLogout}
                >
                  <Text style={styles.logoutCancelText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.logoutConfirmButton}
                  onPress={handleLogout}
                >
                  <Text style={styles.logoutConfirmText}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
</ScrollView>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
  top:-10
  
  },
profileCard: {
  backgroundColor: '#ffff', // light/transparent background
  borderRadius: 12,
  padding: 24,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
  width: '50%', 
  marginTop: 10, 
  alignSelf: 'center',
  position:'absolute',
  top:'60%'
},
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    marginBottom: 12,
  },
  userName: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight:'800',
    color: '#4a4a4a',
     fontFamily:Fonts.family.regular
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    

  },
menuItem: {
  marginTop: 5,
  paddingHorizontal: 20,
  paddingVertical: 20,
  borderBottomColor: '#F3F4F6',
},

  activeMenuItem: {
    borderLeftWidth: 7,
    borderLeftColor: '#7518AA',
    borderRadius:10
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
  fontSize:  Fonts.size.PageHeading,
    color: '#6B7280',
    fontWeight: '800',
     fontFamily:Fonts.family.regular
  },
  activeMenuText: {
    color: '#7518AA',
    fontWeight: '600',
     fontFamily:Fonts.family.regular
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
     fontFamily:Fonts.family.regular
  },
  activeTabLabel: {
    color: '#8B5CF6',
     fontFamily:Fonts.family.regular
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
     fontFamily:Fonts.family.regular
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
   fontSize:  Fonts.size.PageHeading,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
     fontFamily:Fonts.family.regular
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
  fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
     fontFamily:Fonts.family.regular
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  fontSize:  Fonts.size.PageHeading,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
   fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#6B7280',
     fontFamily:Fonts.family.regular
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#7518AA',
    alignItems: 'center',
  },
  saveButtonText: {
  fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#FFFFFF',
     fontFamily:Fonts.family.regular
  },
  // Logout Popup Styles
  logoutOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 100, 
    paddingHorizontal: 20,
  },
  logoutPopup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '90%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  logoutContent: {
    padding: 24,
    alignItems: 'center',
  },
  logoutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutTitle: {
 fontSize:  Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
     fontFamily:Fonts.family.regular
  },
  logoutMessage: {
    fontSize:  Fonts.size.PageHeading,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
     fontFamily:Fonts.family.regular
  },
  logoutButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  logoutCancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logoutCancelText: {
  fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#6B7280',
     fontFamily:Fonts.family.regular
  },
  logoutConfirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#7416B2',
    alignItems: 'center',
  },
  logoutConfirmText: {
  fontSize:  Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#FFFFFF',
     fontFamily:Fonts.family.regular
  },
profileCardBackground: {
  width: '100%',
  height: 230, 
  justifyContent: 'flex-start', 
  paddingTop: 20, 
},


});

export default ProfileScreen;