import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../utils/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user data to Firestore
      const userData = {
        email: user.email,
        balance: 0,
        createdAt: Timestamp.now(), // Use Firestore Timestamp here
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // Initialize wallet document
      const walletData = {
        uid: user.uid,
        usdBalance: 0,
        currencies: {}, // Start with no currencies
      };

      await setDoc(doc(db, 'wallets', user.uid), walletData);

      Alert.alert('Success', 'Registration successful!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Registration error:', error.message);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {isLoading ? (
        <ActivityIndicator size="large" color="#FF9800" />
      ) : (
        <Button title="Register" onPress={handleRegister} />
      )}
      <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, marginBottom: 15, padding: 10, borderRadius: 5, borderColor: '#ccc' },
});

export default RegisterScreen;
