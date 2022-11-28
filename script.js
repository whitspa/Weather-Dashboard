//Get API call to work for 1 city. Complete/London
//Modify API call to obtain the specific weather data specified in the acceptance criteria
//Display weather data
//Get API Call to work based on user input/selection of a city
//
fetch("https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=6d21d42893bbc8fff541b0af31682596")
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
  })
