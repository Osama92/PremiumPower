import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Ensure Firebase is set up properly
import { useFonts } from 'expo-font';

export default function RecoverPassword() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load custom fonts (Montserrat)
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  });

  // Validate if email is registered and send reset email
  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Validation', 'Please enter an email address.');
      return;
    }

    setIsLoading(true);
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Success', 'Password reset email sent! Check your inbox.');
    } catch (error: any) {
      // Check error codes for different reasons email might fail
      if (error.code === 'auth/user-not-found') {
        Alert.alert('Error', 'No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Error', 'Invalid email format.');
      } else {
        Alert.alert('Error', 'Failed to send password reset email. Try again later.');
      }
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
        <Text style={styles.title}>Recover Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your registered email"
          placeholderTextColor="#00443F"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset} disabled={isLoading}>
          <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send Reset Email'}</Text>
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
    fontFamily: 'Montserrat',
    fontSize: 16,
  },
});
