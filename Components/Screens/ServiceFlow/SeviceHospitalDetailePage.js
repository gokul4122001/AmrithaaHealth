import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  SafeAreaView,
  Dimensions,
  FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import logo from '../../Assets/logos.png';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../Colors/Colors';
const { width } = Dimensions.get('window');
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fonts from '../../Fonts/Fonts';
import CustomHeader from '../../../Header';

const HospitalDetails = ({ navigation }) => {
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);

  const specializations = [
    { id: '1', name: 'Nephrology', icon: '🫘', color: '#E8F4FD' },
    { id: '2', name: 'Bone Marrow', icon: '🦴', color: '#FFF2E8' },
    { id: '3', name: 'Pulmonologist', icon: '🫁', color: '#FDE8E8' },
    { id: '4', name: 'Surgery', icon: '⚕️', color: '#E8F8F4' },
    { id: '5', name: 'Anesthesiology', icon: '💉', color: '#F0E8FF' },
    { id: '6', name: 'Radiology', icon: '🩻', color: '#E8F4E8' },
    { id: '7', name: 'Cardiology', icon: '❤️', color: '#FFE8E8' },
    { id: '8', name: 'Emergency', icon: '🚨', color: '#E8FFE8' },
  ];

  const doctors = [
    {
      id: '1',
      name: 'Dr. Divya',
      specialty: 'Cardiologist',
      experience: '8 years exp',
      rating: 4.8,
      image: require('../../Assets/doc1.png'), // Use local image
      available: true,
    },
    {
      id: '2',
      name: 'Dr. Jai Shanker',
      specialty: 'Neurologist',
      experience: '12 years exp',
      rating: 4.9,
      image: require('../../Assets/doc1.png'), // Use local image
      available: false,
    },
  ];

  const hospitalPhotos = [
    {
      id: '1',
      uri: require('../../Assets/doc1.png'),
      title: 'Hospital Exterior',
    },
    {
      id: '2',
      uri: require('../../Assets/doc2.png'),
      title: 'Operating Room',
    },
    {
      id: '3',
      uri: require('../../Assets/doc1.png'),
      title: 'Hospital Room',
    },
  ];

  const reviews = [
    {
      id: '1',
      user: 'Ana Teal',
      rating: 4.3,
      comment: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      date: '2 days ago',
    },
    {
      id: '2',
      user: 'John Doe',
      rating: 4.3,
      comment: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
      date: '3 days ago',
    },
  ];

  const hospitalLocation = {
    latitude: 13.0478,
    longitude: 80.2619,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const SpecializationCard = ({ specialization }) => (
    <TouchableOpacity style={[styles.specializationCard, { backgroundColor: specialization.color }]}>
      <Text style={styles.specializationIcon}>{specialization.icon}</Text>
      <Text style={styles.specializationName}>{specialization.name}</Text>
    </TouchableOpacity>
  );

  const PhotoCard = ({ photo }) => (
    <View style={styles.photoCard}>
      <Image source={photo.uri} style={styles.photoImage} />
    </View>
  );

  const DoctorCard = ({ doctor }) => (
   <TouchableOpacity style={styles.doctorCard}>
    <View style={styles.imageContainer}>
      <Image source={doctor.image} style={styles.doctorImage} />
      <View style={styles.ratingBadge}>
        <Icon name="star" size={14} color="white" />
        <Text style={styles.ratingText}>{doctor.rating}</Text>
      </View>
    </View>
    <View style={styles.infoContainer}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
      <View style={styles.experienceRow}>
        <Icon name="verified" size={14} color="#4CAF50" />
        <Text style={styles.doctorExperience}>{doctor.experience}</Text>
      </View>
    </View>
  </TouchableOpacity>
  );

  const ReviewCard = ({ review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewUser}>{review.user}</Text>
        <View style={styles.reviewRating}>
          <Icon name="star" size={16} color="#FFD700" />
          <Text style={styles.reviewRatingText}>{review.rating}</Text>
        </View>
      </View>
      <Text style={styles.reviewComment}>{review.comment}</Text>
      <Text style={styles.reviewDate}>{review.date}</Text>
    </View>
  );

  const StarRating = ({ rating, onRatingChange }) => (
    <View style={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star.toString()}
          onPress={() => onRatingChange(star)}
        >
          <Icon
            name="star"
            size={24}
            color={star <= rating ? '#FFD700' : '#E0E0E0'}
            style={styles.star}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const timeSlots = [
    { id: '1', time: '10:00 am to 11:00 pm', available: true },
    { id: '2', time: '11:00 am to 12:00 pm', available: true },
    { id: '3', time: '02:00 pm to 03:00 pm', available: false },
    { id: '4', time: '03:00 pm to 04:00 pm', available: true },
  ];

  const facilities = [
    { id: '1', name: '24/7 Emergency Services', icon: 'local-hospital' },
    { id: '2', name: 'Trauma Center', icon: 'healing' },
    { id: '3', name: 'Advanced Diagnostic Imaging', icon: 'medical-services' },
    { id: '4', name: 'ICU and Surgical ICU', icon: 'airline-seat-flat' },
    { id: '5', name: 'Operation Theatres', icon: 'surgical' },
    { id: '6', name: 'Blood Bank', icon: 'bloodtype' },
    { id: '7', name: 'Pharmacy', icon: 'local-pharmacy' },
    { id: '8', name: 'Laboratory Services', icon: 'science' },
    { id: '9', name: 'Post-Operative Care & Monitoring', icon: 'monitor-heart' },
  ];

  const quickActions = [
    { id: '1', title: 'Patients', subtitle: '7,500+', icon: 'person', color: '#E8F4FD' },
    { id: '2', title: 'Years Exp', subtitle: '10+', icon: 'schedule', color: '#FFF2E8' },
    { id: '3', title: 'Rating', subtitle: '4.3', icon: 'star', color: '#FDE8E8' },
    { id: '4', title: 'Reviews', subtitle: '4,956', icon: 'rate-review', color: '#E8F8F4' },
  ];

  const ActionCard = ({ action }) => (
    <View style={[styles.actionCard, {  }]}>
      <Icon name={action.icon} size={24} color="#7518AA" />
      <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </View>
  );

  const TimeSlotCard = ({ slot }) => (
    <TouchableOpacity
      style={[
        styles.timeSlot,
        selectedTimeSlot === slot.id && styles.selectedTimeSlot,
        !slot.available && styles.unavailableTimeSlot,
      ]}
      onPress={() => slot.available && setSelectedTimeSlot(slot.id)}
      disabled={!slot.available}
    >
      <Text
        style={[
          styles.timeSlotText,
          selectedTimeSlot === slot.id && styles.selectedTimeSlotText,
          !slot.available && styles.unavailableTimeSlotText,
        ]}
      >
        {slot.time}
      </Text>
      {!slot.available && (
        <Text style={styles.unavailableLabel}>Not Available</Text>
      )}
    </TouchableOpacity>
  );

  const FacilityItem = ({ facility }) => (
    <View style={styles.facilityItem}>
      <View style={styles.facilityIcon}>
        <Icon name={facility.icon} size={20} color="#4A90E2" />
      </View>
      <Text style={styles.facilityText}>{facility.name}</Text>
    </View>
  );

  return (
   <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.statusBar}/>
    
          <LinearGradient
            colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
            style={styles.topBackground}
          >
       <CustomHeader
        title="My Reports"
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

       <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
         <TouchableOpacity onPress={() => navigation.goBack()}>
    <Ionicons name="chevron-back" size={20} color="#000" />
  </TouchableOpacity>
  <Text style={{            fontSize:  Fonts.size.PageHeading,
 fontWeight: 'bold', marginLeft: 8 }}>
   Hospital Details
  </Text>
 
</View>

        {/* Hospital Image */}
        <View style={styles.hospitalImageContainer}>
          <Image
            source={require('../../Assets/Hospital.png')}
            style={styles.hospitalImage}
          />
        
        </View>

        {/* Hospital Info */}
        <View style={styles.hospitalInfo}>
          <View style={styles.hospitalHeader}>
            <Text style={styles.hospitalName}>Dr. Kamakshi Memorial Hospital</Text>
            <View style={styles.ratingContainer}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>4.3</Text>
            </View>
          </View>
          <View style={styles.locationContainer}>
            <Icon name="location-on" size={20} color="red" />
            <Text style={styles.location}>
              No 3/1, 1st Street, West Mambalam, Chennai - 33
            </Text>
          </View>
          <View style={styles.timingContainer}>
            <Icon name="schedule" size={16} color="green" />
            <Text style={styles.timing}>Open 24 Hours</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <ActionCard key={action.id} action={action} />
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About us</Text>
          <Text style={styles.aboutText}>
            Dr. Kamakshi Memorial Hospital is established with the belief that healthcare should be driven by compassion and empathy. We understand that every patient who visits us is placing their trust in us, and we are committed to providing personalized, high-quality medical care. Our state-of-the-art facilities, combined with our team of experienced healthcare professionals, ensure that we can meet a wide range of medical needs.
          </Text>
        </View>

        {/* Available Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Time</Text>
          <View style={styles.daySchedule}>
            <View style={styles.dayInfo}>
              <Text style={styles.dayText}>Monday to Sunday</Text>
              <Text style={styles.holidayText}>Holiday</Text>
            </View>
            <Text style={styles.dayHours}>10:00 am to 11:00 pm</Text>
          </View>
          <Text style={styles.dayLabel}>Friday</Text>
          
          <View style={styles.timeSlotsContainer}>
            {timeSlots.map((slot) => (
              <TimeSlotCard key={slot.id} slot={slot} />
            ))}
          </View>
        </View>

        {/* Facilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilitiesList}>
            {facilities.map((facility) => (
              <FacilityItem key={facility.id} facility={facility} />
            ))}
          </View>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.specializationsGrid}>
            {specializations.map((specialization) => (
              <SpecializationCard key={specialization.id} specialization={specialization} />
            ))}
          </View>
        </View>

        {/* Photos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Photos</Text>
          <FlatList
            data={hospitalPhotos}
            renderItem={({ item }) => <PhotoCard photo={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photosContainer}
          />
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <View style={styles.addressContainer}>
            <Icon name="location-on" size={20} color="#4A90E2" />
            <Text style={styles.addressText}>
              No 3/1, 1st Street, West Mambalam, Chennai - 33
            </Text>
          </View>
          
          {/* Map */}
          <View style={styles.mapContainer}>
            {/* <MapView
              style={styles.map}
              initialRegion={hospitalLocation}
              scrollEnabled={false}
              zoomEnabled={false}
            >
              <Marker
                coordinate={{
                  latitude: hospitalLocation.latitude,
                  longitude: hospitalLocation.longitude,
                }}
                title="Dr. Kamakshi Memorial Hospital"
                description="No 3/1, 1st Street, West Mambalam, Chennai - 33"
              />
            </MapView> */}
            <TouchableOpacity style={styles.mapOverlay}>
              <Text style={styles.mapOverlayText}>Tap to open in Maps</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Doctors in Hospitals */}
       <View style={styles.section}>
  <Text style={styles.sectionTitle}>Doctors in Hospitals</Text>
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.horizontalScroll}
  >
    {doctors.map((doctor) => (
      <DoctorCard key={doctor.id} doctor={doctor} />
    ))}
  </ScrollView>
</View>


        {/* Reviews & Ratings */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
            <Text style={styles.reviewCount}>216 Reviews</Text>
          </View>
          
          {/* Overall Rating */}
          <View style={styles.overallRating}>
            <Text style={styles.overallRatingText}>Share your feedback</Text>
            <StarRating rating={selectedRating} onRatingChange={setSelectedRating} />
          </View>

          {/* Individual Reviews */}
          <View style={styles.reviewsList}>
            <Text style={styles.reviewsListTitle}>Reviews & Ratings</Text>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </View>
        </View>

 <View style={styles.buttonContainer}>
      {/* Call Hospital Button */}
      <TouchableOpacity style={styles.callButton}>
        <Icon name="call" size={18} color="#8E3FFF" style={{ marginRight: 8 }} />
        <Text style={styles.callText}>Call Hospital</Text>
      </TouchableOpacity>

      {/* Enquiry Now Button */}
    <TouchableOpacity onPress={() => navigation.navigate('EnquiryFormpage')}>
  <LinearGradient
    colors={['#7A00F9', '#9C3DFD']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.enquiryButton}
  >
    <Text style={styles.enquiryText}>Enquiry Now</Text>
  </LinearGradient>
</TouchableOpacity>

    </View>


      

        <View style={styles.bottomPadding} />
      </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 10,
  },
  doctorCard: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    elevation: 3,
    padding:10,
    marginBottom:5
  },
  imageContainer: {
    position: 'relative',
    height: 120,
    backgroundColor: '#EAF4FF',
  },
  doctorImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFB300',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#fff',
    marginLeft: 4,
                        fontSize:  Fonts.size.PageSubheading,

    fontWeight: 'bold',
        fontFamily:Fonts.family.regular,
  },
  infoContainer: {
    padding: 10,
  },
  doctorName: {
                     fontSize:  Fonts.size.PageSubheading,

    fontWeight: 'bold',
    color: '#000',
        fontFamily:Fonts.family.regular,
  },
  doctorSpecialty: {
                        fontSize:  Fonts.size.PageSubheading,

    color: '#555',
    marginVertical: 4,
        fontFamily:Fonts.family.regular,
  },
  experienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorExperience: {
                    fontSize:  Fonts.size.PageSubheading,
    color: '#555',
    marginLeft: 4,
        fontFamily:Fonts.family.regular,
  },
  headerRight: {
    flexDirection: 'row',
  },
  headerIcon: {
    marginLeft: 15,
  },
  headerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    marginRight: 15,
  },
  horizontalScroll: {
  paddingHorizontal: 10,
  paddingTop: 10,
},

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
        fontFamily:Fonts.family.regular,
  },
  content: {
    flex: 1,
    marginTop:20,
    marginBottom:20
  },
  hospitalImageContainer: {
    position: 'relative',
    height: 200,
    resizeMode:'cover'
  },
  hospitalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  hospitalBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  hospitalBadgeText: {
    color: '#fff',
           fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
        fontFamily:Fonts.family.regular,
  },
  hospitalInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  hospitalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  hospitalName: {
             fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
        fontFamily:Fonts.family.regular,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  rating: {
                 fontSize:  Fonts.size.PageSubheading,

  
    fontWeight: '600',
    color: '#333',
        fontFamily:Fonts.family.regular,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  location: {
                   fontSize:  Fonts.size.PageHeading,

    color: '#666',
    flex: 1,
    lineHeight: 18,
        fontFamily:Fonts.family.regular,
  },
  timingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timing: {
    marginLeft: 8,
                    fontSize:  Fonts.size.PageSubheading,

    color: 'green',
    fontWeight: '600',
        fontFamily:Fonts.family.regular,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionCard: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 3,
  },
  actionSubtitle: {
                   fontSize:  Fonts.size.PageSubheading,

    fontWeight: 'bold',
    color: '#333',
    marginTop: 5,
        fontFamily:Fonts.family.regular,
  },
  actionTitle: {
                   fontSize:  Fonts.size.PageSubheading,

    color: '#666',
    marginTop: 2,
        fontFamily:Fonts.family.regular,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
                  fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
        fontFamily:Fonts.family.regular,
  },
  aboutText: {
                    fontSize:  Fonts.size.PageSubheading,

    color: '#666',
    lineHeight: 22,
  },
  daySchedule: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  dayInfo: {
    flex: 1,
  },
  dayText: {
                    fontSize:  Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#333',
    
        fontFamily:Fonts.family.regular,

  },
  holidayText: {
                      fontSize:  Fonts.size.PageSubheading,

    color: '#FF6B6B',
    marginTop: 2,
        fontFamily:Fonts.family.regular,
  },
  dayHours: {
                       fontSize:  Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#4A90E2',
        fontFamily:Fonts.family.regular,
  },
  dayLabel: {
                       fontSize:  Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
        fontFamily:Fonts.family.regular,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  timeSlot: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    minWidth: (width - 60) / 2,
  },
  selectedTimeSlot: {
    borderColor: '#4A90E2',
    backgroundColor: '#E8F4FD',
  },
  unavailableTimeSlot: {
    backgroundColor: '#f5f5f5',
    borderColor: '#d0d0d0',
  },
  timeSlotText: {
                      fontSize:  Fonts.size.PageSubheading,

    color: '#333',
    textAlign: 'center',
        fontFamily:Fonts.family.regular,
  },
  selectedTimeSlotText: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  unavailableTimeSlotText: {
    color: '#999',
  },
  unavailableLabel: {
    fontSize: 10,
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 2,
        fontFamily:Fonts.family.regular,
  },
  facilitiesList: {
    gap: 15,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  facilityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F4FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  facilityText: {
                        fontSize:  Fonts.size.PageSubheading,

    color: '#333',
    flex: 1,
        fontFamily:Fonts.family.regular,
  },
  bookButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
  specializationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specializationCard: {
    width: (width - 60) / 4,
    aspectRatio: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  specializationIcon: {
    fontSize: 24,
    marginBottom: 8,
        fontFamily:Fonts.family.regular,
  },
  specializationName: {
                       fontSize:  Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 12,
        fontFamily:Fonts.family.regular,
  },
  photosContainer: {
    paddingRight: 20,
  },
  photoCard: {
    marginRight: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoImage: {
    width: 100,
    height: 100,
    resizeMode:'contain',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  addressText: {
                      fontSize:  Fonts.size.PageSubheading,


    color: '#666',
    flex: 1,
    lineHeight: 20,
        fontFamily:Fonts.family.regular,
  },
  mapContainer: {
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapOverlayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewCount: {
                      fontSize:  Fonts.size.PageSubheading,

    color: '#4A90E2',
    fontWeight: '600',
        fontFamily:Fonts.family.regular,
  },
  overallRating: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  overallRatingText: {
                      fontSize:  Fonts.size.PageSubheading,

    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
        fontFamily:Fonts.family.regular,
  },
  starRating: {
    flexDirection: 'row',
  },
  star: {
    marginHorizontal: 5,
  },
  reviewsList: {
    marginTop: 10,
  },
  reviewsListTitle: {
                     fontSize:  Fonts.size.PageHeading,

    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
        fontFamily:Fonts.family.regular,
  },
  reviewCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewUser: {
                        fontSize:  Fonts.size.PageSubheading,

    fontWeight: 'bold',
    color: '#333',
        fontFamily:Fonts.family.regular,
  },
  reviewRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewRatingText: {
                       fontSize:  Fonts.size.PageSubheading,

    fontSize: 14,
    fontWeight: '600',
    color: '#333',
        fontFamily:Fonts.family.regular,
  },
  reviewComment: {
                       fontSize:  Fonts.size.PageSubheading,

    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
        fontFamily:Fonts.family.regular,
  },
  reviewDate: {
                      fontSize:  Fonts.size.PageSubheading,

    color: '#999',
        fontFamily:Fonts.family.regular,
  },
   buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginVertical: 20,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F2FF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginRight: 10,
  },
  callText: {
    color: '#8E3FFF',
    fontWeight: '600',
                      fontSize:  Fonts.size.PageSubheading,

        fontFamily:Fonts.family.regular,
  },
  enquiryButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  enquiryText: {
    color: '#fff',
    fontWeight: '600',
                      fontSize:  Fonts.size.PageSubheading,

        fontFamily:Fonts.family.regular,
  },
    topBackground: {
        paddingTop: hp('4%'),
        paddingBottom: hp('2%'),
        paddingHorizontal: wp('4%'),
        height: hp('100%'),
      },
      
});

export default HospitalDetails;