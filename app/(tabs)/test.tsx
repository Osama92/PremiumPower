import React, { useState, useEffect } from 'react';
import { Text, View, Pressable, StyleSheet, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { ActivityIndicator } from 'react-native';

export default function Test() {
  const [username, setUsername] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUsername();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handlePress = (jobType: string) => {
    setSelectedJob(jobType);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome, {username}!</Text>

      <View style={styles.pressableContainer}>
        <Pressable style={styles.pressable} onPress={() => handlePress('Active Jobs')}>
          <Text style={styles.pressableText}>Active Jobs</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => handlePress('Pending Jobs')}>
          <Text style={styles.pressableText}>Pending Jobs</Text>
        </Pressable>
        <Pressable style={styles.pressable} onPress={() => handlePress('Completed Jobs')}>
          <Text style={styles.pressableText}>Completed Jobs</Text>
        </Pressable>
      </View>

      {selectedJob && (
        <Text style={styles.selectedJobText}>You have selected: {selectedJob}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    //justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pressableContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  pressable: {
    padding: 15,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  pressableText: {
    color: '#00443F',
    fontWeight: 'bold',
    fontSize: 12,
  },
  selectedJobText: {
    fontSize: 15,
    marginTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
