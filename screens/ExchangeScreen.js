import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { auth, db } from '../utils/firebaseConfig';
import { doc, updateDoc, getDoc, addDoc, collection } from 'firebase/firestore';
import axios from 'axios';

const ExchangeScreen = ({ navigation }) => {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [amount, setAmount] = useState('');
  const [currencyFrom, setCurrencyFrom] = useState('');
  const [currencyTo, setCurrencyTo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    try {
      console.log('Fetching exchange rates...');
      const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
      const rates = Object.entries(response.data.rates).map(([code, rate]) => ({
        code,
        mid: rate,
        currency: code,
      }));
      setExchangeRates(rates);
      console.log('Exchange rates fetched successfully:', rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      Alert.alert('Error', 'Failed to fetch exchange rates.');
    }
  };

  const handleExchange = async () => {
    const userId = auth.currentUser?.uid;

    if (!userId) {
      Alert.alert('Error', 'User not logged in.');
      return;
    }

    if (!amount || isNaN(amount) || parseFloat(amount) <= 0 || !currencyFrom || !currencyTo) {
      Alert.alert('Error', 'Please enter valid transaction details.');
      return;
    }

    try {
      setIsLoading(true);

      const walletRef = doc(db, 'wallets', userId);
      const walletDoc = await getDoc(walletRef);

      if (!walletDoc.exists()) {
        Alert.alert('Error', 'Wallet not found.');
        return;
      }

      let walletData = walletDoc.data();

      const fromRate = exchangeRates.find((r) => r.code === currencyFrom)?.mid;
      const toRate = exchangeRates.find((r) => r.code === currencyTo)?.mid;

      if (!fromRate || !toRate) {
        Alert.alert('Error', 'Invalid currency codes.');
        return;
      }

      let exchangedAmount;

      if (currencyFrom === 'USD') {
        exchangedAmount = parseFloat(amount) * toRate; // Convert USD to target currency
        if (walletData.usdBalance < parseFloat(amount)) {
          Alert.alert('Error', 'Insufficient USD balance.');
          return;
        }
        walletData.usdBalance -= parseFloat(amount);
      } else {
        exchangedAmount = (parseFloat(amount) / fromRate) * toRate; // Convert source currency to target currency via USD
        if ((walletData.currencies[currencyFrom] || 0) < parseFloat(amount)) {
          Alert.alert('Error', `Insufficient ${currencyFrom} balance.`);
          return;
        }
        walletData.currencies[currencyFrom] -= parseFloat(amount);
      }

      if (currencyTo === 'USD') {
        walletData.usdBalance += exchangedAmount;
      } else {
        walletData.currencies[currencyTo] =
          (walletData.currencies[currencyTo] || 0) + exchangedAmount;
      }

      console.log('Updating wallet with data:', walletData);
      await updateDoc(walletRef, walletData);

      const totalBalance = walletData.usdBalance + Object.entries(walletData.currencies).reduce(
        (sum, [key, value]) => {
          const currencyRate = exchangeRates.find((r) => r.code === key)?.mid || 0;
          return sum + value * currencyRate;
        },
        0
      );

      console.log('Saving transaction to Firestore USERID:', userId);

      const transactionData = {
        userId,
        amount: parseFloat(amount),
        currencyFrom,
        currencyTo,
        exchangeRate: toRate / fromRate,
        exchangedAmount,
        balance: totalBalance.toFixed(2),
        timestamp: new Date(),
      };

      console.log('Saving transaction to Firestore:', transactionData);
      await addDoc(collection(db, 'transactions'), transactionData);

      Alert.alert(
        'Success',
        `Exchanged ${amount} ${currencyFrom} to ${exchangedAmount.toFixed(2)} ${currencyTo}.`
      );

      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error during exchange:', error);
      Alert.alert('Error', 'Exchange failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Currency Exchange</Text>
      {isLoading && <ActivityIndicator size="large" color="#FF9800" />}
      <TextInput
        placeholder="From Currency (e.g., USD)"
        style={styles.input}
        value={currencyFrom}
        onChangeText={setCurrencyFrom}
      />
      <TextInput
        placeholder="To Currency (e.g., EUR)"
        style={styles.input}
        value={currencyTo}
        onChangeText={setCurrencyTo}
      />
      <TextInput
        placeholder="Amount"
        style={styles.input}
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />
      <TouchableOpacity
        style={[styles.button, styles.exchangeButton]}
        onPress={handleExchange}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Processing...' : 'Exchange'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.dashboardButton]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Current Exchange Rates:</Text>
      <FlatList
        data={exchangeRates}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <Text style={styles.rateText}>{item.currency} ({item.code}): {item.mid.toFixed(2)}</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 8, borderColor: '#ccc', backgroundColor: '#fff' },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  exchangeButton: { backgroundColor: '#4CAF50' },
  dashboardButton: { backgroundColor: '#2196F3' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 20, color: '#333' },
  rateText: { fontSize: 16, marginBottom: 5, color: '#555' },
});

export default ExchangeScreen;
