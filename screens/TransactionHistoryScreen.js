import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { db, auth } from '../utils/firebaseConfig';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';

const TransactionHistoryScreen = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const userId = auth.currentUser?.uid;

        if (!userId) {
          Alert.alert('Error', 'User not authenticated.');
          setIsLoading(false);
          return;
        }

        console.log('Fetching transactions for user ID:', userId);

        // Query to get transactions of the current user
        const q = query(
          collection(db, 'transactions'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log('No transactions found for this user.');
          setTransactions([]);
        } else {
          const fetchedTransactions = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              timestamp: data.timestamp?.seconds
                ? new Date(data.timestamp.seconds * 1000).toLocaleString()
                : 'Unknown',
            };
          });

          console.log('Fetched transactions:', fetchedTransactions);
          setTransactions(fetchedTransactions);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        Alert.alert('Error', 'Failed to load transaction history.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text>Loading transactions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.transaction}>
              <Text style={styles.transactionText}>
                <Text style={styles.bold}>{item.amount} {item.currencyFrom}</Text> → <Text style={styles.bold}>{item.currencyTo}</Text>
              </Text>
              <Text>Exchanged: {item.exchangedAmount.toFixed(2)} {item.currencyTo}</Text>
              <Text>Rate: {item.exchangeRate.toFixed(4)}</Text>
              <Text>Date: {item.timestamp}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransactions}>No transactions found.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  transaction: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
  },
  transactionText: { fontSize: 16, marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  noTransactions: { fontSize: 16, textAlign: 'center', marginTop: 20 },
});

export default TransactionHistoryScreen;
