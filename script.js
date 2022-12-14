//Get API call to work for 1 city. Complete/London
//Add momentjs for current date. complete
//Get API Call to work based on user input/selection of a city
//Modify API call to obtain the specific weather data specified in the acceptance criteria
//Display weather data


const userformEl = $('#choose-city');
const secondcolumnEl = $('.second-column');
const cityInputEl = $('#city');
const searchHistEl = $('#search-history');
const currentDay = moment().format('M/DD/YYYY');

function loadSearchHistory() {
const searchHistoryArray = JSON.parse(localStorage.getItem('search history')) || [];
if (!searchHistoryArray.length){
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
if(searchHistoryArray.includes(newCity)){
  return
}
  searchHistoryArray.push(newCity)
  console.log(searchHistoryArray)
 localStorage.setItem("search history", JSON.stringify(searchHistoryArray));
 loadSearchHistory()
};

function searchHistory(city) {
const searchHistoryBtn = $('<button>')
 .addClass('btn')
 .text(city)
 .on('click', function() {
 $('#current-weather').remove();
 $('#five-day').empty();
 $('#five-day-header').remove();
  getWeather(city);
 })
 .attr({
 type: 'button'
 });
 searchHistEl.append(searchHistoryBtn); 
}

function getWeather(city,event) {
  if(event){
    event.preventDefault()
  }
  const openWeatherApiKey = "6d21d42893bbc8fff541b0af31682596";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openWeatherApiKey}`
  fetch(url).then(function (response,city) {
    return response.json()
  }).then(function (data) {
    // makeMainCard(data)   
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
    makeCurrentWeather(data.list[0])
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
  fiveDayEl[0].innerHTML = ""
  for(let i=0; i< data.length; i++){
    fiveDayEl[0].innerHTML +=`<div class="third-column">
      <div class="card-body">
      <h3 class="card-title">${data[i].dt_txt}</h3>
      <img src="http://openweathermap.org/img/wn/${data[i].weather[0].icon}.png" alt="${data[i].weather[0].description}"/>
      <h3 class="card-title"> Temp: ${data[i].main.temp}F </h3>
      <h3 class="card-title"> Wind: ${data[i].wind.speed} MPH </h3>
      <h3 class="card-title"> Humidity: ${data[i].main.humidity} % </h3>
    </div>`
  }
}

function makeCurrentWeather(data) {
  console.log("making current weather")
  console.log(data)
}

// makeCurrentWeather()
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
