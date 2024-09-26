import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, RefreshControl, Button, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, orderBy, deleteDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import {router} from 'expo-router'

interface Job {
  id: string;
  createdBy: string;
  createdAt: Date;
  status: string;
  assignedTo?: string;
  jobType: string;
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
      const q = query(jobsRef, orderBy('createdAt', 'asc')); // Sort by creation date (oldest first)
      const querySnapshot = await getDocs(q);

      const fetchedJobs: Job[] = [];
      querySnapshot.forEach((doc) => {
        const jobData = doc.data();
        fetchedJobs.push({
          id: doc.id,
          createdBy: jobData.createdBy,
          createdAt: new Date(jobData.createdAt.seconds * 1000),
          status: jobData.status,
          assignedTo: jobData.assignedTo,
          jobType: jobData.jobType
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

  const handleRemove = async (jobId: string) => {
    try {
      const firestore = getFirestore();
      const jobRef = doc(firestore, 'Jobs', jobId);
      await deleteDoc(jobRef); // Delete the job from Firestore
      Alert.alert('Success', 'Job removed successfully.');
      fetchJobs(); // Refresh jobs after deletion
    } catch (error) {
      console.error('Error removing job:', error);
      Alert.alert('Error', 'Failed to remove job.');
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
     <>
      <View style={styles.jobRow}>
        <Text style={styles.text}>Created by: {item.createdBy}</Text>
        <Text style={styles.text}>Job Type: {item.jobType}</Text>
        <Text style={styles.text}>Created at: {item.createdAt.toDateString()}</Text>

        {/* Job Status and Save Button in Row */}
        <View style={styles.row}>
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

          {/* Save Button */}
            <View style={styles.actionBtn}>
            <TouchableOpacity onPress={() => handleSave(item.id)} style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRemove(item.id)} style={{marginTop:10,justifyContent: 'center',alignItems: 'center'}}>
              <Text style={{color:'red'}}>Remove Job</Text>
            </TouchableOpacity>
            </View>
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

        {/* Display Assigned Engineer (if exists) */}
        {item.assignedTo && !isAssignedTo && (
          <Text style={styles.text}>Assigned to: {item.assignedTo}</Text>
        )}
      </View>
      </>
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
      <>
      <View style={{height: 80, width: '100%', flexDirection: 'row',justifyContent:'space-between', alignItems: 'center'}}>
      <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain" />
      <TouchableOpacity onPress={()=>router.replace('/(tabs)')}>
        <Text style={{marginRight:20}}>Back</Text>
      </TouchableOpacity>
      </View>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={renderJobItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  jobRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  pickerContainer: {
    width: 200,
    marginRight: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  saveBtn: {
    backgroundColor: '#00443F',
    width:'100%',
    height: 40,
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 5,
    marginRight: 10
  },
  btnText: {
    color: '#fff'
  },
  logosize: {
    height: '100%',
    width: 120,
    marginLeft: 20
  },
  actionBtn:{
    flexDirection:'column',
    width: '10%'
  }
});

export default jobManagementScreen;
