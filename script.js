const userformEl = $('#choose-city');
const cityInputEl = $('#city');
const searchHistEl = $('#search-history');
const currentDay = moment().format('MM/DD/YYYY');

function loadSearchHistory() {
  const searchHistoryArray = JSON.parse(localStorage.getItem('search history')) || [];
  if (!searchHistoryArray.length) {
    localStorage.setItem("search history", JSON.stringify(searchHistoryArray))
    return
  }
  searchHistEl.empty()
  for (var i = 0; i < searchHistoryArray.length; i++) {
    searchHistory(searchHistoryArray[i]);
  }
}

function saveSearchHistory(newCity) {
  console.log('saving... ', newCity)
  const searchHistoryArray = JSON.parse(localStorage.getItem('search history')) || [];
  if (searchHistoryArray.includes(newCity)) {
    return
  }
  searchHistoryArray.push(newCity)
  console.log(searchHistoryArray)
  localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
  loadSearchHistory()
};

function searchHistory(city) {
  const searchHistoryBtn = $('<button>')
    .addClass('btn btn-secondary')
    .text(city)
    .on('click', function () {
      getWeather(city);
    })
    .attr({
      type: 'button'
    });
  searchHistEl.append(searchHistoryBtn);
}

function getWeather(city, event) {
  if (event) {
    event.preventDefault()
  }
  const openWeatherApiKey = "6d21d42893bbc8fff541b0af31682596";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`
  fetch(url).then(function (response, city) {
    return response.json()
  }).then(function (data) {
    fetchForecast(data.coord.lat, data.coord.lon)
  }).catch(function (error) {
    console.log(error)
  })
}

function fetchForecast(cityLatitude, cityLongitude) {
  console.log("Fetching forecast")
  const openWeatherApiKey = "6d21d42893bbc8fff541b0af31682596";
  const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?lat="
  const url = forecastUrl + cityLatitude + "&lon=" + cityLongitude + "&appid=" + openWeatherApiKey + "&units=imperial";
  fetch(url).then(function (response) {
    return response.json()
  }).then(function (data) {
    console.log(data)
    saveSearchHistory(data.city.name)
    var useFulData = []
    for (let i = 5; i < data.list.length; i += 8) {
      useFulData.push(data.list[i])
    }
    makeCurrentWeather(data.list[0],data.city.name)
    makeFiveDay(useFulData)
  }).catch(function (error) {
    console.log(error)
  })
}

function makeFiveDay(data) {
  console.log('making five day')
  console.log(data)
  const fiveDayEl = $('#five-day');
  console.log(fiveDayEl)
  fiveDayEl.html("")
  for (let i = 0; i < data.length; i++) {
    fiveDayEl.append (`<div class="card">
    <h6 class="card-title">${moment(data[i].dt_txt).format('MM/DD/YYYY')}</h6>
      <div class="card-body">
      <img src="http://openweathermap.org/img/wn/${data[i].weather[0].icon}.png" alt="${data[i].weather[0].description}"/>
      <p> Temp: ${data[i].main.temp}F </p>
      <p> Wind: ${data[i].wind.speed} MPH </p>
      <p> Humidity: ${data[i].main.humidity} % </p>
    </div>
    </div>`)
  }
}

function makeCurrentWeather(data,city) {
  console.log("making current weather")
  console.log(data)
  $("#current-weather").html(`<div class="d-flex justify-content-between">
  <h3 class="card-title">${city}</h3>
  <div class="card-body">
  <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"/>
  <p> Temp: ${data.main.temp}F </p>
  <p> Wind: ${data.wind.speed} MPH </p>
  <p> Humidity: ${data.main.humidity} % </p>
  </div>
</div>`)
}

function submitCitySearch(event) {
  event.preventDefault();
  const city = cityInputEl.val().trim();
  if (city) {
    getWeather(city);
    cityInputEl.val('');
  } else {
    alert("Please choose a city");
  }
}

userformEl.on("submit", submitCitySearch);
loadSearchHistory()
