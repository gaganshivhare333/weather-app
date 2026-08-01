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

    // City
    document.getElementById("cityName").textContent =
        `${data.city}, ${data.country}`;

    // Date
    const today = new Date();

    document.getElementById("todayDate").textContent =
        today.toLocaleDateString("en-US", {

            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"


        });

    // Temperature

    document.getElementById("temperature").textContent =
        `${data.temperature}°`;

    // Description

    document.getElementById("description").textContent =
        data.description;

    // Weather Icon

    document.getElementById("weatherIcon").src =
        `https://openweathermap.org/img/wn/${data.icon}@4x.png`;

    // Left Cards

    document.getElementById("feelsLike").textContent =
        `${data.feelsLike}°`;

    document.getElementById("humidity").textContent =
        `${data.humidity}%`;

    document.getElementById("wind").textContent =
        `${data.wind} m/s`;

    document.getElementById("pressure").textContent =
        `${data.pressure} hPa`;

    // Right Panel

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

    changeBackground(data.condition);
    loadForecast(data.city);

}

function changeBackground(weather){

const body=document.body;

switch(weather){

case "Clear":

body.style.background="linear-gradient(135deg,#F4FAFF,#EAF6FF,#DCEFFF)";
break;

case "Clouds":

body.style.background="linear-gradient(135deg,#EEF4F8,#E1EBF4,#D4E2EE)";
break;

case "Rain":

body.style.background="linear-gradient(135deg,#E8F3FA,#D5E8F7,#C2DDF2)";
break;

case "Snow":

body.style.background="linear-gradient(135deg,#FFFFFF,#F3F8FC,#E6F2FF)";
break;

case "Thunderstorm":

body.style.background="linear-gradient(135deg,#E2EAF2,#D2DDE8,#C2D2E0)";
break;

default:

body.style.background="linear-gradient(135deg,#F4FAFF,#EAF6FF,#DCEFFF)";

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