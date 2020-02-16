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
let coordi = [];
let lat = [];
let lon = [];



function onMapClick(e) {
    popup.setLatLng(e.latlng)
         .setContent(e.latlng.toString())
         .openOn(mymap);
    coordi.shift();
    coordi.push(e.latlng.toString());
    lat = e.latlng.lat;
    lon = e.latlng.lng;
}

mymap.on('click', onMapClick);

function convertTemp(d) {
    d -= 273.15;
    return d;
}

console.log(convertTemp(10));

const apiKey = "7445ce21c975bc68f969abfe8f056166";

let weatherInfo = [];

function onMapClickAgain() {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            weatherInfo.push(data);
            let currentTemp = weatherInfo[0].main.temp;
            let currentLocation = weatherInfo[0].name + ", " + weatherInfo[0].sys.country;
            let currentDescription = weatherInfo[0].weather[0].description;


            document.getElementById("location").innerHTML = currentLocation;
            document.getElementById("temperature").innerHTML = Math.round(convertTemp(currentTemp)) + "°C";
            document.getElementById("description").innerHTML = currentDescription;
        })
        .catch(function(){

        });
}

mymap.on('click', onMapClickAgain);
