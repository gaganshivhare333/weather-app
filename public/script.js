async function getWeather(event){

    event.preventDefault(); // Prevents page refresh

    const city = document.getElementById("city").value;




    const result=document.getElementById("result");

    if(city===""){
        alert("Please enter a city name");
        return;
    }

    try{

        const response=await fetch(`/weather?city=${city}`);

        const data=await response.json();

        if(!response.ok){
            result.style.display="block";
            result.innerHTML=`<h3>${data.message}</h3>`;
            return;
        }

        result.style.display="block";

        result.innerHTML=`
            <h2>📍 ${data.city}</h2>

            <p>🌡 <strong>Temperature:</strong> ${data.temperature} °C</p>

            <p>💧 <strong>Humidity:</strong> ${data.humidity}%</p>

            <p>🌬 <strong>Wind Speed:</strong> ${data.wind} m/s</p>

            <p>☁ <strong>Condition:</strong> ${data.condition}</p>
        `;

    }

    catch(error){

        result.style.display="block";
        result.innerHTML="<h3>Something went wrong!</h3>";

    }

}