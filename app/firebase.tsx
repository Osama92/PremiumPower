import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, initializeAuth, getReactNativePersistence,browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native'

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCzbdNqHy5b96qGenIY-7Phz2AjHUeqnYQ",
    authDomain: "premiumpower-5486d.firebaseapp.com",
    projectId: "premiumpower-5486d",
    storageBucket: "premiumpower-5486d.appspot.com",
    messagingSenderId: "354945650721",
    appId: "1:354945650721:web:df5951954953e02452d360",
    measurementId: "G-Z1XFH68F2L"
};

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Analytics if supported
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Initialize Firebase Auth with AsyncStorage for React Native
const persistence = Platform.OS === 'web'
           ? browserSessionPersistence
           : getReactNativePersistence(AsyncStorage);
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });
const auth = initializeAuth(app, persistence)

// Initialize Firestore
const db = getFirestore(app);

export { auth, db, analytics };