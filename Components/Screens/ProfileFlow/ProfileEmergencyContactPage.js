import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import logo from '../../Assets/logos.png';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fonts from '../../Fonts/Fonts';
import Colors from '../../Colors/Colors';
import LottieView from 'lottie-react-native';
import {
  EmergencyAPI,
  AddEmergencyContactAPI,
  EditEmergencyContactAPI,
  DeleteEmergencyContactAPI
} from '../APICall/EmergencyFlowApiCall';
import { useSelector } from 'react-redux';

const EmergencyContactScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [editingContactId, setEditingContactId] = useState(null);
  const [isEmergencyModalVisible, setIsEmergencyModalVisible] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState({
    name: '',
    contactNumber: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
    const token = useSelector(state => state.auth.token);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await EmergencyAPI(token);
      setContacts(response.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      Alert.alert('Error', 'Failed to fetch emergency contacts');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchContacts();
  };

  const handleEditContact = (contact) => {
    setEmergencyContact({ name: contact.name, contactNumber: contact.mobile });
    setEditingContactId(contact.id);
    setIsEmergencyModalVisible(true);
  };

  const handleAddContact = () => {
    setEmergencyContact({ name: '', contactNumber: '' });
    setEditingContactId(null);
    setIsEmergencyModalVisible(true);
  };

  const handleSaveEmergencyContact = async () => {
    if (!emergencyContact.name || !emergencyContact.contactNumber) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);


      if (editingContactId) {
        // Update existing contact
        const updatedContact = {
          id: editingContactId,
          name: emergencyContact.name,
          mobile: emergencyContact.contactNumber
        };

        await EditEmergencyContactAPI(token, updatedContact);
        await fetchContacts(); // Refresh the list after update
        
        Alert.alert('Success', 'Contact updated successfully');
      } else {
        // Add new contact
        const newContact = {
          name: emergencyContact.name,
          mobile: emergencyContact.contactNumber
        };

        await AddEmergencyContactAPI(token, newContact);
        await fetchContacts(); // Refresh the list after add
        
        Alert.alert('Success', 'Contact added successfully');
      }

      setIsEmergencyModalVisible(false);
      setEmergencyContact({ name: '', contactNumber: '' });
      setEditingContactId(null);
    } catch (error) {
      console.error('Error saving contact:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to save contact');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContact = async (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              await DeleteEmergencyContactAPI(token, contactId);
              await fetchContacts(); // Refresh the list after delete
              Alert.alert('Success', 'Contact deleted successfully');
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'Failed to delete contact');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleCancelEmergencyContact = () => {
    setIsEmergencyModalVisible(false);
    setEmergencyContact({ name: '', contactNumber: '' });
    setEditingContactId(null);
  };

  const renderContactItem = (contact) => (
    <View key={contact.id} style={styles.contactItem}>
      <View style={styles.contactContent}>
        <View style={[styles.avatarContainer, { backgroundColor: contact.color || '#4F7DB6' }]}>
          <Text style={styles.avatarText}>
            {contact.name && contact.name.length > 0 ? contact.name.charAt(0).toUpperCase() : '?'}
          </Text>
        </View>

        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contact.name}</Text>
          <Text style={styles.contactNumber}>Contact no: {contact.mobile}</Text>
        </View>
      </View>

      <View style={styles.contactActions}>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => handleEditContact(contact)}
        >
          <Icon name="edit" size={16} color="#7518AA" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
        
      
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar} />

      <LinearGradient colors={['#ffffff', '#C3DFFF']} start={{ x: 0, y: 0.3 }} end={{ x: 0, y: 0 }} style={styles.topBackground}>
        <View style={styles.header}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>Hi, Welcome</Text>
            <Text style={styles.userName}>Janmani Kumar</Text>
          </View>
          <TouchableOpacity style={[styles.notificationButton, { right: hp('2%') }]}>
            <Icon name="notifications-on" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.notificationButton, { backgroundColor: 'red' }]}>
            <MaterialCommunityIcons name="alarm-light-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Icon name="chevron-left" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.pageTitle}>Emergency Contact</Text>
            <TouchableOpacity style={styles.addContactButton} onPress={handleAddContact}>
              <Icon name="add" size={16} color="#FFFFFF" />
              <Text style={styles.addContactText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          {isLoading && contacts.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#7518AA" />
            </View>
          ) : contacts.length > 0 ? (
            <View style={styles.contactsList}>
              {contacts.map(renderContactItem)}
            </View>
          ) : (
         <View style={styles.emptyState}>
  <LottieView
    source={require('../../Assets/lottie/NoData.json')} // 👈 use your local Lottie JSON
    autoPlay
    loop
    style={styles.lottie}
  />
  
  
</View>

          )}
        </ScrollView>
      </LinearGradient>

      {/* Emergency Contact Modal */}
      <Modal
        visible={isEmergencyModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCancelEmergencyContact}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingContactId ? 'Edit Contact' : 'Add Emergency Contact'}
              </Text>
              <TouchableOpacity onPress={handleCancelEmergencyContact} style={styles.closeButton}>
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              {editingContactId
                ? 'Update your emergency contact details'
                : 'Add your emergency contact so an enterprise call will be made in case of an emergency'}
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
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEmergencyContact}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editingContactId ? 'Update' : 'Save'}
                  </Text>
                )}
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
    backgroundColor: '#F3F4F6',
  },
  headerGradient: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 8,
  },
  welcomeSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: '#E0E7FF',
    fontWeight: '400',
  },
  welcomeName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  titleSection: {
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: Fonts.size.PageHeading,
    color: '#4a4a4a',
    fontWeight: '700',
    fontFamily: Fonts.family.regular
  },
  addContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7518AA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7518AA',
  },
  addContactText: {
    color: '#FFFFFF',
    fontSize: Fonts.size.PageSubSubHeading,
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: Fonts.family.regular
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  contactsList: {
    marginBottom: 20,
  },
  contactItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    width: '100%',
    alignSelf: 'center',
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    fontFamily: Fonts.family.regular
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: Fonts.family.regular
  },
  contactNumber: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    fontFamily: Fonts.family.regular
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editText: {
    color: '#7518AA',
    fontSize: Fonts.size.PageHeading,
    marginLeft: 4,
    fontFamily: Fonts.family.regular
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginLeft: 8,
  },
  deleteText: {
    color: '#FF0000',
    fontSize: Fonts.size.PageHeading,
    marginLeft: 4,
    fontFamily: Fonts.family.regular
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  
lottie: {
  width: 200,
  height: 200,
top:'50%'

},
 emptyStateTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  color: '#374151',
  marginBottom: 8,
},

emptyStateText: {
  fontSize: 14,
  color: '#6B7280',
  textAlign: 'center',
  marginBottom: 20,
},

addFirstContactButton: {
  backgroundColor: '#2563EB',
  paddingVertical: 12,
  paddingHorizontal: 20,
  borderRadius: 8,
},

addFirstContactText: {
  color: '#FFFFFF',
  fontSize: 16,
  fontWeight: '600',
},

  topBackground: {
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    height: hp('100%'),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: wp('10%'),
    height: hp('5%'),
    resizeMode: 'contain',
  },
  greetingContainer: {
    flex: 1,
    marginLeft: wp('3%'),
  },
  greeting: {
    fontSize: Fonts.size.TopHeading,
    color: 'black',
    opacity: 0.9,
    fontFamily: Fonts.family.regular
  },
  userName: {
    fontSize: Fonts.size.TopSubheading,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: Fonts.family.regular
  },
  notificationButton: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    fontSize: Fonts.size.PageHeading,
    fontWeight: '600',
    color: '#1F2937',
    fontFamily: Fonts.family.regular
  },
  closeButton: {
    padding: 4,
  },
  modalSubtitle: {
    fontSize: Fonts.size.PageHeading,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 20,
    fontFamily: Fonts.family.regular
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: Fonts.family.regular
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: Fonts.size.PageHeading,
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
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Fonts.family.regular
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
    fontSize: Fonts.size.PageHeading,
    fontWeight: '500',
    color: '#FFFFFF',
    fontFamily: Fonts.family.regular
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
});

export default EmergencyContactScreen;