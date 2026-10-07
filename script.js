// API Key Setup
const apiKey = "02671b99e6cfc317be9506af7d80da1c";

//Select DOM Elements
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const currentWeatherDiv = document.getElementById("current-weather");
const foreCastDiv = document.getElementById("forecast");

// Add Event Listener
searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (city !== "") {
    getWeatherData(city);
  } else {
    alert("Please enter a city name.");
  }
});

// Main function
async function getWeatherData(city) {
  try {
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const currentResponse = await fetch(currentUrl);

    if (!currentResponse.ok) {
      alert("City not found. Please try again.");
      return;
    }

    const currentData = await currentResponse.json();
    displayCurrentWeather(currentData);

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const forecastRespons = await fetch(forecastUrl);
    const forecastData = await forecastRespons.json();

    displayForecast(forecastData);
  } catch (error) {
    console.error();
  }
}

//5. Display current weather
function displayCurrentWeather(data) {
  const cityName = data.name;
  const temp = Math.round(data.main.temp);
  const description = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  currentWeatherDiv.innerHTML = `<div class="weather-info">
            <h2>${cityName}</h2>
            <img src="${iconUrl}" alt="${description}">
            <p class="temperature">${temp}°C</p>
            <p style="text-transform: capitalize;">${description}</p>
        </div>
    `;
  currentWeatherDiv.classList.remove("hidden");
}

// 6. Display forecast
function displayForecast(data) {
  const dailyForecasts = data.list.filte((item) =>
    item.dt_txt.includes("12:00:00"),
  );

  let forecastHTML = `<h3>Forecast for upcoming days:</h3><div class="forecast-cards">`;

  dailyForecasts.forEach((forecast) => {
    const date = new Date(forecast.dt.txt);
    const dateString = date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });

    const temp = Math.round(forecast.main.temp);
    const iconCode = forecast.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;

    forecastHTML += `
            <div class="card">
                <p><strong>${dateString}</strong></p>
                <img src="${iconUrl}" alt="weather icon">
                <p>${temp}°C</p>
            </div>
        `;
  });

  forecastHTML += `</div>`;

  foreCastDiv.innerHTML = forecastHTML;
  foreCastDiv.classList.remove("hidden");
}
