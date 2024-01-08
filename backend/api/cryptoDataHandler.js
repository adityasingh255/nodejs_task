const CryptoData = require("../db/crypto");
const axios = require("axios");

const fetchAndStoreData = async () => {
  try {
    const isValidNumericValue = (value) =>
      !isNaN(parseFloat(value)) && isFinite(value);

    const existingData = await CryptoData.find({});

    // Check if the database is empty
    if (existingData.length === 0) {
      const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
      const tickers = response.data;

      // console log response for debugging
      console.log("API Response:", tickers);

      if (typeof tickers === "object" && tickers !== null) {
        const dataToStore = Object.keys(tickers)
          .slice(0, 10)
          .map((pair) => {
            const ticker = tickers[pair];
            return {
              name: ticker.name,
              last: isValidNumericValue(ticker.last)
                ? parseFloat(ticker.last)
                : 0,
              buy: isValidNumericValue(ticker.buy) ? parseFloat(ticker.buy) : 0,
              sell: isValidNumericValue(ticker.sell)
                ? parseFloat(ticker.sell)
                : 0,
              volume: isValidNumericValue(ticker.volume)
                ? parseFloat(ticker.volume)
                : 0,
              base_unit: ticker.base_unit,
            };
          });

        await CryptoData.insertMany(dataToStore);

        console.log("Initial data stored successfully");
      } else {
        console.error("API response is not an object.");
      }
    } else {
      console.log("Database already has data. Skipping initial data fetch.");
    }
  } catch (error) {
    console.error("Error fetching and storing data:", error.message);
  }
};

// Export the fetchAndStoreData function
module.exports = fetchAndStoreData;
