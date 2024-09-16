import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, RefreshControl, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

export default function ViewProfile() {
  const [equipmentProfile, setEquipmentProfile] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [kva, setKva] = useState('');
  const [generatorType, setGeneratorType] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const firestore = getFirestore();
  const router = useRouter();
  
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
  
      const q = query(collection(firestore, 'Equipment Profile'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const profileData = querySnapshot.docs[0].data();
        setEquipmentProfile(profileData);
        setKva(profileData.kva || '');
        setGeneratorType(profileData.generatorType || '');
        setFuelType(profileData.fuelType || '');
        setLocation(profileData.location || '');
        setYear(profileData.year || '');
  
        // Fetch the image URL if stored in Firebase Storage
        if (profileData.imagePath) {
          const storage = getStorage();
          const imageRef = ref(storage, profileData.imagePath);
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        }
      } else {
        Alert.alert('Error', 'No profile found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  }, [auth, firestore]);

  const handleUpdateProfile = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      const q = query(collection(firestore, 'Equipment Profile'), where('email', '==', user.email));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref; // Get document reference
        
        await updateDoc(docRef, {
          kva,
          generatorType,
          fuelType,
          location,
          year,
        });

        Alert.alert('Success', 'Profile updated successfully');
        setIsEditing(false);
        fetchProfile(); // Refresh data after update
      } else {
        Alert.alert('Error', 'No profile found to update.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
    setRefreshing(false);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header with Edit Button */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Equipment Profile</Text>
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Ionicons name={isEditing ? 'checkmark' : 'pencil'} size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Display Image */}
        {imageUrl && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUrl }} style={styles.image} />
          </View>
        )}

        {/* Editable Fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Generator Type</Text>
          <TextInput
            value={generatorType}
            onChangeText={setGeneratorType}
            editable={isEditing}
            style={[styles.input, isEditing ? styles.editable : null]}
          />

          <Text style={styles.label}>KVA</Text>
          <TextInput
            value={kva}
            onChangeText={setKva}
            editable={isEditing}
            style={[styles.input, isEditing ? styles.editable : null]}
          />

          <Text style={styles.label}>Fuel Type</Text>
          <TextInput
            value={fuelType}
            onChangeText={setFuelType}
            editable={isEditing}
            style={[styles.input, isEditing ? styles.editable : null]}
          />

          <Text style={styles.label}>Location</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            editable={isEditing}
            style={[styles.input, isEditing ? styles.editable : null]}
          />

          <Text style={styles.label}>Year</Text>
          <TextInput
            value={year}
            onChangeText={setYear}
            editable={isEditing}
            style={[styles.input, isEditing ? styles.editable : null]}
          />
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  editable: {
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
