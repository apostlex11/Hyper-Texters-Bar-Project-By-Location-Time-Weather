//var button = $("button");
var cityTitle = document.querySelector('#cityTitle');
var table = $('.table');
var cityData = {};
var cityStateArr = [];


//city and state to be define by user input

const weatherLookup = function (event) {
  event.preventDefault();
  
  searchInputVal = document.querySelector("#result").value;
  cityStateArr = searchInputVal.split(", ");
  //console.log(cityStateArr);
  
  
  // var city = $(".input").val();
  // console.log(city);
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityStateArr[0] + ',' + cityStateArr[1] + ',US' +
    "&appid=7e8f7106e0004f7fac5f624653ef7dca&units=imperial"
    
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      TestFunction();
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
  cityTitle.textContent = data.name;
};

const forecast = function (data) {

  for(x = 0; x < data.list.length; x += 8){
    var dayHeader = $('#' + x);
    localTime = dayjs((data.list[x].dt + data.city.timezone) * 1000).format("MM/DD/YYYY");
    dayHeader[0].innerHTML = localTime;
    for(i = 0; i < 6; i++){
      var n = x + i + 1;
      var iconcode = data.list[n].weather[0].icon;
      var imgEl = $("<img id='wicon' src='http://openweathermap.org/img/w/" + iconcode + ".png' alt='Weather icon'>");
      var td = $("<td>");
      var linebreak = $("<br>");
      var tdContent = $('#TS' + i);
      td.text(data.list[n].weather[0].description);
      tdContent.append(td);
      td.append(linebreak);
      td.append(imgEl);
    }
  }

  // function weatherStats() {

  // }

  // var template = $(".forecast");
  // daysArray.forEach(function (day) {
  //   var localTime = dayjs((day.dt + data.city.timezone) * 1000).format(
  //     "MM/DD/YYYY"
  //   );
  //   var date = $("#1-6");
  //   var wind = $("#1-6");
  //   var temp = $("#1-6");
  //   var humidity = $("#1-6");
  //   wind.text(day.wind.speed + "MPH");
  //   humidity.text(day.main.humidity + "%");
  //   temp.text(day.main.feels_like + "F");
  //   date.text(localTime);
    //card.appendTo(template);
    //card.append(wind, temp, humidity, date);
    //console.log(wind, temp, humidity);

    //template.append(card);
//   });
// table.on("click", "th", weatherStats);
  };


  function TestFunction () {
    var T = document.getElementById("cityTitle")
    T.style.display = "block";
    var T2 = document.getElementById("tableDisplay")
    T2.style.display = "block";
};

$("#srchBTN").on("click", weatherLookup);
