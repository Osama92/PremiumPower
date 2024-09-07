import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Assuming you are using Firebase Auth for the user
import { useFonts } from 'expo-font'; // Import useFonts from expo-font

export default function masterAdmin() {
  const [username, setUsername] = useState<string>('');
  const [designation, setDesignation] = useState<string>('');
  const [location, setLocation] = useState<string>(''); // Location state added
  const [isLoading, setIsLoading] = useState(false);

  // Load custom fonts (Montserrat)
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return null; // Render nothing or a loader until the fonts are loaded
  }

  const handleCreateUser = async () => {
    if (!username || !designation || !location) {
      Alert.alert('Validation', 'Please fill all fields.');
      return;
    }

    setIsLoading(true);

    const db = getFirestore();
    const auth = getAuth(); // Optional if you need the logged-in user's information

    try {
      // Add user details to the 'Users' collection
      await addDoc(collection(db, 'Users'), {
        username,
        designation,
        location, // Added location to Firebase document
        createdBy: auth.currentUser?.email ?? 'unknown', // You can track the user who created this if needed
        createdAt: new Date(),
      });

      Alert.alert('Success', 'User created successfully!');
      setUsername('');
      setDesignation('');
      setLocation('');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to create user. Please try again.');
      console.error('Error creating user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Create User</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#00443F"
          onChangeText={setUsername}
          value={username}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Designation"
          placeholderTextColor="#00443F"
          onChangeText={setDesignation}
          value={designation}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Location" // Added location field
          placeholderTextColor="#00443F"
          onChangeText={setLocation}
          value={location}
        />

        <TouchableOpacity style={styles.button} onPress={handleCreateUser} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Creating...' : 'Create User'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  title: {
    fontFamily: 'MontserratBold',
    fontSize: 28,
    marginBottom: 20,
    color: '#00443F',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00443F',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: 'Montserrat',
    color: '#00443F',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00443F',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'MontserratBold',
    fontSize: 16,
  },
});
