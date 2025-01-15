import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth, db } from '../utils/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const DashboardScreen = ({ navigation }) => {
  const [usdBalance, setUsdBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const userId = auth.currentUser?.uid;

        if (!userId) {
          Alert.alert('Error', 'User not logged in.');
          return;
        }

        console.log('Fetching wallet balance for user ID:', userId);

        const walletRef = doc(db, 'wallets', userId);
        const walletDoc = await getDoc(walletRef);

        if (walletDoc.exists()) {
          const walletData = walletDoc.data();
          console.log('Wallet data:', walletData);
          setUsdBalance(walletData.usdBalance || 0);
        } else {
          console.log('No wallet found for this user.');
          setUsdBalance(0);
        }
      } catch (error) {
        console.error('Error fetching wallet balance:', error);
        Alert.alert('Error', 'Failed to fetch wallet balance.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletBalance();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Your Dashboard</Text>
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>USD Balance:</Text>
        <Text style={styles.balanceValue}>${usdBalance.toFixed(2)}</Text>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.fundButton]}
        onPress={() => navigation.navigate('FundAccount')}
      >
        <Text style={styles.buttonText}>Fund Your Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.exchangeButton]}
        onPress={() => navigation.navigate('Exchange')}
      >
        <Text style={styles.buttonText}>Currency Exchange</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.walletButton]}
        onPress={() => navigation.navigate('MyWallet')}
      >
        <Text style={styles.buttonText}>My Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.historyButton]}
        onPress={() => navigation.navigate('TransactionHistory')}
      >
        <Text style={styles.buttonText}>Transaction History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f9f9f9' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333', textAlign: 'center' },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
    elevation: 3,
  },
  balanceLabel: { fontSize: 18, fontWeight: '600', color: '#555' },
  balanceValue: { fontSize: 24, fontWeight: 'bold', color: '#4CAF50', marginTop: 5 },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  fundButton: { backgroundColor: '#FF9800' },
  exchangeButton: { backgroundColor: '#4CAF50' },
  walletButton: { backgroundColor: '#2196F3' },
  historyButton: { backgroundColor: '#9C27B0' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default DashboardScreen;
