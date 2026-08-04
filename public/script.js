// ===============================
// Global Variables
// ===============================

let currentWeather = null;
let isCelsius = true;

// ===============================
// Search Weather
// ===============================

async function getWeather(event) {

    if (event) event.preventDefault();

    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    fetchWeather(`/weather?city=${encodeURIComponent(city)}`);

}

// ===============================
// Fetch Weather
// ===============================

async function fetchWeather(url) {

    const loader = document.getElementById("loader");

    loader.classList.remove("hidden");

    try {

        const response = await fetch(url);

        const data = await response.json();

        loader.classList.add("hidden");

        if (!response.ok) {

            showError(data.message);

            return;

        }

        updateUI(data);

    }

    catch (error) {

        loader.classList.add("hidden");

        showError("Unable to fetch weather.");

        console.error(error);

    }

}

// ===============================
// Load Search History
// ===============================

async function loadHistory() {

    try {

        const response = await fetch("/history");

        const history = await response.json();

        const container = document.getElementById("history");

        if (!container) return;

        container.innerHTML = "";

        history.forEach(item => {

            container.innerHTML += `

            <div class="history-card">

                <div>

                    <div class="history-city">

                        📍 ${item.city}, ${item.country}

                    </div>

                    <div>

                        ${item.description}

                    </div>

                </div>

                <div class="history-temp">

                    ${item.temperature}°C

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.error("History Error:", error);

    }

}
// ===============================
// Update Weather UI
// ===============================

function updateUI(data) {

    currentWeather = data;

    const today = new Date();

    // -----------------------------
    // City & Date
    // -----------------------------

    document.getElementById("cityName").textContent =
        `${data.city}, ${data.country}`;

    document.getElementById("todayDate").textContent =
        today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    document.getElementById("updatedTime").textContent =
        "Last Updated: " +
        today.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    // -----------------------------
    // Temperature
    // -----------------------------

    document.getElementById("temperature").textContent =
        `${data.temperature}°`;

    document.getElementById("description").textContent =
        data.description;

    // -----------------------------
    // Weather Icons
    // -----------------------------

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

    document.getElementById("logoIcon").src =
        `https://openweathermap.org/img/wn/${data.icon}@2x.png`;

    // -----------------------------
    // Weather Cards
    // -----------------------------

    document.getElementById("feelsLike").textContent =
        `${data.feelsLike}°`;

    document.getElementById("humidity").textContent =
        `${data.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind} m/s ${getWindDirection(data.windDeg)}`;

    document.getElementById("pressure").textContent =
        `${data.pressure} hPa`;

    // -----------------------------
    // Right Panel
    // -----------------------------

    document.getElementById("country").textContent =
        data.country;

    document.getElementById("maxTemp").textContent =
        `${data.maxTemp}°`;

    document.getElementById("minTemp").textContent =
        `${data.minTemp}°`;

    document.getElementById("visibility").textContent =
        `${data.visibility} km`;

    document.getElementById("pressure2").textContent =
        `${data.pressure} hPa`;

    document.getElementById("condition").textContent =
        data.condition;

    // -----------------------------
    // Sunrise / Sunset
    // -----------------------------

    document.getElementById("sunrise").textContent =
        formatTime(data.sunrise);

    document.getElementById("sunset").textContent =
        formatTime(data.sunset);

    // -----------------------------
    // Background
    // -----------------------------

    changeBackground(data.condition);

    // -----------------------------
    // Load Forecast
    // -----------------------------

    loadForecast(data.city);

    // -----------------------------
    // Refresh Search History
    // -----------------------------

    loadHistory();

}
// ===============================
// Format Sunrise & Sunset Time
// ===============================

function formatTime(unixTime) {

    if (!unixTime) return "--";

    return new Date(unixTime * 1000).toLocaleTimeString([], {

        hour: "2-digit",
        minute: "2-digit"

    });

}

// ===============================
// Wind Direction
// ===============================

function getWindDirection(deg) {

    if (deg === undefined) return "";

    const directions = [
        "N", "NE", "E", "SE",
        "S", "SW", "W", "NW"
    ];

    return directions[Math.round(deg / 45) % 8];

}

// ===============================
// Dynamic Background
// ===============================

function changeBackground(condition) {

    const body = document.body;

    body.style.transition = "background 0.8s ease";

    switch (condition) {

        case "Clear":

            body.style.background =
                "linear-gradient(135deg,#3B82F6,#60A5FA,#BFDBFE)";
            break;

        case "Clouds":

            body.style.background =
                "linear-gradient(135deg,#64748B,#94A3B8,#CBD5E1)";
            break;

        case "Rain":

            body.style.background =
                "linear-gradient(135deg,#1E3A8A,#2563EB,#60A5FA)";
            break;

        case "Thunderstorm":

            body.style.background =
                "linear-gradient(135deg,#111827,#374151,#4B5563)";
            break;

        case "Snow":

            body.style.background =
                "linear-gradient(135deg,#E2E8F0,#F8FAFC,#FFFFFF)";
            break;

        case "Mist":
        case "Fog":
        case "Haze":

            body.style.background =
                "linear-gradient(135deg,#94A3B8,#CBD5E1,#F1F5F9)";
            break;

        default:

            body.style.background =
                "linear-gradient(135deg,#3B82F6,#60A5FA,#BFDBFE)";

    }

}

// ===============================
// Current Location
// ===============================

function getLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position => {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            fetchWeather(`/weather?lat=${lat}&lon=${lon}`);

        },

        () => {

            alert("Unable to retrieve your location.");

        }

    );

}

// ===============================
// Error Display
// ===============================

function showError(message) {

    document.getElementById("cityName").textContent = "Oops!";

    document.getElementById("todayDate").textContent = "";

    document.getElementById("updatedTime").textContent = "";

    document.getElementById("temperature").textContent = "--";

    document.getElementById("description").textContent = message;

    document.getElementById("weatherIcon").src = "";

}
// ===============================
// Load 5-Day Forecast
// ===============================

async function loadForecast(city) {

    try {

        const response = await fetch(`/forecast?city=${city}`);

        const data = await response.json();

        const container = document.getElementById("forecastContainer");

        container.innerHTML = "";

        data.forEach(day => {

            container.innerHTML += `

                <div class="forecast-card">

                    <h3>${day.day}</h3>

                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png">

                    <h2>${day.temp}°</h2>

                    <p>${day.weather}</p>

                </div>

            `;

        });

    }

    catch (error) {

        console.error("Forecast Error:", error);

    }

}

// ===============================
// Celsius / Fahrenheit Toggle
// ===============================

document.getElementById("unitToggle").addEventListener("click", () => {

    if (!currentWeather) return;

    isCelsius = !isCelsius;

    const convert = temp =>

        isCelsius ? temp : (temp * 9 / 5 + 32);

    const symbol = isCelsius ? "°C" : "°F";

    document.getElementById("unitToggle").textContent =
        isCelsius ? "°C / °F" : "°F / °C";

    document.getElementById("temperature").textContent =
        `${Math.round(convert(currentWeather.temperature))}${symbol}`;

    document.getElementById("feelsLike").textContent =
        `${Math.round(convert(currentWeather.feelsLike))}${symbol}`;

    document.getElementById("maxTemp").textContent =
        `${Math.round(convert(currentWeather.maxTemp))}${symbol}`;

    document.getElementById("minTemp").textContent =
        `${Math.round(convert(currentWeather.minTemp))}${symbol}`;

});

// ===============================
// Load History on Startup
// ===============================

window.addEventListener("DOMContentLoaded", () => {

    loadHistory();

});