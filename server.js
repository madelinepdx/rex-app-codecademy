const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5001;

app.use(cors());

app.get("/api/nearbysearch", async (req, res) => {
    const { location, radius, type } = req.query;
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error("Error fetching from Google API:", error);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
