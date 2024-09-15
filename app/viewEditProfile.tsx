import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, ScrollView, StyleSheet, RefreshControl, Image, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

export default function EquipmentProfile() {
  const [equipmentProfile, setEquipmentProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [generatorType, setGeneratorType] = useState('');
  const [kva, setKva] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const firestore = getFirestore();
        const q = query(collection(firestore, 'Equipment Profile'), where('email', '==', user.email));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const profileData = querySnapshot.docs[0].data();
          setEquipmentProfile(profileData);
          setGeneratorType(profileData.generatorType);
          setKva(profileData.kva);
          setFuelType(profileData.fuelType);
          setLocation(profileData.location);
          setYear(profileData.year);

          // Fetch the image URL from Firebase Storage
          if (profileData.image) {
            const storage = getStorage();
            const imageRef = ref(storage, profileData.image);
            const url = await getDownloadURL(imageRef);
            setImageUrl(url);
          }
        } else {
          Alert.alert('No Profile Found', 'No equipment profile found for the current user.');
        }
      } else {
        Alert.alert('Error', 'User is not authenticated.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProfile();
  };

  const handleUpdateProfile = async () => {
    if (equipmentProfile) {
      try {
        const firestore = getFirestore();
        const docRef = doc(firestore, 'Equipment Profile', equipmentProfile.id);

        await updateDoc(docRef, {
          generatorType,
          kva,
          fuelType,
          location,
          year,
        });

        Alert.alert('Success', 'Profile updated successfully!');
        fetchProfile(); // Refresh data after update
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile.');
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.profileContainer}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />}
        <Text style={styles.label}>Generator Type:</Text>
        <TextInput style={styles.input} value={generatorType} onChangeText={setGeneratorType} />

        <Text style={styles.label}>KVA:</Text>
        <TextInput style={styles.input} value={kva} onChangeText={setKva} />

        <Text style={styles.label}>Fuel Type:</Text>
        <TextInput style={styles.input} value={fuelType} onChangeText={setFuelType} />

        <Text style={styles.label}>Location:</Text>
        <TextInput style={styles.input} value={location} onChangeText={setLocation} />

        <Text style={styles.label}>Year:</Text>
        <TextInput style={styles.input} value={year} onChangeText={setYear} />

        <Button title="Update Profile" onPress={handleUpdateProfile} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    alignSelf: 'center',
  },
});
