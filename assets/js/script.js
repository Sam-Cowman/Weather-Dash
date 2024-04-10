var cityEl = document.getElementById("enter-city");
var searchEl = document.getElementById("search-button");
var nameEl = document.getElementById("city-name");
var currentPicEl = document.getElementById("current-pic");
var currentTempEl = document.getElementById("temperature");
var currentHumidityEl = document.getElementById("humidity");
var currentWindEl = document.getElementById("wind-speed");
var fivedayEl = document.getElementById("fiveday-header");
var todayweatherEl = document.getElementById("today-weather");
var searchHistory = JSON.parse(localStorage.getItem("search")) || [];

// Function to convert wind speed from meters per second to miles per hour
function convertMpsToMph(mps) {
    return Math.round(mps * 2.23694); // Convert to mph and round to nearest whole number
}
// Listen for the DOMContentLoaded event, which indicates that the HTML document has been fully loaded and parsed
document.addEventListener("DOMContentLoaded", function () {
    var searchEl = document.getElementById("search-button");
    // Check if the search button element exists
    if (searchEl) {
        searchEl.addEventListener("click", function () {
            var city = document.getElementById("enter-city").value.trim();
            citySearch(city)
        });
    } else {
        console.error("Search button element not found.");
    }
});

function citySearch(city) {
    var apiKey = "789080c772bf84186be0d95cea3d1c7b"; // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key

    // Construct the API URL using the base URL and API key
    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    // Fetch data from the API
    fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log("Data retrieved from API:", data);
            // Extract relevant information from the response for today's weather
            var cityName = data.city.name;
            var temperatureCelsius = Math.round(data.list[0].main.temp); // Round temperature to nearest whole number
            var temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32); // Convert Celsius to Fahrenheit and round to nearest whole number
            var windSpeed = data.list[0].wind.speed; // Wind speed in meters per second from API
            var windSpeedMph = Math.round(convertMpsToMph(windSpeed)); // Convert wind speed to mph and round to nearest whole number
            var weatherIconCode = data.list[0].weather[0].icon; // Weather icon code from API
            var iconUrl = `http://openweathermap.org/img/wn/${weatherIconCode}.png`;
            var humidity = data.list[0].main.humidity;

            // Update the HTML elements with the retrieved information for today's weather
            document.getElementById("city-name").textContent = cityName;
            document.getElementById("temperature").textContent = `Temperature: ${temperatureFahrenheit}°F`; // Display temperature in Fahrenheit
            document.getElementById("wind").textContent = `Wind Speed: ${windSpeedMph} mph`; // Display wind speed in mph
            document.getElementById("humidity").textContent = `Humidity: ${humidity}%`;
            document.getElementById('icon').src = iconUrl

            if (!searchHistory.includes(cityName)) {
                searchHistory.push(cityName)
                // Set item in local storage
            localStorage.setItem("search", JSON.stringify(searchHistory));
            } 
         
            // Show the weather card for today
            document.getElementById("today-weather").classList.remove("d-none");

            renderFiveDayForecast(data);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
        });
}

// Function to render the 5-day forecast
function renderFiveDayForecast(data) {
    const forecastContainer = document.getElementById("forecast-container");

    // Clear previous forecast data
    forecastContainer.innerHTML = '';

    // Loop through the forecast data to render each day's forecast
    for (let i = 0; i < data.list.length; i += 8) { // Forecast data contains data for every 3 hours, so we skip 8 items to get data for next day
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000);
        const temperatureCelsius = forecast.main.temp;
        const temperatureFahrenheit = Math.round((temperatureCelsius * 9) / 5 + 32); // Convert Celsius to Fahrenheit and round to nearest whole number
        const humidity = forecast.main.humidity;
        const windSpeedMps = forecast.wind.speed;
        const windSpeedMph = Math.round(convertMpsToMph(windSpeedMps)); // Convert wind speed from meters per second to miles per hour and round to nearest whole number
        const condition = forecast.weather[0].main;
        const iconCode = forecast.weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;

        // Create elements to display the forecast data
        const forecastElement = document.createElement("div");
        forecastElement.classList.add("col-md-2", "forecast", "custom-forecast", "text-white", "m-2", "rounded");

        forecastElement.innerHTML = `
            <div class="date">${date.toDateString()}</div>
            <div class="temperature">${temperatureFahrenheit}°F</div>
            <div class="humidity">Humidity: ${humidity}%</div>
            <div class="wind-speed">Wind Speed: ${windSpeedMph} mph</div>
            <div class="condition">${condition}</div>
            <img class="weather-icon" src="${iconUrl}" alt="${condition}">
        `;

        // Append the forecast element to the forecast container
        forecastContainer.appendChild(forecastElement);
    }

    // Show the forecast container
    document.getElementById("fiveday-header").classList.remove("d-none");
}

// Function to convert wind speed from meters per second to miles per hour
function convertMpsToMph(mps) {
    return mps * 2.23694; // Convert to mph
}

function listSearch() {
    console.log(this)
    citySearch(this.textContent)
}

if (searchHistory.length) {
    for(let i=0; i<searchHistory.length; i++) {
        let li = document.createElement("li")
        li.textContent = searchHistory[i]
        li.classList.add("list-group-item")
        li.onclick=listSearch
        document.getElementById("list").append(li)
    }
}