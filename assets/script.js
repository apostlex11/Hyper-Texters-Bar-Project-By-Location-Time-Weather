//var button = $("button");
var cityTitle = document.querySelector("#cityTitle");
var table = $(".table");
//city and state to be define by user input
var cityData = {};
var cityStateArr = [];

//vvv Variables for Yelp Api functions vvv

var tableContainerEl = document.querySelector(".table-container");

var barTime; //barTime will take the class id of a clicked weather block
var barResults; //yelp api response object

const weatherLookup = function (event) {
  event.preventDefault();

  searchInputVal = document.querySelector("#result").value;
  cityStateArr = searchInputVal.split(", ");
  //console.log(cityStateArr);

  // var city = $(".input").val();
  // console.log(city);
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      cityStateArr[0] +
      "," +
      cityStateArr[1] +
      ",US" +
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
      console.log(cityData);
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
  for (x = 0; x < data.list.length; x += 8) {
    var dayHeader = $("#" + x);
    localTime = dayjs((data.list[x].dt + data.city.timezone) * 1000).format(
      "MM/DD/YYYY"
    );
    console.log(localTime);
    dayHeader[0].innerHTML = localTime;
    for (i = 0; i < 6; i++) {
      var n = x + i + 1;
      var iconcode = data.list[n].weather[0].icon;
      var imgEl = $(
        "<img id='wicon' src='http://openweathermap.org/img/w/" +
          iconcode +
          ".png' alt='Weather icon'>"
      );
      //give every cell an id of the unix timestamp to be passed into Yelp API call
      var td = $("<td id=" + data.list[n].dt + ">");
      var linebreak = $("<br>");
      var tdContent = $("#TS" + i);
      td.text(data.list[n].weather[0].description);
      tdContent.append(td);
      if (
        data.list[n].weather[0].description === "clear sky" ||
        data.list[n].weather[0].description === "broken clouds" ||
        data.list[n].weather[0].description === "scattered clouds" ||
        data.list[n].weather[0].description === "few clouds"
      ) {
        td.append(linebreak);
        td.append(imgEl);
        td[0].style.backgroundColor = "yellow";
      } else if (data.list[n].weather[0].description !== "clear sky") {
        td[0].style.backgroundColor = "gray";
      }
    }
  }

  // function weatherStats() {

  // }

  // var template = $(".forecast");
  // daysArray.forEach(function (day) {
  //   var localTime = dayjs((day.dt + data.city.timezone) * 1000).format(
  //     "MM/DD/YYYY"
  //   );
};

//***** Yelp API section below *****/

tableContainerEl.addEventListener("click", function (event) {
  var clickTarget = event.target;
  if (event.target.style.backgroundColor === "yellow") {
    //if user clicks on a yellow cell
    barTime = event.target.id; // set barTime to id, which is the un
    console.log("bartime is " + barTime); // delete
    callYelp();

    // console.log("it's yellow");
  } else if (event.target.parentElement.style.backgroundColor === "yellow") {
    barTime = event.target.parentElement.id;
    console.log("bartime is " + barTime); // delete
    callYelp();
  }
});

function callYelp() {
  var lat = cityData.coord.lat;
  var long = cityData.coord.lon;

  let yelpQueryURL =
    "https://morning-forest-62820.herokuapp.com/https://api.yelp.com/v3/businesses/search";
  const yelpAPIKey =
    "OvqraNwLlNROU78GbI7ZocG6XKXRhYIKGby6JiTRzyOqjzUrjnVRThOlOtQSVIIN2dh0TWrttP0TtXJncUKu6sEKB4ywoOo-jAz1HjmDta069a2EQC1mvn37QGbPY3Yx";

  $.ajax({
    url: yelpQueryURL,
    method: "GET",
    headers: {
      accept: "application/json",
      "x-requested-with": "xmlhttprequest",
      "Access-Control-Allow-Origin": "*",
      Authorization: `Bearer ${yelpAPIKey}`,
    },
    data: {
      latitude: lat,
      longitude: long,
      categories: "bars",
      open_at: barTime, //only works for the current week Monday-Sunday. problem on Yelp's end.
    },
  }).then(function (res) {
    barResults = res;
    console.log(barResults);
    displayBars();
  });
}

// display bar information
function displayBars() {
  var barEl;
  for (let index = 0; index < 5; index++) {
    barEl = document.getElementById(`bar-${index}`);
    console.log("barEl = " + barEl, barResults);
    barEl.textContent = barResults.businesses[index].name;
  }
}

function TestFunction() {
  var T = document.getElementById("cityTitle");
  T.style.display = "block";
  var T2 = document.getElementById("tableDisplay");
  T2.style.display = "block";
}

$("#srchBTN").on("click", weatherLookup);
