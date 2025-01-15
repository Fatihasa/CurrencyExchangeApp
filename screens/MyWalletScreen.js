import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, FlatList } from 'react-native';
import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc, setLogLevel } from 'firebase/firestore';

// Enable Firestore debugging logs
setLogLevel('debug');

const WalletScreen = () => {
  const [wallet, setWallet] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
    fetchExchangeRates();
  }, []);

  const fetchWallet = async () => {
    try {
      const userId = auth.currentUser?.uid;

      if (!userId) {
        Alert.alert('Error', 'User not logged in.');
        return;
      }

      console.log('Fetching wallet for user ID:', userId);

      const walletRef = doc(db, 'wallets', userId);
      console.log('Wallet Document Path:', walletRef.path);

      const walletDoc = await getDoc(walletRef);

      if (!walletDoc.exists()) {
        console.log('No wallet found for this user:', userId);
        Alert.alert('Error', 'Wallet not found.');
        setWallet(null);
      } else {
        const walletData = walletDoc.data();
        console.log('Wallet fetched:', walletData);

        const formattedWallet = {
          ...walletData,
          usdBalance: parseFloat(walletData.usdBalance),
          currencies: Object.fromEntries(
            Object.entries(walletData.currencies || {}).map(([key, value]) => [
              key,
              parseFloat(value),
            ])
          ),
        };

        setWallet(formattedWallet);
      }
    } catch (error) {
      console.error('Error fetching wallet:', error);
      if (error.code === 'permission-denied') {
        Alert.alert('Error', 'You do not have permission to access this wallet.');
      } else {
        Alert.alert('Error', 'Failed to fetch wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExchangeRates = async () => {
    try {
      console.log('Fetching exchange rates...');
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      const data = await response.json();
      console.log('Exchange rates fetched successfully:', data.rates);
      setExchangeRates(data.rates);
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      Alert.alert('Error', 'Failed to fetch exchange rates.');
    }
  };

  const calculateUsdEquivalent = (currencyCode, amount) => {
    const rate = exchangeRates[currencyCode] || 1;
    return amount / rate;
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text>Loading wallet...</Text>
      </View>
    );
  }

  if (!wallet) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Wallet</Text>
        <Text>No wallet data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Wallet</Text>
      <Text style={styles.balance}>USD Balance: ${wallet.usdBalance.toFixed(2)}</Text>
      <Text style={styles.subtitle}>Other Currencies:</Text>
      <FlatList
        data={Object.entries(wallet.currencies || {})}
        keyExtractor={(item) => item[0]}
        renderItem={({ item }) => {
          const [currencyCode, amount] = item;
          const usdEquivalent = calculateUsdEquivalent(currencyCode, amount);
          return (
            <View style={styles.currencyContainer}>
              <Text style={styles.currencyText}>
                {currencyCode}: {amount.toFixed(2)} (≈ ${usdEquivalent.toFixed(2)} USD)
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  balance: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  currencyContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  currencyText: { fontSize: 16 },
});

export default WalletScreen;
