
const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/weather", async (req, res) => {

    const { city, lat, lon } = req.query;

    try {

        let url = "";

        if (lat && lon) {

            url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}&units=metric`;

        } else {

            url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.API_KEY}&units=metric`;

        }

        const response = await axios.get(url);

        const data = response.data;

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

        res.status(404).json({

            message: "City not found"

        });

    }

});
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

    }catch (error) {

    console.error("Forecast Error:");

    console.error(error.response?.data || error.message);

    res.status(500).json({
        message: "Unable to fetch forecast"
    });

}
});
app.get("/test", (req, res) => {
    res.send("Forecast route file is loaded!");
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
