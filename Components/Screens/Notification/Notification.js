import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,  TouchableOpacity,
} from 'react-native';
import { useSelector } from 'react-redux'; 
import { Notification_Api } from '../APICall/NotificationApi';
import LottieView from 'lottie-react-native';
import CustomHeader from '../../../Header'; 
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';


const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState({
    today: [],
    yesterday: [],
    thisWeek: [],
  });
  const [loading, setLoading] = useState(true);

  const token = useSelector(state => state.auth?.token);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await Notification_Api(token);

        const today = [];
        const yesterday = [];
        const thisWeek = [];

        data?.notifications?.forEach(item => {
          const createdDate = new Date(item.created_at);
          const now = new Date();
          const diffDays = Math.floor(
            (now - createdDate) / (1000 * 60 * 60 * 24),
          );

          if (diffDays === 0) {
            today.push(item);
          } else if (diffDays === 1) {
            yesterday.push(item);
          } else if (diffDays <= 7) {
            thisWeek.push(item);
          }
        });

        setNotifications({ today, yesterday, thisWeek });
      } catch (err) {
        console.log('Fetch Notifications Error:', err);
        Alert.alert('Error', 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const NotificationItem = ({ notification }) => (
    <View style={styles.notificationItem}>
      <View style={styles.iconContainer}>
        <Icon name="local-hospital" size={24} color="#8B5CF6" />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationText}>{notification.message}</Text>
        {notification.created_at && (
          <Text style={styles.notificationTime}>
            {new Date(notification.created_at).toLocaleString()}
          </Text>
        )}
      </View>
    </View>
  );

  const NotificationSection = ({ title, data }) =>
    data.length > 0 && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {data.map(notification => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </View>
    );

  // ✅ Check if all sections are empty
  const isEmpty =
    notifications.today.length === 0 &&
    notifications.yesterday.length === 0 &&
    notifications.thisWeek.length === 0;

  return (
    <LinearGradient
      colors={['#ffffff', '#C3DFFF']}
      start={{ x: 0, y: 0.3 }}
      end={{ x: 0, y: 0 }}
      style={styles.topBackground}>
      
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />

        {/* ✅ Reusable Header */}
        <CustomHeader />

<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 ,
  top:'3%'
}}>
  <TouchableOpacity onPress={() => navigation.goBack()}>
    <Icon name="arrow-back" size={24} color="#374151" />
  </TouchableOpacity>
  <Text style={{ fontSize: 18, fontWeight: '600', color: '#374151', marginLeft: '10%' }}>
    Notifications
  </Text>
</View>


        {/* Loader */}
        {loading ? (
          <View style={styles.centerContent}>
            <LottieView
              source={require('../../Assets/lottie/Loading1.json')}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          
          </View>
        ) : isEmpty ? (
          // No Data Animation
          <View style={styles.centerContent}>
            <LottieView
              source={require('../../Assets/lottie/NoData.json')}
              autoPlay
              loop={false}
              style={{ width: 250, height: 250 }}
            />
        
          </View>
        ) : (
          <ScrollView
            style={styles.notificationsList}
            showsVerticalScrollIndicator={false}>
            <NotificationSection title="Today" data={notifications.today} />
            <NotificationSection title="Yesterday" data={notifications.yesterday} />
            <NotificationSection title="This week" data={notifications.thisWeek} />
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  topBackground: {
     paddingTop: hp('4%'),
      paddingBottom: hp('2%'),
      paddingHorizontal: wp('4%'),
      height: hp('100%'),
  },
  container: { flex: 1, backgroundColor: 'transparent' },
  notificationsList: { flex: 1, paddingHorizontal: 16 },
  section: { marginTop: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: { flex: 1 },
  notificationText: { fontSize: 14, color: '#374151', lineHeight: 20 },
  notificationTime: { fontSize: 12, color: '#6B7280', marginTop: 4 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
  noDataText: { marginTop: 12, fontSize: 16, color: '#374151', fontWeight: '500' },
});

export default NotificationScreen;
