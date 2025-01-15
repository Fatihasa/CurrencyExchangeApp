import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const firebaseConfig = {
  apiKey: "AIzaSyAXNuaJkAg6jwQ9LQucrfJp4a99npJ7Qu8",
  authDomain: "currencyexchangeapp-5d146.firebaseapp.com",
  projectId: "currencyexchangeapp-5d146",
  storageBucket: "currencyexchangeapp-5d146.firebasestorage.app",
  messagingSenderId: "153124602552",
  appId: "1:153124602552:web:663ee7e1224853e559aa4d",
};

// Initialize Firebase only once
export const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

console.log('Firebase initialized:', app.name);





