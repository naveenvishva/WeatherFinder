const express = require('express');
const https = require("https");
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// serve the index.html file on the root path
app.get('/', function(request, response) {
    response.sendFile(__dirname + "/index.html");
});

// function to get weather data from OpenWeatherMap API
function getWeatherData(query, response) {
    const apiKey = "<<your api keys please>>";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(res) {
        res.on("data", function(data) {
            const weather = JSON.parse(data);
            const weatherTemp = weather.main.temp;
            const weatherDes = weather.weather[0].description;
            const weatherIcon = weather.weather[0].icon;
            const weatherImageUrl = "http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png";

            // write the weather data to the response
            response.write('<div style="text-align: center; margin-top: 50px; padding-top: 20px;">');
            response.write('<h1>The temperature in ' + query + ' is ' + weatherTemp + ' &#8451;</h1>');
            response.write('<h2>' + weatherDes + '</h2>');
            response.write('<img src="' + weatherImageUrl + '">');

            // add a form with a button to search for another city
            response.write('<form action="/" method="get" style="margin-top: 20px;">');
            response.write('<button type="submit" style="padding: 10px 20px; background-color: #007bff; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Search Another City</button>');
            response.write('</form>');

            // end the response
            response.send();
        });
    });
}

// handle POST requests to the root path
app.post('/', function(request, response) {
    const query = request.body['city-name'];
    getWeatherData(query, response);
});

// start the server on port 3333
app.listen(3333, function() {
    console.log("server is started on port 3333");
});
