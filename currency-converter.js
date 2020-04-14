const axios = require('axios');

// 1st function - getExchangeRate
const getExchangeRate = async (fromCurrency, toCurrency) => {
  const response = await axios.get('http://data.fixer.io/api/latest?access_key=2c88b65cd00862df2da94ae527cd8282');
  const rate = response.data.rates;
  const euro = 1 / rate[fromCurrency];
  const exchangeRate = euro * rate[toCurrency];

  if (isNaN(exchangeRate)) {
    throw new Error (`Unable to get currency ${fromCurrency} and ${toCurrency}`)
  }

  return exchangeRate;
  }

// 2nd function - getCountries
const getCountries = async (toCurrency) => {
  try {
    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${toCurrency}`)
    return response.data.map(country => country.name);
  } catch (error) {
    throw new Error(`Unable to get countries that use
    ${toCurrency}`)
  }
  
}

// 3rd function - convertCurrency
const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  const countries = await getCountries(toCurrency);
  const exchangeRate = await getExchangeRate(fromCurrency, toCurrency);
  const convertedAmount = (amount * exchangeRate).toFixed(2);
  
  return `${amount} ${fromCurrency} is worth ${convertedAmount} ${toCurrency}. You can spent these in the 
  following countries: ${countries}`
}

// Call convert currency to get meaninful data
convertCurrency('EUR', 'COP', 70)
  .then((message) => {
    console.log(message);
  }).catch((error) => {
    console.log(error.message);
  });

