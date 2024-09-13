import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useRouter } from 'expo-router';

export default function CreateEquipmentProfile() {
  const [generatorType, setGeneratorType] = useState('');
  const [kva, setKva] = useState('');
  const [fuelType, setFuelType] = useState('Diesel'); // Default to Diesel
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri); // Correct way to access the image URI
    }
  };

  const handleCreateProfile = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      Alert.alert('Error', 'User not authenticated.');
      return;
    }

    if (!generatorType || !kva || !fuelType || !location || !year || !image) {
      Alert.alert('Error', 'Please fill out all fields and select an image.');
      return;
    }

    setUploading(true);

    try {
      // Upload image to Firebase Storage
      const storage = getStorage();
      const storageRef = ref(storage, `equipmentImages/${user.uid}/${Date.now()}.jpg`);
      const imgBlob = await fetch(image).then((res) => res.blob());

      await uploadBytes(storageRef, imgBlob);
      const downloadURL = await getDownloadURL(storageRef);

      // Store data in Firestore
      const firestore = getFirestore();
      const profileRef = collection(firestore, 'EquipmentProfile');
      await addDoc(profileRef, {
        email: user.email,
        generatorType,
        kva,
        fuelType,
        location,
        year,
        imageUrl: downloadURL, // Storing the uploaded image URL
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Equipment profile created successfully!');
      router.push('/_sitemap'); // Redirect after creation
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Failed to create equipment profile.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100} // Adjust this value depending on your layout
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Create Equipment Profile</Text>

        <TouchableOpacity onPress={handleImagePick} style={styles.imagePicker}>
          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <Text>Select an Image</Text>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Generator Type"
          value={generatorType}
          onChangeText={setGeneratorType}
        />

        <TextInput
          style={styles.input}
          placeholder="KVA"
          keyboardType="numeric"
          value={kva}
          onChangeText={setKva}
        />

        <Picker
          selectedValue={fuelType}
          onValueChange={(itemValue) => setFuelType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Diesel" value="Diesel" />
          <Picker.Item label="Petrol" value="Petrol" />
        </Picker>

        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Year"
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
        />

        <TouchableOpacity
          style={[styles.button, uploading ? styles.disabledButton : null]}
          onPress={handleCreateProfile}
          disabled={uploading}
        >
          <Text style={styles.buttonText}>{uploading ? 'Uploading...' : 'Create Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
