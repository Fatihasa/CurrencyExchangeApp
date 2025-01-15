import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../utils/firebaseConfig';
import { doc, runTransaction } from 'firebase/firestore';

const FundAccountScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');

  const handleFundAccount = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    try {
      const userRef = doc(db, 'users', userId);
      const walletRef = doc(db, 'wallets', userId);

      await runTransaction(db, async (transaction) => {
        const userDoc = await transaction.get(userRef);
        const walletDoc = await transaction.get(walletRef);

        if (!userDoc.exists()) {
          throw new Error('User document not found.');
        }

        const currentUserBalance = userDoc.data().balance || 0;
        const updatedUserBalance = currentUserBalance + parseFloat(amount);

        let updatedWalletBalance = parseFloat(amount);
        if (walletDoc.exists()) {
          const currentWalletBalance = walletDoc.data().usdBalance || 0;
          updatedWalletBalance += currentWalletBalance;
        }

        transaction.update(userRef, { balance: updatedUserBalance });

        if (walletDoc.exists()) {
          transaction.update(walletRef, { usdBalance: updatedWalletBalance });
        } else {
          transaction.set(walletRef, {
            usdBalance: updatedWalletBalance,
            currencies: {},
            uid: userId,
          });
        }
      });

      Alert.alert('Success', `Funded $${amount} to your account.`);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error funding account:', error);
      if (error.message === 'User document not found.') {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'Failed to fund account. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fund Your Account</Text>
      <TextInput
        placeholder="Enter amount"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity style={styles.button} onPress={handleFundAccount}>
        <Text style={styles.buttonText}>Fund Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FundAccountScreen;
