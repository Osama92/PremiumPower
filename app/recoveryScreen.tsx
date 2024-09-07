import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Alert as RNAlert } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'; // Ensure Firebase is set up properly
import { useFonts } from 'expo-font';
import { useRouter } from 'expo-router'; // Import useRouter for navigation

export default function RecoverPassword() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Initialize router for navigation

  // Load custom fonts (Montserrat)
  const [fontsLoaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  });

  // Platform-agnostic alert function
  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      window.alert(`${title}: ${message}`);
    } else {
      RNAlert.alert(title, message);
    }
  };

  // Validate if email is registered and send reset email
  const handlePasswordReset = async () => {
    if (!email) {
      showAlert('Validation', 'Please enter an email address.');
      return;
    }

    setIsLoading(true);
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
      showAlert('Success', 'Password reset email sent! Check your inbox.');

      // Navigate back to the previous screen after successful password reset
      router.back(); // Go back to the previous screen
    } catch (error: any) {
      // Check error codes for different reasons email might fail
      if (error.code === 'auth/user-not-found') {
        showAlert('Error', 'No account found with this email address.');
      } else if (error.code === 'auth/invalid-email') {
        showAlert('Error', 'Invalid email format.');
      } else {
        showAlert('Error', 'Failed to send password reset email. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled={Platform.OS !== 'web'} // Disable KeyboardAvoidingView for web
    >
      <View style={styles.innerContainer}>
        <View style={styles.logoHolder}>
          <Image source={require('../assets/images/Secure data.png')} style={styles.logo} resizeMode="contain" />
        </View>
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
    fontFamily: 'Montserrat',
    fontSize: 16,
  },
  logoHolder: {
    width: '50%',
    height: '30%',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});
