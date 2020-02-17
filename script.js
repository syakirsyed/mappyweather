let mymap = L.map("mapid").setView([51.505, -0.09], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
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
         .setContent(e.latlng.toString())
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
    let hours = newT.getHours()
    let minutes = "0" + newT.getMinutes();
    return hours + ":" + minutes.substr(-2);
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
    if (w = "Clear") {

    }
}



const apiKey = "7445ce21c975bc68f969abfe8f056166";

let weatherInfo = [];

function onMapClickAgain() {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
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
            let currentWind = weatherInfo[0].wind.speed + "m/s";
            let backCol = randomColor();
            let currentIcon = weatherInfo[0].weather[0].main;
            let dayNight = dayOrNight(weatherInfo[0].weather[0].icon);

            let newLocation = document.createElement("div");
            newLocation.setAttribute("id", "weatherCards");
            newLocation.setAttribute("style", `background-color: ${backCol};`);
            let markup = `
            <h2 id="location">${currentLocation}</h2>
            <p id="temperature">${currentTemp}</p>
            <div id=${currentIcon}></div>
            <p>${currentDescription}</p>
            <p>${currentHumidity}</p>
            <p>${currentTime} --- ${dayNight}</p>
            <p>${currentWind}</p>
            `;
            newLocation.innerHTML = markup;
            document.getElementById("weather").appendChild(newLocation);

        })
        .catch(function(){

        });
}

mymap.on('click', onMapClickAgain);
