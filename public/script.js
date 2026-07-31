const icons = {
    Clear: "☀️",
    Clouds: "☁️",
    Rain: "🌧️",
    Thunderstorm: "⛈️",
    Drizzle: "🌦️",
    Snow: "❄️",
    Mist: "🌫️",
    Haze: "🌫️"
};

const icon = icons[data.condition] || "🌍";

result.style.display = "block";

result.innerHTML = `

<div class="weather-icon">

${icon}

</div>

<div class="temp">

${data.temperature}°C

</div>

<div class="condition">

${data.condition}

</div>

<div class="info">

<span>📍 City</span>

<span>${data.city}</span>

</div>

<div class="info">

<span>💧 Humidity</span>

<span>${data.humidity}%</span>

</div>

<div class="info">

<span>🌬 Wind</span>

<span>${data.wind} m/s</span>

</div>

`;