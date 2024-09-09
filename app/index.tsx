// import { useState } from 'react';
// import { Text, View, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
// import { useFonts } from 'expo-font';
// import { Link, useRouter } from 'expo-router';
// import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// export default function Index() {
//   const [loaded] = useFonts({
//     Montserrat: require('../assets/fonts/Montserrat.ttf'),
//     MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf')
//   });

//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false); // State for loading spinner
//   const router = useRouter();

//   const handleLogin = () => {
//     setLoading(true); // Start loading spinner
//     const auth = getAuth();
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         setLoading(false); // Stop loading spinner
//         // router.push('/(tabs)'); // Redirect to Dashboard screen
//         router.push('/masterAdmin')
//       })
//       .catch((error) => {
//         setLoading(false); // Stop loading spinner
//         setError('Forgot Password? Recover it here');
//         Alert.alert('Invalid Email or Password')
//       });
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       enabled
//     >
//       <View style={styles.container}>
//         <View style={styles.LogoSection}>
//           <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain" />
//         </View>
//         <View style={styles.editArea}>
//           <Text style={styles.regularText}>Welcome Back</Text>
//           <Text style={styles.bigText}>LOGIN</Text>
//           <View style={styles.inputSection}>
//             <TextInput
//               style={styles.inputArea}
//               placeholder="Enter Email"
//               placeholderTextColor={'#00443F'}
//               value={email}
//               onChangeText={setEmail}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//             <TextInput
//               style={styles.inputArea1}
//               placeholder="Enter Password"
//               placeholderTextColor={'#00443F'}
//               value={password}
//               onChangeText={setPassword}
//               secureTextEntry
//             />
//             {error ? <Link href={'/recoveryScreen'} asChild>
//             <TouchableOpacity style={styles.loginErrorView}>
//               <Text style={styles.errorText}>{error}</Text>
//             </TouchableOpacity>
//             </Link> : null}
//           </View>
//           <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
//             {loading ? (
//               <ActivityIndicator size="small" color="#FFFFFF" />
//             ) : (
//               <Text style={styles.loginText}>Login</Text>
//             )}
//           </TouchableOpacity>
//           <View style={styles.coa}>
//             <Text style={{ fontSize: 12 }}>Don’t have a Login access?</Text>
//             <TouchableOpacity>
//               <Link href={'/signUp'} asChild>
//                 <Text style={{ fontSize: 12, color: '#F1B20A', fontWeight: '700' }}> Request a Login here</Text>
//               </Link>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//     justifyContent: 'center',
//   },
//   regularText: {
//     fontFamily: 'Montserrat',
//     fontSize: 16,
//     paddingLeft: 15,
//     paddingTop: 80,
//     fontWeight: '200'
//   },
//   bigText: {
//     fontFamily: 'Montserrat',
//     fontSize: 40,
//     paddingLeft: 15,
//   },
//   LogoSection: {
//     width: '100%',
//     height: '10%',
//     alignItems: 'flex-start',
//     justifyContent: 'center',
//     marginTop: 30
//   },
//   logosize: {
//     height: '100%',
//     width: 120,
//     marginLeft: 15,
//   },
//   editArea: {
//     width: '100%',
//     height: '80%',
//   },
//   inputSection: {
//     width: '100%',
//     height: 150,
//     marginTop: 20,
//     marginLeft: 20,
//   },
//   inputArea: {
//     backgroundColor: '#f2f2f2',
//     height: 50,
//     borderRadius: 10,
//     paddingLeft: 10,
//     color: '#00443F'
//   },
//   inputArea1: {
//     backgroundColor: '#f2f2f2',
//     height: 50,
//     borderRadius: 10,
//     paddingLeft: 10,
//     marginTop: 20,
//     color: '#00443F'
//   },
//   loginBtn: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#00443F',
//     marginLeft: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 10,
//   },
//   loginText: {
//     color: 'white',
//   },
//   errorText: {
//     color: 'red',
//     //marginLeft: 20,
//     marginTop: 5,
//   },
//   coa: {
//     width: '100%',
//     height: 40,
//     marginLeft: 20,
//     alignItems: 'center',
//     marginTop: 15,
//     flexDirection: 'row',
//   },
//   loginErrorView: {
//     width: '100%',
//     height: 40,
//   }

// });

import { useState } from 'react';
import { Text, View, StyleSheet, Image, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

export default function Index() {
  const [loaded] = useFonts({
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    MontserratBold: require('../assets/fonts/Montserrat-ExtraBold.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading spinner
  const router = useRouter();

  const handleLogin = () => {
    setLoading(true); // Start loading spinner
    const auth = getAuth();
    const firestore = getFirestore();

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        setLoading(false); // Stop loading spinner

        const user = userCredential.user;

        // Query the Firestore Users collection to find the user's designation
        const usersRef = collection(firestore, 'Users');
        const q = query(usersRef, where('createdBy', '==', email)); // Assuming Users collection has email field
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          const { designation } = userData;

          // Conditionally navigate based on the designation
          if (designation === 'Admin') {
            router.push('/masterAdmin');
          } else {
            router.push('/(tabs)');
          }
        } else {
          Alert.alert('Error', 'User not found in Firestore.');
        }
      })
      .catch((error) => {
        setLoading(false); // Stop loading spinner
        setError('Forgot Password? Recover it here');
        Alert.alert('Invalid Email or Password');
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <View style={styles.container}>
        <View style={styles.LogoSection}>
          <Image source={require('../assets/images/PPS.png')} style={styles.logosize} resizeMode="contain" />
        </View>
        <View style={styles.editArea}>
          <Text style={styles.regularText}>Welcome Back</Text>
          <Text style={styles.bigText}>LOGIN</Text>
          <View style={styles.inputSection}>
            <TextInput
              style={styles.inputArea}
              placeholder="Enter Email"
              placeholderTextColor={'#00443F'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.inputArea1}
              placeholder="Enter Password"
              placeholderTextColor={'#00443F'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {error ? (
              <Link href={'/recoveryScreen'} asChild>
                <TouchableOpacity style={styles.loginErrorView}>
                  <Text style={styles.errorText}>{error}</Text>
                </TouchableOpacity>
              </Link>
            ) : null}
          </View>
          <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginText}>Login</Text>
            )}
          </TouchableOpacity>
          <View style={styles.coa}>
            <Text style={{ fontSize: 12 }}>Don’t have a Login access?</Text>
            <TouchableOpacity>
              <Link href={'/signUp'} asChild>
                <Text style={{ fontSize: 12, color: '#F1B20A', fontWeight: '700' }}> Request a Login here</Text>
              </Link>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  regularText: {
    fontFamily: 'Montserrat',
    fontSize: 16,
    paddingLeft: 15,
    paddingTop: 80,
    fontWeight: '200',
  },
  bigText: {
    fontFamily: 'Montserrat',
    fontSize: 40,
    paddingLeft: 15,
  },
  LogoSection: {
    width: '100%',
    height: '10%',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginTop: 30,
  },
  logosize: {
    height: '100%',
    width: 120,
    marginLeft: 15,
  },
  editArea: {
    width: '100%',
    height: '80%',
  },
  inputSection: {
    width: '100%',
    height: 150,
    marginTop: 20,
    marginLeft: 20,
  },
  inputArea: {
    backgroundColor: '#f2f2f2',
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    color: '#00443F',
  },
  inputArea1: {
    backgroundColor: '#f2f2f2',
    height: 50,
    borderRadius: 10,
    paddingLeft: 10,
    marginTop: 20,
    color: '#00443F',
  },
  loginBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#00443F',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginText: {
    color: 'white',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  coa: {
    width: '100%',
    height: 40,
    marginLeft: 20,
    alignItems: 'center',
    marginTop: 15,
    flexDirection: 'row',
  },
  loginErrorView: {
    width: '100%',
    height: 40,
  },
});
