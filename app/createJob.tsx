import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, TouchableOpacity } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';


export default function CreateJobScreen() {
  const [jobType, setJobType] = useState<string | null>(null); // Ensure it's a string or null
  const [selectedKVA, setSelectedKVA] = useState<string | null>(null); // Ensure it's a string or null
  const [kvaOptions, setKvaOptions] = useState<string[]>([]);
  const router = useRouter();

  const kvaRange = Array.from({ length: 10 }, (_, i) => `${(i + 1) * 20}KVA`);

  const handleJobTypeChange = (value: string) => {
    setJobType(value);
    if (value === 'Generator Rental') {
      setKvaOptions(kvaRange);
    } else {
      setKvaOptions([]);
      setSelectedKVA(null);
    }
  };

  const handleSubmit = async () => {
    if (!jobType) {
      Alert.alert('Error', 'Please select a job type.');
      return;
    }
    if (jobType === 'Generator Rental' && !selectedKVA) {
      Alert.alert('Error', 'Please select a KVA range.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const firestore = getFirestore();
        const jobRef = collection(firestore, 'Jobs');

        await addDoc(jobRef, {
          jobType,
          kvaRange: selectedKVA || null,
          createdBy: user.email,
          status: 'pending',
          createdAt: new Date(),
        });

        Alert.alert('Success', 'Job created successfully!');
        router.replace('/(tabs)'); // Navigate back to home screen
      } else {
        Alert.alert('Error', 'User is not authenticated.');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      Alert.alert('Error', 'Failed to create the job. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={{height: 80, width: '100%', flexDirection: 'row',justifyContent:'space-between', alignItems: 'center'}}>
      <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain" />
      <TouchableOpacity onPress={()=>router.replace('/(tabs)')}>
        <Text style={{marginRight:20}}>Back</Text>
      </TouchableOpacity>
      </View>

      <View style={styles.selectJobView}>
      <Text style={styles.label}>Select Job Type:</Text>
      <Picker
        selectedValue={jobType} // string or null
        onValueChange={(value: any) => handleJobTypeChange(value)}
        style={styles.picker}
      >
        <Picker.Item label="Select Job Type" value={null} />
        <Picker.Item label="Generator Repair" value="Generator Repair" />
        <Picker.Item label="Generator Rental" value="Generator Rental" />
        <Picker.Item label="Generator Servicing" value="Generator Servicing" />
      </Picker>
      </View>
      

      {jobType === 'Generator Rental' && (
        <>
        <View style={styles.generatorRental}>
          <Text style={styles.label}>Select KVA Range:</Text>
          <Picker
            selectedValue={selectedKVA} // string or null
            onValueChange={(value) => setSelectedKVA(value)}
            style={styles.picker}
          >
            <Picker.Item label="Select KVA Range" value={null} />
            {kvaOptions.map((kva) => (
              <Picker.Item key={kva} label={kva} value={kva} />
            ))}
          </Picker>
          </View>
        </>
      )}

   

      <TouchableOpacity style={styles.createJob} onPress={handleSubmit}>
        <Text style={{color: 'white'}}>Create Job</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    marginLeft: 20
  },
  picker: {
    height: 40,
    marginBottom: 20
  },
  logosize: {
    height: '100%',
    width: 120,
    marginLeft: 20
  },
  selectJobView: {
    width: '100%',
    height: '30%',
  },
  generatorRental: {
    width: '100%',
    height: '30%',
    marginTop: 30
  },
  createJob: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    width:'100%',
    backgroundColor:'#00443F',
    marginTop:20
  }
});

