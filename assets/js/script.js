// Global Variables
let cityNameInput = document.getElementById("city-name");
let submitBtn = document.getElementById("submit");
let days = document.getElementById("five-days");
let cityArray = [];
let savedCities = document.querySelector("#saved-cities");

// Capture search data from user with form handler
let formHandler = function(event) {
    event.preventDefault();

    //clear previous results, if any
    days.innerHTML = "";
    
    // get value from input element
    let cityName = cityNameInput.value.trim();

    if (cityName) {
        getCityForecast(cityName);
        $("#saved-cities").empty();
        saveCityName(cityName);
        theClick();
        cityNameInput.value = "";
    } else {
        alert("Please enter a city name.");
    }
}

// Use search data to show current and future conditions for the city searched, search is added to search history
let getCityForecast = function(cityName) {
    
    // format the url
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=407e110314c7d9e3802fdaecbeccde6f";
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        assignForecastData(data);
        getUVIndex(data);
    });
}

// Each city should show city name, date, icon rep of weather conditions, temp, humidity, wind speed, UV index
let assignForecastData = function(data) {

    // assigning values
    let currentCity = data.city.name;
    let currentTemp = Math.floor((data.list[0].main.temp - 273) * 9 / 5 + 32);
    let degree = "&#176";
    let currentHumidity = data.list[0].main.humidity;
    let currentWind = Math.floor(data.list[0].wind.speed);
    document.querySelector(".icon").innerHTML = 
    "<img src='http://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png' alt='Icon depicting current weather.'>";

    document.getElementById("time").innerHTML =  moment().format("dddd, MMMM Do, h:mm a");
    document.getElementById("city").innerHTML = currentCity;
    document.getElementById("temp").innerHTML = "Temperature: " + currentTemp + degree + "F";
    document.getElementById("humidity").innerHTML = "Humidity: " + currentHumidity;
    document.getElementById("wind-speed").innerHTML = "Wind speed: " + currentWind + "mph";

    getFiveDays(data);
}

let getUVIndex = function(data) {
    let lat = data.city.coord.lat;
    let long = data.city.coord.lon;

    let newApiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+long+"&exclude=hourly,daily&appid=407e110314c7d9e3802fdaecbeccde6f";
    
    // make a request to the url
    fetch(newApiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        // UV index presents a color to indicate whether conditions are favorable, moderate, or severe
        let currentUVIndex = Math.floor(data.current.uvi);
        let uvIndex = document.getElementById("uv-index");
        uvIndex.innerHTML = currentUVIndex;
        document.getElementById("index-text").innerHTML = "UV Index: ";
        if (currentUVIndex < 3) {
            uvIndex.style.backgroundColor = "green";
        } else if (currentUVIndex > 2 && currentUVIndex < 6) {
            uvIndex.style.backgroundColor = "yellow";
        } else if (currentUVIndex > 5 && currentUVIndex < 8) {
            uvIndex.style.backgroundColor = "orange";
        } else if (currentUVIndex > 7) {
            uvIndex.style.backgroundColor = "red";
        }
    });
}

// Future weather conditions show 5-day forecast, date, icon of weather conditions, temp, humidity
let getFiveDays = function(data) {
    
    for (var i = 0; i < data.list.length; i++) {

        if(data.list[i].dt_txt.endsWith("12:00:00")) {
            
            let oneDay = data.list[i].dt_txt;
            let fiveDays = document.createElement("div");
            fiveDays.classList.add("col-2")

            fiveDays.innerHTML = 
            '<div class="col-2 five-day"><h6>' + moment(oneDay).format("ddd") +
            '</h6><h6>' + "<img src='http://openweathermap.org/img/w/" +
            data.list[i].weather[0].icon + ".png' alt='Icon depicting current weather.'>" +
            '</h6><h6>' + "Temp: " + Math.floor((data.list[i].main.temp - 273) * 9 / 5 + 32) +
            '</h6><h6>' + "Humidity: " + data.list[i].main.humidity + '</h6></div>';

            days.appendChild(fiveDays);
        }
    }
}

// Search history click pulls up info same as entering city in search bar
let saveCityName = function(cityName) {
    
    cityArray.push(cityName);
    console.log(cityArray)
    localStorage.setItem("cities", JSON.stringify(cityArray));
    restoreCityName();
}

let restoreCityName = function() {

    
    let history = JSON.parse(localStorage.getItem("cities"));
    console.log(history)

    for (i = 0; i < history.length; i++) {
    
        if (history[i]) {
            newEl = document.createElement("div");
            newEl.innerHTML = '<p class="history">' + history[i] + '</p><br>';
            document.querySelector(".saved-cities").appendChild(newEl);
        }
    }
}

let theClick = function() {
    document.querySelector(".history").addEventListener("click", anchorFunction);
}

let anchorFunction = function() {
    let anchor = document.querySelector(".history").value;
    getCityForecastAgain(anchor);
    console.log(anchor)
    
}

let getCityForecastAgain = function(anchor) {
    
    // format the url
    let apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + anchor + "&appid=407e110314c7d9e3802fdaecbeccde6f";
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        return response.json()
    }).then(function(data) {
        assignForecastData(data);
        getUVIndex(data);
    });
}


function defaultCity() {
    let cityName = "Boston";
    getCityForecast(cityName);
    cityName = "";
}

defaultCity();
restoreCityName();
submitBtn.addEventListener("click", formHandler);



