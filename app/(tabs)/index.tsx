import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, FlatList, StyleSheet, Alert, TouchableOpacity, Modal, RefreshControl, Platform, Image } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {useFonts} from 'expo-font'

export default function HomeScreen() {

  const [loaded] = useFonts({
    Montserrat: require('../../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../../assets/fonts/Montserrat-ExtraBold.ttf'),
  });

  const [isMenuVisible, setMenuVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [designation, setDesignation] = useState<string | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const auth = getAuth();
  const firestore = getFirestore();

  // Fetch user data and jobs
  const fetchUserAndJobs = async () => {
    try {
      const user = auth.currentUser;

      if (user) {
        // Fetch user data from Firestore
        const usersRef = collection(firestore, 'Users');
        const q = query(usersRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            setDesignation(userData?.designation);
            setUsername(userData.username);
          });

          // Fetch jobs created by the user
          // const jobsRef = collection(firestore, 'Jobs');
          // const jobsQuery = query(jobsRef, where('createdBy', '==', user.email));
          // const jobsSnapshot = await getDocs(jobsQuery);
          const jobsRef = collection(firestore, 'Jobs');
          const jobsQuery = query(jobsRef, where('assignedTo', '==', "User02"));
          const createdQuery = query(jobsRef, where('createdBy', '==', user.email));
          //const jobsSnapshot = await getDocs(jobsQuery);
          const [assignedSnapshot, createdSnapshot] = await Promise.all([
            getDocs(jobsQuery),
            getDocs(createdQuery),
          ]);

          const fetchedJobs: any[] = [];
          const completed: any[] = [];

          // jobsSnapshot.forEach((doc) => {
          //   const job = doc.data();
          //   if (job.status === 'completed') {
          //     completed.push({ id: doc.id, ...job });
          //   } else {
          //     fetchedJobs.push({ id: doc.id, ...job });
          //   }
          // });

          // setJobs(fetchedJobs);
          // setCompletedJobs(completed);
          // Merge results from both queries
        [...assignedSnapshot.docs, ...createdSnapshot.docs].forEach((doc) => {
          const job = { id: doc.id, ...doc.data() };
          if (job.status === 'completed') {
            completed.push(job);
          } else {
            fetchedJobs.push(job);
          }
        });

        // Remove duplicates if any
        const uniqueJobs = (arr: any[]) => {
          const map = new Map();
          arr.forEach((job) => map.set(job.id, job));
          return Array.from(map.values());
        };

        setJobs(uniqueJobs(fetchedJobs));
        setCompletedJobs(uniqueJobs(completed));
      
        }
      } else {
        Alert.alert('Error', 'User is not authenticated.');
      }
    } catch (error) {
      console.error('Error fetching user and jobs:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again later.');
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchUserAndJobs();
  }, []);

  // Refresh jobs
  const refreshJobs = async () => {
    setRefreshing(true);
    await fetchUserAndJobs();
    setRefreshing(false);
  };

  // Sign out function
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        Alert.alert('Signed Out', 'You have been signed out.');
        router.replace('/'); // Redirect to login screen after sign out
      })
      .catch((error) => {
        Alert.alert('Error', 'Sign out failed. Please try again.');
        console.error('Sign out error:', error);
      });
  };

  // Toggle side menu
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Close modal and navigate
  const closeModalAndNavigate = (path: any) => {
    setMenuVisible(false);
    router.push(path);
  };

  // Mark job as completed
  const markJobAsCompleted = async (jobId: string) => {
    try {
      const jobRef = doc(firestore, 'Jobs', jobId);
      await updateDoc(jobRef, {
        status: 'completed',
      });
      Alert.alert('Success', 'Job marked as completed.');
      refreshJobs();
    } catch (error) {
      console.error('Error marking job as completed:', error);
      Alert.alert('Error', 'Failed to update job status.');
    }
  };

  // Render each job item
  const renderJobItem = ({ item }: { item: any }) => (
    <View style={styles.jobItem}>
      <View>
      <Text>Job Type: {item.jobType}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Assigned To: {item.assignedTo}</Text>
      </View>
      {item.status !== 'completed' && (
        <Pressable  style={styles.jobcompletion} onPress={() => markJobAsCompleted(item.id)}>
          <Text style={styles.completeButton}>Mark as Completed</Text>
        </Pressable>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{height: 80, width: '100%'}}>
      <Image source={require('../../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain" />
      </View>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={30} color="#00443F" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome, {username}!</Text>
      </View>

      {/* Create Job Button */}
      <View style={styles.createJobContainer}>
        {designation === 'Customer' && (
          <>
          <TouchableOpacity
          onPress={() => router.push('/createJob')} 
        >
          <View style={styles.addIcon}><Text style={styles.addIconText}>+</Text></View>
        </TouchableOpacity>
        <Text style={styles.createJobText}>Create a New Job</Text>
        
        </>
        )}
      </View>

      {/* Jobs List */}
      <Text style={styles.sectionTitle}>Pending Jobs</Text>
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />}
      />

      <Text style={styles.sectionTitle}>Completed Jobs</Text>
      <FlatList
        data={completedJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshJobs} />}
      />

      {/* Side Menu Modal */}
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMenu}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            {designation === "Customer" && (
              <>
                <TouchableOpacity style={styles.menuItem} onPress={() => closeModalAndNavigate('/viewEditProfile')}>
                  <Text style={styles.menuText}>My Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => closeModalAndNavigate('/createEquipmentProfile')}>
                  <Text style={styles.menuText}>Create a Profile for My Equipment</Text>
                </TouchableOpacity>
              </>
            )}

            {/* Sign Out */}
            <Pressable style={styles.menuItem} onPress={handleSignOut}>
              <Text style={styles.menuText}>Sign Out</Text>
            </Pressable>

            {/* Admin Menu */}
            
            {designation === 'Admin' && (
              <>
              <TouchableOpacity style={styles.menuItem} onPress={() => closeModalAndNavigate('/masterAdmin')}>
                <Text style={styles.menuText}>Create User</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.menuItem} onPress={() => closeModalAndNavigate('/jobManagementScreen')}>
                <Text style={styles.menuText}>View Jobs</Text>
              </TouchableOpacity>
              </>
            )}

            {/* Close Button */}
            <Pressable style={styles.closeButton} onPress={toggleMenu}>
              <Text style={styles.closeButtonText}>Close Menu</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 0 : 40,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  logosize: {
    height: '100%',
    width: 120,
    marginLeft: 15,
  },
  headerText: {
    fontSize: 20,
    marginLeft: 20,
    fontWeight: '800'
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  createJobContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 20,
    flexDirection: 'row-reverse'
  },
 
  createJobText: {
    color: '#00443F',
    fontSize: 14,
    marginRight: 10
  },
  addIcon: {
    width:40,
    height:40,
    borderRadius:20,
    backgroundColor: '#00443F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:20
  },
  addIconText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#fff'
  },
  
  jobItem: {
    padding: 20,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  completeButton: {
    color: '#fff',
    marginTop: 10,
    fontSize: 10,
    fontFamily: 'Montserrat'
  },
  jobcompletion: {
    backgroundColor: '#00443F',
    padding: 10,
    borderRadius: 10
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  menuItem: {
    marginVertical: 10,
    paddingVertical: 40,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 18,
    color: '#00443F',
    fontFamily: 'Montserrat'
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007BFF',
  },
});
