import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Alert, TouchableOpacity, Modal, Platform } from 'react-native';
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const firestore = getFirestore();
          const usersRef = collection(firestore, 'Users');
          const q = query(usersRef, where('email', '==', user.email)); // Assuming the 'Users' collection has an 'email' field
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
              const userData = doc.data();
              if (userData?.username) {
                setUsername(userData.username);
              } else {
                Alert.alert('Error', 'No username found for this user.');
              }
            });
          } else {
            Alert.alert('Error', 'No such user found in the Users collection.');
          }
        } else {
          Alert.alert('Error', 'User is not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        Alert.alert('Error', 'Failed to fetch user data. Please try again later.');
      }
    };

    fetchUsername();
  }, []);

  const handleSignOut = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        Alert.alert('Signed Out', 'You have been signed out.');
        router.replace('/index'); // Redirect to login screen after sign out
      })
      .catch((error) => {
        Alert.alert('Error', 'Sign out failed. Please try again.');
        console.error('Sign out error:', error);
      });
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  return (
    <View style={styles.container}>
      {/* Header with Hamburger Icon */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu}>
          <MaterialIcons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Welcome, {username}!</Text>
      </View>

      {/* Side Menu Modal */}
      <Modal
        visible={isMenuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={toggleMenu}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menu}>
            {/* My Profile */}
            <Link href="/my-profile" style={styles.menuItem} onPress={toggleMenu}>
              <Text style={styles.menuText}>My Profile</Text>
            </Link>

            {/* Create a Profile for My Equipment */}
            <Link href="/create-equipment-profile" style={styles.menuItem} onPress={toggleMenu}>
              <Text style={styles.menuText}>Create a Profile for My Equipment</Text>
            </Link>

            {/* Sign Out */}
            <Pressable style={styles.menuItem} onPress={handleSignOut}>
              <Text style={styles.menuText}>Sign Out</Text>
            </Pressable>

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
    paddingTop: Platform.OS === 'web' ? 0 : 40, // Add padding for mobile
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
  },
  headerText: {
    fontSize: 20,
    marginLeft: 20,
  },
  menuContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menu: {
    width: '80%', // Menu takes 80% of the screen width
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  menuItem: {
    marginVertical: 10,
    paddingVertical: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 18,
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
