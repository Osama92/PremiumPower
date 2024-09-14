import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function ViewEditProfile() {
  const auth = getAuth();
  const user = auth.currentUser;

  const [generatorType, setGeneratorType] = useState('');
  const [kva, setKva] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const firestore = getFirestore();
        const profileRef = doc(firestore, 'Equipment Profile', user?.email ?? '');
        const profileSnapshot = await getDoc(profileRef);

        if (profileSnapshot.exists()) {
          const data = profileSnapshot.data();
          setGeneratorType(data?.generatorType);
          setKva(data?.kva);
          setFuelType(data?.fuelType);
          setLocation(data?.location);
          setYear(data?.year);
          setImage(data?.imageUrl);
          setProfileId(profileSnapshot.id);
        } else {
          Alert.alert('Error', 'No profile found.');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
    if (!generatorType || !kva || !fuelType || !location || !year) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setUploading(true);

    try {
      const firestore = getFirestore();
      const profileRef = doc(firestore, 'Equipment Profile', profileId ?? '');

      let downloadURL = image; // Keep the old image URL unless a new one is uploaded

      if (image && typeof image !== 'string') {
        // If a new image is selected
        const storage = getStorage();
        const storageRef = ref(storage, `equipmentImages/${user?.uid}/${Date.now()}.jpg`);
        const imgBlob = await fetch(image).then((res) => res.blob());
        await uploadBytes(storageRef, imgBlob);
        downloadURL = await getDownloadURL(storageRef);
      }

      await updateDoc(profileRef, {
        generatorType,
        kva,
        fuelType,
        location,
        year,
        imageUrl: downloadURL,
      });

      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setUploading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // Set the new image URI
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Edit Equipment Profile
        </Text>

        <Text>Generator Type</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
          value={generatorType}
          onChangeText={setGeneratorType}
        />

        <Text>KVA</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
          value={kva}
          onChangeText={setKva}
        />

        <Text>Fuel Type</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
          value={fuelType}
          onChangeText={setFuelType}
          placeholder="Diesel or Petrol"
        />

        <Text>Location</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
          value={location}
          onChangeText={setLocation}
        />

        <Text>Year</Text>
        <TextInput
          style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
          value={year}
          onChangeText={setYear}
        />

        <Text>Image</Text>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, marginBottom: 15 }}
          />
        )}
        <TouchableOpacity onPress={pickImage}>
          <Text style={{ color: 'blue' }}>Pick an image</Text>
        </TouchableOpacity>

        <Button
          title={uploading ? 'Updating...' : 'Update Profile'}
          onPress={handleUpdateProfile}
          disabled={uploading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
