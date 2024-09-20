import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, Button } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

interface Job {
  id: string;
  createdBy: string;
  createdAt: Date;
  status: string;
  assignedTo?: string;
}

interface User {
  id: string;
  name: string;
}

const jobManagementScreen = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [engineers, setEngineers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [jobStatus, setJobStatus] = useState<{ [jobId: string]: string }>({});
  const [selectedEngineer, setSelectedEngineer] = useState<{ [jobId: string]: string }>({});

  useEffect(() => {
    fetchJobs();
    fetchEngineers();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const firestore = getFirestore();
      const jobsRef = collection(firestore, 'Jobs');
      const querySnapshot = await getDocs(jobsRef);

      const fetchedJobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        const jobData = doc.data();
        fetchedJobs.push({
          id: doc.id,
          createdBy: jobData.createdBy,
          createdAt: new Date(jobData.createdAt.seconds * 1000),
          status: jobData.status,
          assignedTo: jobData.assignedTo,
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

  const handleSave = async (jobId: string) => {
    const assignedEngineerId = selectedEngineer[jobId];
    const assignedEngineer = engineers.find((eng) => eng.id === assignedEngineerId);
    const status = jobStatus[jobId] || 'Awaiting Approval';

    if (!assignedEngineer && status === 'Assigned to') {
      Alert.alert('Error', 'Please assign an engineer.');
      return;
    }

    try {
      const firestore = getFirestore();
      const jobRef = doc(firestore, 'Jobs', jobId);

      const updateData = {
        status,
        assignedTo: assignedEngineer ? assignedEngineer.name : '',
      };

      await updateDoc(jobRef, updateData);
      Alert.alert('Success', 'Job updated successfully.');
      fetchJobs(); // Refresh jobs after update
    } catch (error) {
      console.error('Error updating job:', error);
      Alert.alert('Error', 'Failed to update job.');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchJobs();
    setRefreshing(false);
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    const isAssignedTo = jobStatus[item.id] === 'Assigned to';

    return (
      <View style={styles.jobRow}>
        <Text style={styles.text}>{item.createdBy}</Text>
        <Text style={styles.text}>{item.createdAt.toDateString()}</Text>
        
        {/* Job Status Picker */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={jobStatus[item.id] || item.status}
            onValueChange={(value: string) => {
              setJobStatus({ ...jobStatus, [item.id]: value });

              if (value === 'Assigned to') {
                setSelectedEngineer({ ...selectedEngineer, [item.id]: '' });
              }
            }}
          >
            <Picker.Item label="Awaiting Approval" value="Awaiting Approval" />
            <Picker.Item label="Approved" value="Approved" />
            <Picker.Item label="Assigned to" value="Assigned to" />
          </Picker>
        </View>

        {/* Engineer Picker (Conditional) */}
        {isAssignedTo && (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedEngineer[item.id]}
              onValueChange={(engineerId: string) => {
                setSelectedEngineer({ ...selectedEngineer, [item.id]: engineerId });
              }}
            >
              <Picker.Item label="Select Engineer" value="" />
              {engineers.map((engineer) => (
                <Picker.Item key={engineer.id} label={engineer.name} value={engineer.id} />
              ))}
            </Picker>
          </View>
        )}

        {/* Display Save Button */}
        <Button title="Save" onPress={() => handleSave(item.id)} />

        {/* Display Assigned Engineer (if exists) */}
        {item.assignedTo && !isAssignedTo && (
          <Text style={styles.text}>Assigned to: {item.assignedTo}</Text>
        )}
      </View>
    );
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
        renderItem={renderJobItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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
    flexDirection: 'column',
    justifyContent: 'space-between',
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

export default jobManagementScreen;
