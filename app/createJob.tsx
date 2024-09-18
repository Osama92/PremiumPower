import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
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
          userId: user.uid,
          email: user.email,
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

      {jobType === 'Generator Rental' && (
        <>
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
        </>
      )}

      <Button title="Create Job" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});
