import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

// Add a new transaction to Firestore
export const addTransaction = async (transaction) => {
  try {
    await addDoc(collection(db, 'transactions'), {
      ...transaction,
      date: new Date().toISOString(),
    });
    console.log('Transaction successfully added!');
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

// Fetch all transactions from Firestore
export const fetchTransactions = async () => {
  try {
    const q = query(collection(db, 'transactions'), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
