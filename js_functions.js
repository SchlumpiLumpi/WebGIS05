"use strict"
/*+++++++++++++++++++++++++++
        Classes
++++++++++++++++++++++++++++++*/

class Point {
    constructor(lat, lon, name) {
        this.lat = lat     // latitude in degrees
        this.lon = lon     // longtitude in degrees
        this.name = name   // name of point
    }
}

/*+++++++++++++++++++++++++++
        Variables
++++++++++++++++++++++++++++++*/

let cities
let validFile = false
let uploadButton = document.getElementById("fileupload1")

/*+++++++++++++++++++++++++++
        Functions
++++++++++++++++++++++++++++++*/

function getFiletype(inputFile) {
    let filetypeArr = (inputFile.name).split('.')  //gets filename and seperates the filetype as string
    let filetype = filetypeArr[filetypeArr.length - 1]  //get characters after last dot  
    console.log("your filetype: ", filetype)
    return filetype
}

function file_upload() {
    return new Promise((resolve, reject) => {

        let file = document.getElementById("fileupload1").files[0];
        let filetype = getFiletype(file);

        if (filetype == "json" || filetype == "geojson" || filetype == "JSON" || filetype == "geoJSON" || filetype == "GEOJSON") {
            var validFile = true
            console.log("File Type:", filetype)
            let reader = new FileReader()
            reader.readAsText(file)

            reader.onload = function () {
                const cities = JSON.parse(reader.result)
                console.log("received .json-data:", cities)
                resolve(cities)
            }

            reader.onerror = function () {
                reject = console.log(reader.error);
            }
            document.getElementById("warning1").style.display = "none"
        }
        else {
            console.log("invalid filetype:", filetype)
            document.getElementById("warning1").style.display = "inline"
        }

    })
}
//calls weatherAPI and gets temperature data for a given city
async function getWeather(city) {
    const apikey = "e028249cecdf2ae40900e3962318f043"
    let lat = city.geometry.coordinates[1].toString()
    let lon = city.geometry.coordinates[0].toString()
    const apiUrl = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=" + apikey + "&units=metric&units=metric"
    const response = await fetch(apiUrl)
    const weatherData = await response.json()
    let temperature = weatherData.main.temp
    //console.log("Cities with temp", cities)
    return new Promise((resolve) => {
        resolve(temperature)
    })
}
//fileupload --> gets temperature data for each point --> draws markers with popups
async function processCities() {
    let temp_arr = []
    var cities = await file_upload()
    for (var i = 0; i < cities.features.length; i++) {
        let temperature = await getWeather(cities.features[i])
        temp_arr.push(temperature)
    }
    console.log("received data:",temp_arr)
    drawCityMarkers(cities, temp_arr)
}

/*+++++++++++++++++++++++++++
        Eventlisteners
++++++++++++++++++++++++++++++*/

uploadButton.addEventListener("change", processCities)





