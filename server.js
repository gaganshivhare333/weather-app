const mongoose = require("mongoose");
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
console.log("MONGO_URI:");
console.log(process.env.MONGO_URI);

// =========================================
// MongoDB Connection
// =========================================

console.log("🔄 Connecting to MongoDB...");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error");
    console.error(err);
});

// =========================================
// Weather Schema
// =========================================

const weatherSchema = new mongoose.Schema({

    city: {
        type: String,
        required: true
    },

    country: {
        type: String,
        required: true
    },

    temperature: {
        type: Number,
        required: true
    },

    feelsLike: Number,

    minTemp: Number,

    maxTemp: Number,

    humidity: Number,

    pressure: Number,

    visibility: Number,

    windSpeed: Number,

    windDegree: Number,

    description: String,

    condition: String,

    icon: String,

    searchedAt: {
        type: Date,
        default: Date.now
    }

});

const Weather = mongoose.model("Weather", weatherSchema);

// =========================================
// Express App
// =========================================

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

// =========================================
// Current Weather Route
// =========================================

app.get("/weather", async (req, res) => {

    const { city, lat, lon } = req.query;

    try {

        let url = "";

        if (lat && lon) {

            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;

        } else {

            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

        }

        // Fetch weather
        const response = await axios.get(url);
        const data = response.data;

        // =====================================
        // Save to MongoDB
        // =====================================

        try {

            const weather = new Weather({

                city: data.name,
                country: data.sys.country,

                temperature: Math.round(data.main.temp),
                feelsLike: Math.round(data.main.feels_like),
                minTemp: Math.round(data.main.temp_min),
                maxTemp: Math.round(data.main.temp_max),

                humidity: data.main.humidity,
                pressure: data.main.pressure,

                visibility: data.visibility,

                windSpeed: data.wind.speed,
                windDegree: data.wind.deg,

                description: data.weather[0].description,
                condition: data.weather[0].main,
                icon: data.weather[0].icon

            });

            const savedWeather = await weather.save();

            console.log("=================================");
            console.log("✅ Weather Saved to MongoDB");
            console.log(savedWeather);
            console.log("=================================");

        } catch (dbError) {

            console.log("=================================");
            console.log("❌ MongoDB Save Failed");
            console.error(dbError);
            console.log("=================================");

        }

        // =====================================
        // Send Response
        // =====================================

        res.json({

            city: data.name,

            country: data.sys.country,

            temperature: Math.round(data.main.temp),

            feelsLike: Math.round(data.main.feels_like),

            minTemp: Math.round(data.main.temp_min),

            maxTemp: Math.round(data.main.temp_max),

            humidity: data.main.humidity,

            wind: data.wind.speed,

            windDeg: data.wind.deg,

            pressure: data.main.pressure,

            visibility: (data.visibility / 1000).toFixed(1),

            sunrise: data.sys.sunrise,

            sunset: data.sys.sunset,

            description: data.weather[0].description,

            condition: data.weather[0].main,

            icon: data.weather[0].icon

        });

    }

    catch (error) {

        console.log("=================================");
        console.log("❌ Weather API Error");

        if (error.response) {

            console.error(error.response.data);

        } else {

            console.error(error.message);

        }

        console.log("=================================");

        res.status(500).json({

            message: error.message

        });

    }

});

// =========================================
// Forecast Route
// =========================================

app.get("/forecast", async (req, res) => {

    const city = req.query.city;

    try {

        console.log("Forecast requested for:", city);

        const response = await axios.get(

            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.API_KEY}&units=metric`

        );

        const forecast = response.data.list
            .filter(item => item.dt_txt.includes("12:00:00"))
            .slice(0, 5)
            .map(item => ({
                day: new Date(item.dt_txt).toLocaleDateString("en-US", {
                    weekday: "short"
                }),
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                weather: item.weather[0].main
            }));

        res.json(forecast);

    }

    catch (error) {

        console.log("❌ Forecast Error");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        res.status(500).json({

            message: "Unable to fetch forecast"

        });

    }

});

// =========================================
// View Saved Weather Records
// =========================================

app.get("/history", async (req, res) => {

    try {

        const history = await Weather.find().sort({ searchedAt: -1 });

        res.json(history);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            message: "Unable to fetch history"

        });

    }

});

// =========================================
// Test Route
// =========================================

app.get("/test", (req, res) => {

    res.send("Server is working!");

});

// =========================================
// Start Server
// =========================================

app.listen(PORT, () => {

    console.log(`🚀 Server running at http://localhost:${PORT}`);

});