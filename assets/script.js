//var button = $("button");
var cityData = {};

const weatherLookup = function (event) {
  event.preventDefault();

  var city = $(".input").val();
  console.log(city);
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=7e8f7106e0004f7fac5f624653ef7dca&units=imperial"
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      current(data);
      cityData = data;
      forecastLookup(data.coord.lat, data.coord.lon);

      var container = $("#current");
      //data in console will have lat and long for city
      //then do string concat lat and long with what you get in the data object
      //fetch("https//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7e8f7106e0004f7fac5f624653ef7dca")
    });

  //fetch("https//api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=7e8f7106e0004f7fac5f624653ef7dca")
};
const forecastLookup = function (lat, lon) {
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
      lat +
      "&lon=" +
      lon +
      "&appid=7e8f7106e0004f7fac5f624653ef7dca&units=imperial"
  )
    .then(function (response) {
      //console.log(response)
      return response.json();
    })
    .then(function (data) {
      console.log(data.list);
      forecast(data);
    });
};
const current = function (data) {
  $("#name").text(data.name);
  $("#tempurature").text(data.main.temp);
  $("#wind").text(data.wind.speed);
  $("#humidity").text(data.main.humidity);
  //   saveSearch(data.name);
  console.log(data);
};

const forecast = function (data) {
  // console.log(localTime, data, cityData);
  var daysArray = [
    //Index 0 starts at 6:00 AM
    //Every 8 indexes starts a new day
    data.list[0],
    data.list[1],
    data.list[2],
    data.list[3],
    data.list[4],
    data.list[5],
    data.list[6],
    data.list[7],
    data.list[8],
    data.list[9],
  ];
  var template = $(".forecast");
  daysArray.forEach(function (day) {
    var localTime = dayjs((day.dt + data.city.timezone) * 1000).format(
      "MM/DD/YYYY"
    );
    var date = $("#1-6");
    var wind = $("#1-6");
    var temp = $("#1-6");
    var humidity = $("#1-6");
    wind.text(day.wind.speed + "MPH");
    humidity.text(day.main.humidity + "%");
    temp.text(day.main.feels_like + "F");
    date.text(localTime);
    //card.appendTo(template);
    //card.append(wind, temp, humidity, date);
    console.log(wind, temp, humidity);

    //template.append(card);
  });
};

$("#search").on("submit", weatherLookup);
