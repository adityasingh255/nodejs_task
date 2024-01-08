const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const CryptoData = require("./db/crypto");
const fetchAndStoreData = require("./api/cryptoDataHandler");

const app = express();
const port = process.env.PORT || 3000;

// Initialize data when the server starts
fetchAndStoreData();

// API endpoint to fetch and store data
app.get("/fetchAndStoreData", async (req, res) => {
  try {
    await fetchAndStoreData();
    res.send("Data fetched and stored successfully");
  } catch (error) {
    console.error("Error fetching and storing data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/getData", async (req, res) => {
  try {
    const data = await CryptoData.find({}, "-_id -__v").limit(10);
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

mongoose
  .connect(process.env.MONGO_DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
