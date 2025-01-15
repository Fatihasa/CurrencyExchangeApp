import axios from 'axios';

const API_URL = 'https://api.nbp.pl/api/exchangerates/tables/A/';

export const fetchExchangeRates = async () => {
  try {
    const response = await axios.get(API_URL, { headers: { Accept: 'application/json' } });
    const rates = response.data[0].rates;
    console.log('Fetched exchange rates:', rates);
    return rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    return [];
  }
};
