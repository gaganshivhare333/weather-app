async function getWeather(event){

    if(event) event.preventDefault();

    const city=document.getElementById("city").value;

    fetchWeather(`/weather?city=${city}`);

}

async function fetchWeather(url){

    const result=document.getElementById("result");

    const loading=document.getElementById("loading");

    loading.style.display="block";

    result.style.display="none";

    const response=await fetch(url);

    const data=await response.json();

    loading.style.display="none";

    if(!response.ok){

        result.style.display="block";

        result.innerHTML="<h2>❌ City not found</h2>";

        return;

    }

    const bg={

        Clear:"linear-gradient(135deg,#56CCF2,#2F80ED)",

        Clouds:"linear-gradient(135deg,#bdc3c7,#2c3e50)",

        Rain:"linear-gradient(135deg,#4b79a1,#283e51)",

        Snow:"linear-gradient(135deg,#E6DADA,#274046)",

        Thunderstorm:"linear-gradient(135deg,#232526,#414345)"

    };

    document.body.style.background=bg[data.condition]||bg.Clear;

    const today=new Date();

    const icon=`https://openweathermap.org/img/wn/${data.icon}@4x.png`;

    result.style.display="block";

    result.innerHTML=`

        <img class="weather-icon" src="${icon}">

        <h2>${data.city}, ${data.country}</h2>

        <h1>${data.temperature}°C</h1>

        <h3>${data.description}</h3>

        <p>${today.toDateString()}</p>

        <div class="info">

            <span>🌡 Feels Like</span>

            <span>${data.feelsLike}°C</span>

        </div>

        <div class="info">

            <span>⬇ Min Temp</span>

            <span>${data.minTemp}°C</span>

        </div>

        <div class="info">

            <span>⬆ Max Temp</span>

            <span>${data.maxTemp}°C</span>

        </div>

        <div class="info">

            <span>💧 Humidity</span>

            <span>${data.humidity}%</span>

        </div>

        <div class="info">

            <span>🌬 Wind</span>

            <span>${data.wind} m/s</span>

        </div>

        <div class="info">

            <span>👁 Visibility</span>

            <span>${data.visibility} km</span>

        </div>

        <div class="info">

            <span>🌡 Pressure</span>

            <span>${data.pressure} hPa</span>

        </div>

    `;

}

function getLocation(){

    if(!navigator.geolocation){

        alert("Geolocation is not supported.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position=>{

            const lat=position.coords.latitude;

            const lon=position.coords.longitude;

            fetchWeather(`/weather?lat=${lat}&lon=${lon}`);

        },

        ()=>{

            alert("Unable to get your location.");

        }

    );

}