let currentWeather = null;
let isCelsius = true;
async function getWeather(event) {

    if (event) event.preventDefault();

    const city = document.getElementById("city").value.trim();

    if (!city) {
        alert("Please enter a city name.");
        return;
    }

    fetchWeather(`/weather?city=${encodeURIComponent(city)}`);

}

async function fetchWeather(url){

    const loader=document.getElementById("loader");

    loader.classList.remove("hidden");

    try{
        
        const response=await fetch(url);

        const data=await response.json();

        loader.classList.add("hidden");

        if(!response.ok){

            showError(data.message);

            return;

        }

        updateUI(data);

    }

    catch(error){

        loader.classList.add("hidden");

        showError("Unable to fetch weather.");

    }

}

function updateUI(data) {

    currentWeather = data;

    document.getElementById("cityName").textContent =
        `${data.city}, ${data.country}`;

    const today = new Date();

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

    document.getElementById("temperature").textContent =
        `${data.temperature}°`;

    document.getElementById("description").textContent =
        data.description;

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

    document.getElementById("logoIcon").src =
        `https://openweathermap.org/img/wn/${data.icon}.png`;

    document.getElementById("feelsLike").textContent =
        `${data.feelsLike}°`;

    document.getElementById("humidity").textContent =
        `${data.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind} m/s ${getWindDirection(data.windDeg)}`;

    document.getElementById("pressure").textContent =
        `${data.pressure} hPa`;

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

    document.getElementById("sunrise").textContent =
        formatTime(data.sunrise);

    document.getElementById("sunset").textContent =
        formatTime(data.sunset);

    changeBackground(data.condition);

    loadForecast(data.city);
}
function formatTime(unixTime){

    if(!unixTime) return "--";

    return new Date(unixTime * 1000)
        .toLocaleTimeString([],{
            hour:"2-digit",
            minute:"2-digit"
        });

}

function getWindDirection(deg){

    if(deg===undefined) return "";

    const directions=[
        "N","NE","E","SE",
        "S","SW","W","NW"
    ];

    return directions[
        Math.round(deg/45)%8
    ];

}

function changeBackground(condition){

    const body = document.body;

    switch(condition){

        case "Clear":
            body.style.background =
            "linear-gradient(135deg,#06062B,#151557,#2D3D9F)";
            break;

        case "Clouds":
            body.style.background =
            "linear-gradient(135deg,#090A35,#22264D,#414A7A)";
            break;

        case "Rain":
            body.style.background =
            "linear-gradient(135deg,#05091D,#16213E,#23395B)";
            break;

        case "Thunderstorm":
            body.style.background =
            "linear-gradient(135deg,#050505,#1A1A2E,#2D2D44)";
            break;

        case "Snow":
            body.style.background =
            "linear-gradient(135deg,#1B1D3B,#394867,#5C6E91)";
            break;

        default:
            body.style.background =
            "linear-gradient(135deg,#06062B,#151557,#2D3D9F)";
    }

}

function getLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(async position => {

        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        fetchWeather(`/weather?lat=${lat}&lon=${lon}`);

    });

}
function showError(message){

    document.getElementById("cityName").textContent="Oops!";

    document.getElementById("todayDate").textContent="";

    document.getElementById("temperature").textContent="--";

    document.getElementById("description").textContent=message;

    document.getElementById("weatherIcon").src="";
}
async function loadForecast(city){

    try{

        console.log("Loading forecast for:", city);

        const response = await fetch(`/forecast?city=${city}`);

        console.log("Status:", response.status);

        const data = await response.json();

        console.log(data);

        const container = document.getElementById("forecastContainer");

        container.innerHTML="";

        data.forEach(day=>{

            container.innerHTML += `
                <div class="forecast-card">
                    <h3>${day.day}</h3>
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png">
                    <h2>${day.temp}°</h2>
                    <p>${day.weather}</p>
                </div>
            `;

        });

    }catch(error){

        console.log(error);

    }

}
document.getElementById("unitToggle").addEventListener("click",()=>{

    if(!currentWeather) return;

    isCelsius=!isCelsius;

    const convert=t=>isCelsius
        ? t
        : (t*9/5+32);

    const symbol=isCelsius?"°C":"°F";

    document.getElementById("temperature").textContent=
        `${Math.round(convert(currentWeather.temperature))}${symbol}`;

    document.getElementById("feelsLike").textContent=
        `${Math.round(convert(currentWeather.feelsLike))}${symbol}`;

    document.getElementById("maxTemp").textContent=
        `${Math.round(convert(currentWeather.maxTemp))}${symbol}`;

    document.getElementById("minTemp").textContent=
        `${Math.round(convert(currentWeather.minTemp))}${symbol}`;

});