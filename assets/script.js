//var button = $("button");
var cityTitle = document.querySelector("#cityTitle");
var table = $(".table");
var txtWarning = $("#noTXT");
//city and state to be define by user input

var cityStateArr = [];
var forecastData = {}; // assign last forecast object to put in local storage
var storedForecast = JSON.parse(localStorage.getItem("forecastData")); //get value of forecastData from local storage
var storedCityData = JSON.parse(localStorage.getItem("cityData")); //get value of cityData from local storage
var cityData = storedCityData;

//vvv Variables for Yelp Api functions vvv

var tableContainerEl = document.querySelector(".table-container");

var barTime; //barTime will take the class id of a clicked weather block
var barResults; //yelp api response object

const weatherLookup = function (event) {
  event.preventDefault();
  hideStores(); //hide bar suggestions upon a new city search
  $(".bar-list").find("li").remove(); //remove any bars currently on DOM from previous call

  searchInputVal = document.querySelector("#result").value;
  if(searchInputVal === ''){
    txtWarning[0].innerHTML = 'Please enter a city name and state code in the format provided.';
    txtWarning[0].attributes.style.textContent = "visibility: visible";
    setTimeout(()=>{
      txtWarning[0].attributes.style.textContent = "visibility: hidden";
    }, 4000)
    return;
  };
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
      console.log(response.status);
      console.log(txtWarning);
      if(response.status === 404){
        txtWarning[0].innerHTML = 'Please enter a city name and state code in the format provided.';
        txtWarning[0].attributes.style.textContent = "visibility: visible";
        setTimeout(()=>{
          txtWarning[0].attributes.style.textContent = "visibility: hidden";
        }, 4000)
        return;
      };
      return response.json();
    })
    .then(function (data) {
      if(data === undefined){
        return;
      }
      console.log(data);
      TestFunction();
      current(data);
      cityData = data;
      //store cityData in local storage
      localStorage.setItem("cityData", JSON.stringify(data));
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
      forecastData = data;
      //store forecastData in local storage
      localStorage.setItem("forecastData", JSON.stringify(forecastData));
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
  $("table").find("td").remove();
  for (x = 0; x < data.list.length; x += 8) {
    var dayHeader = $("#" + x);
    var localTime = dayjs((data.list[x].dt + data.city.timezone) * 1000).format(
      "MM/DD/YYYY"
    );
    console.log(localTime);
    dayHeader[0].innerHTML = localTime;
    for (i = 0; i < 6; i++) {
      var tdContent = $("#TS" + i);

      var n = x + i + 1;
      var iconcode = data.list[n].weather[0].icon;
      var imgEl = $(
        "<img id='wicon' src='http://openweathermap.org/img/w/" +
          iconcode +
          ".png' alt='Weather icon'>"
      );
      //give every cell an id of the unix timestamp to be passed into Yelp API call
      var td = $("<td id=" + data.list[n].dt + ">");

      var conditionsPtag = document.createElement("p");
      var tempPtag = document.createElement("p");
      var tempVal = Math.floor(data.list[n].main.temp);

      conditionsPtag.textContent = data.list[n].weather[0].description;
      td.append(conditionsPtag);
      tdContent.append(td);

      // var linebreak = $("<br>");
      // td.text(data.list[n].weather[0].description);
      // tdContent.append(td);
      if (
        data.list[n].weather[0].description === "clear sky" ||
        data.list[n].weather[0].description === "broken clouds" ||
        data.list[n].weather[0].description === "scattered clouds" ||
        data.list[n].weather[0].description === "few clouds"
      ) {
        // td.append(linebreak);
        td.append(imgEl);
        // td.append(linebreak);

        tempPtag.textContent = `${tempVal}º`;
        td.append(tempPtag);

        td[0].style.backgroundColor = "yellow";
        td[0].style.cursor = "pointer";
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

  //if user clicks on a yellow cell
  if (event.target.style.backgroundColor === "yellow") {
    barTime = event.target.id; // set barTime to cell id, which is the unix timestamp to pass to yelp
    callYelp();
    // in case uses clicks on the image inside of a yellow cell, we still want to call Yelp API
  } else if (event.target.parentElement.style.backgroundColor === "yellow") {
    barTime = event.target.parentElement.id;
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

  //fetch request
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

    //list bars on DOM at end promise
    displayBars();
    ShowStores();
  });
}

// display bar information
function displayBars() {
  $(".bar-list").find("li").remove(); //remove any bars currently on DOM from previous call
  for (let index = 0; index < 5; index++) {
    var barEl = document.getElementById(`bar-${index}`);
    var barURL = barResults.businesses[index].url;
    var nameLi = document.createElement("li");
    var ratingLi = document.createElement("li");
    var priceLi = document.createElement("li");
    var styleLi = document.createElement("li");

    nameLi.innerHTML = `<a href=${barURL} target=_blank>${barResults.businesses[index].name}</a>`;
    ratingLi.textContent = `Rating: ${barResults.businesses[index].rating}`;
    priceLi.textContent = `Price: ${barResults.businesses[index].price}`;
    styleLi.textContent = `Style: ${barResults.businesses[index].categories[0].title}`;

    barEl.append(nameLi);
    barEl.append(ratingLi);
    barEl.append(priceLi);
    barEl.append(styleLi);

    //image stuff. use or comment out.
    var imageLi = document.createElement("li");

    imageLi.innerHTML = `<img src=${barResults.businesses[index].image_url} alt= "default uploaded to Yelp by the business"></img>`;
    barEl.append(imageLi);
    imageLi.style.border = "3px solid #000000";
    imageLi.style.padding = "5px 5px 1px 5px";
    imageLi.style.margin = "0px";
  }
}

function TestFunction() {
  var T = document.getElementById("cityTitle");
  T.style.display = "block";
  var T2 = document.getElementById("tableDisplay");
  T2.style.display = "block";
}

function ShowStores() {
  var storeslist = document.getElementById("storeLists");
  storeslist.style.visibility = "visible";
  // storeslist.style.justifyContent = "center"
}

function hideStores() {
  var storeslist = document.getElementById("storeLists");
  storeslist.style.visibility = "hidden";
}

$("#srchBTN").on("click", weatherLookup);

// on page load check if there was forecast object in local storage before showing the table
if (storedForecast !== null) {
  forecast(storedForecast); //re-parses previous forecast data
  cityTitle.textContent = storedForecast.city.name; // show city name
  TestFunction(); //displays table
}

//on page load, check if storedCityData exists, and then assign it to cityData for the yelp call
if (storedCityData) {
  cityData = storedCityData;
}
