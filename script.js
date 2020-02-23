let mymap = L.map("mapid").setView([51.505, -0.09], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoic3lha2lyc3llZCIsImEiOiJjazZvNXBucmUxMTFoM2ZsaXk5dW1hbmowIn0.BVFo_hjdFLIdjTdnuItG2A'
}).addTo(mymap);

let popup = L.popup();
let lat = [];
let lon = [];

function onMapClick(e) {
    popup.setLatLng(e.latlng)
         .setContent()
         .openOn(mymap);
    lat = e.latlng.lat;
    lon = e.latlng.lng;
}

mymap.on('click', onMapClick);

function convertTemp(d) {
    d -= 273.15;
    return d;
}

function convertTime(t) {
    let newT = new Date(t * 1000);
    let hours = newT.getHours();
    let minutes = "0" + newT.getMinutes();
    return hours + ":" + minutes.substr(-2);
}

function convertTime2(t) {
    let newT = new Date(t * 1000);
    let hours = newT.getHours();
    let minutes = newT.getMinutes();
    return hours + "h " + minutes + "m";
}

function randomColor() {
    let x = Math.floor(Math.random() * 360)
    let y = 50 + "%";
    let z = 75 + "%";
    return "hsl(" + x + "," + y + "," + z + ")";
}

function dayOrNight(d) {
    if ( d.endsWith("d")) {
        return "Day";
    } else return "Night";
}

function weatherChecker(w) {
    if ( w === "01d" ) {
        return "sun"
    } else if ( w === "01n") {
        return "moon"
    } else if ( w === "02d") {
        return "cloud-sun"
    } else if ( w === "02n" ) {
        return "cloud-moon"
    } else if ( w === "03d" || w === "03n" || w === "04d" || w === "04n") {
        return "cloud"
    } else if ( w === "09d" || w === "09n") {
        return "cloud-rain"
    } else if ( w === "10d" || w === "10n") {
        return "cloud-showers-heavy"
    } else if ( w === "11d" || w === "11n") {
        return "bolt"
    } else if ( w === "13d" || w === "13n" ) {
        return "snowflake"
    } else {
        return "smog"
    }
}

function weatherChecker2(w) {
    if ( w === "01d" ) {
        return "clear-day";
    } else if ( w === "01n") {
        return "clear-night"
    } else if ( w === "02d" || w === "03d" || w === "04d" || w === "09d" || w === "10d" || w === "11d" || w === "13d" ) {
        return "cloudy-day";
    } else if ( w === "02n" || w === "03n" || w === "04n" || w === "09n" || w === "10n" || w === "11n" || w === "13n") {
        return "cloudy-night";
    } else {
        return "question-mark"
    }
}


function getWindSpeed(speed) {
    return Math.round((speed * 60 * 60)/1000);
}

function getWindDescription(s) {
    if (s < 2 ) { return "Calm winds";
    } else if (s >= 2 && s < 6) {
        return "Light air";
    } else if ( s >= 6 && s < 12 ) {
        return "Light breeze";
    } else if ( s >= 12 && s < 20 ) {
        return "Gentle breeze";
    } else if ( s >= 20 && s < 29 ) {
        return "Moderate breeze";
    } else if ( s >= 29 && s < 39 ) {
        return "Fresh breeze";
    } else if ( s >= 39 && s < 50 ) {
        return "Strong breeze";
    } else if ( s >= 50 && s < 62 ) {
        return "Moderate gale";
    } else if ( s >= 62 && s < 75 ) {
        return "Fresh gale";
    } else if ( s >= 75 && s < 89 ) {
        return "Severe gale";
    } else if ( s >= 89 && s < 103 ) {
        return  "Storm";
    } else if ( s >= 103 && s < 118 ) {
        return "Violent storm";
    } else {
        return "Hurricane";
    }
}

const apiKey = "7445ce21c975bc68f969abfe8f056166";

let weatherInfo = [];

let orgCountry = [];

function getCountryName(c) {
    fetch(`https://restcountries.eu/rest/v2/alpha/${c}`)
    .then(response => response.json())
    .then(data => {
        orgCountry.shift();
        orgCountry.push(data);
    });
}

function onMapClickAgain() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            weatherInfo.shift();
            weatherInfo.push(data);
            
            let currentTemp = Math.round(convertTemp(weatherInfo[0].main.temp)) + "°C";
            let currentLocation = weatherInfo[0].name + ", " + weatherInfo[0].sys.country;
            let currentDescription = weatherInfo[0].weather[0].description;
            let currentHumidity = weatherInfo[0].main.humidity + "%";
            let extractTime = weatherInfo[0].dt + weatherInfo[0].timezone;
            let currentTime = convertTime(extractTime);
            let currentWind = getWindSpeed(weatherInfo[0].wind.speed) + " km/h";
            let windDescription = getWindDescription(getWindSpeed(weatherInfo[0].wind.speed));
            
            let currentIcon = weatherInfo[0].weather[0].main;
            let dayNight = weatherChecker2(weatherInfo[0].weather[0].icon);
            let backCol = dayNight;

            let newIcon = weatherChecker(weatherInfo[0].weather[0].icon);

            let lengthOfDay = convertTime2(weatherInfo[0].sys.sunset - weatherInfo[0].sys.sunrise);
            let feelsLike = Math.round(convertTemp(weatherInfo[0].main.feels_like)) + "°C";

            let newLocation = document.createElement("div");
            newLocation.setAttribute("id", "weatherCards");
            newLocation.setAttribute("class", `${backCol}`);
            let markup = `
            <span id="close" onClick="this.parentNode.parentNode.removeChild(this.parentNode);"><i class="fas fa-times"></i></span>
            <p id="location">${currentLocation}</p>
            <div id="timeOfDay">
            <p>${currentTime}</p></div>
            <div id="temp-icon">
            <div class="icon" id=${currentIcon}><i class="fas fa-${newIcon} fa-3x"></i></div>
            <p id="temperature">${currentTemp}</p></div>
            <p id="description">${currentDescription}</p>
            <div id="extrainfo">
            <div id="feelsLike"><p class="descriptors">Feels like:</p><p>${feelsLike}</p></div>
            <div id="dayLength"><p class="descriptors">Length of day:</p><p>${lengthOfDay}</p></div>
            <div id="humidity"><p class="descriptors">Humidity:</p><p>${currentHumidity}</p></div>
            <div id="wind"><p class="descriptors">Wind:</p><p>${windDescription}</p><p>${currentWind}</p></div>
            </div>
            `;
            newLocation.innerHTML = markup;
            document.getElementById("weather").appendChild(newLocation);
        })
        .catch(function(){

        });
}

mymap.on('click', onMapClickAgain);
