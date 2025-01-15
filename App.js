import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import ExchangeScreen from './screens/ExchangeScreen';
import TransactionHistoryScreen from './screens/TransactionHistoryScreen';
import FundAccountScreen from './screens/FundAccountScreen';
import MyWalletScreen from './screens/MyWalletScreen'; // Import MyWalletScreen

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
        <Stack.Screen name="Exchange" component={ExchangeScreen} options={{ title: 'Currency Exchange' }} />
        <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} options={{ title: 'Transaction History' }} />
        <Stack.Screen name="FundAccount" component={FundAccountScreen} options={{ title: 'Fund Account' }} />
        <Stack.Screen name="MyWallet" component={MyWalletScreen} options={{ title: 'My Wallet' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
