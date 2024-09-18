import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';

interface Job {
  id: string;
  createdBy: string;
  dateCreated: string;
  status: string;
}

interface User {
  id: string;
  name: string;
}

const JobManagementScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [engineers, setEngineers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const firestore = getFirestore();
        const jobsRef = collection(firestore, 'Jobs');
        const querySnapshot = await getDocs(jobsRef);

        const fetchedJobs: Job[] = [];
        querySnapshot.forEach((doc) => {
          const jobData = doc.data();
          fetchedJobs.push({
            id: doc.id,
            createdBy: jobData.createdBy,
            dateCreated: jobData.dateCreated,
            status: jobData.status,
          });
        });

        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchEngineers = async () => {
      try {
        const firestore = getFirestore();
        const usersRef = collection(firestore, 'Users');
        const q = query(usersRef, where('designation', '==', 'Engineer'));
        const querySnapshot = await getDocs(q);

        const fetchedEngineers: User[] = [];
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          fetchedEngineers.push({
            id: doc.id,
            name: userData.username,
          });
        });

        setEngineers(fetchedEngineers);
      } catch (error) {
        console.error('Error fetching engineers:', error);
      }
    };

    fetchJobs();
    fetchEngineers();
  }, []);

  const handleStatusChange = async (jobId: string, status: string) => {
    try {
      const firestore = getFirestore();
      const jobRef = doc(firestore, 'Jobs', jobId);
      await updateDoc(jobRef, { status });
      Alert.alert('Success', 'Job status updated successfully.');
    } catch (error) {
      console.error('Error updating job status:', error);
      Alert.alert('Error', 'Failed to update job status.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.jobRow}>
            <Text style={styles.text}>{item.createdBy}</Text>
            <Text style={styles.text}>{item.dateCreated}</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={item.status}
                onValueChange={(value: any) => handleStatusChange(item.id, value)}
              >
                <Picker.Item label="Awaiting Approval" value="Awaiting Approval" />
                <Picker.Item label="Approved" value="Approved" />
                <Picker.Item label="Assigned to" value="Assigned to" />
              </Picker>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
  },
  pickerContainer: {
    width: 200,
  },
});

export default JobManagementScreen;