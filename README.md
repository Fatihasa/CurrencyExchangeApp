# Currency Exchange App

## Overview
Currency Exchange App is a mobile application designed to provide a seamless currency exchange experience. Users can fund their accounts, check live exchange rates, perform currency conversions, and track their transaction history. Built with React Native and Firebase Firestore, the app ensures real-time updates and secure transactions.

---

## Features

- **Account Management**:
  - User authentication (Firebase Authentication).
  - User-specific wallets stored in Firebase Firestore.

- **Wallet Management**:
  - View current USD balance.
  - View balances for other currencies.
  
- **Currency Exchange**:
  - Real-time exchange rates fetched from [ExchangeRate-API](https://exchangerate-api.com/).
  - Convert between supported currencies.
  - Updates wallet balances after successful exchanges.

- **Transaction History**:
  - View a history of past transactions.
  - Display details such as the exchanged amount, conversion rate, and timestamps.

- **Interactive UI**:
  - Optimized user experience with clean and intuitive designs.

---

## Tech Stack

### Frontend
- **React Native**: For building cross-platform mobile applications.
- **JavaScript**: Application logic and UI components.

### Backend
- **Firebase Firestore**: Secure, serverless, and scalable NoSQL database.
- **Firebase Authentication**: User authentication and session management.

### API Integration
- **ExchangeRate-API**: For fetching real-time exchange rates with USD as the base currency.

---

## Installation

### Prerequisites
- Node.js (v14.x or later)
- npm or yarn
- Android Studio and/or Xcode for running on emulators
- Firebase project configured for authentication and Firestore

### Steps
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/currency-exchange-app.git
   cd currency-exchange-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure Firebase:
   - Add your `firebaseConfig.js` file inside the `utils` folder with your Firebase project credentials.

4. Start the app:
   ```bash
   npm start
   ```
   Use the appropriate commands to run the app on an emulator or physical device:
   ```bash
   # For iOS
   npx react-native run-ios
   
   # For Android
   npx react-native run-android
   ```

---

## File Structure
```
.
├── App.js                  # Entry point of the app
├── components              # Reusable components
├── screens                 # Individual screens (Dashboard, Exchange, Wallet, etc.)
├── utils
│   ├── firebaseConfig.js   # Firebase configuration file
│   └── helpers.js          # Helper functions
├── assets                  # Static assets like images
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation
```

---

## Usage

1. **Sign Up**: Create an account using email and password.
2. **Fund Your Wallet**: Add USD to your wallet.
3. **Exchange Currency**: Select the currencies and amount to exchange.
4. **View Wallet**: Check balances for USD and other currencies.
5. **Transaction History**: Review your past exchanges.

---

## Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com/)
- Firebase for backend services
- React Native community



