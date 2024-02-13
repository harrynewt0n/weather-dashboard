var apiKey = '86a9c141c602e1495152ac19a3ac43f4';
https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
// api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
var cityName = 'London'
var forecastContainer = document.getElementById('forecast')

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);

function inputCity(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`
    fetch(url)
        .then(function (response) {
            console.log(response);
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            appendData(data)
            var lat = data.coord.lat
            var lon = data.coord.lon
            cityForcast(lat, lon)
        })
}


function cityForcast(lat, lon) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`
    fetch(url)
        .then(function (response) {
            console.log(response);
            return response.json()
        })
        .then(function (data) {
            console.log(data);
            appendForcast(data.list)
        })
}

function renderForecastCard(forecast) {
    var iconUrl = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    var iconDescription = forecast.weather[0].description;
    var tempF = forecast.main.temp;
    var humidity = forecast.main.humidity;
    var windSpeed = forecast.wind.speed;

    // Create elements for a card
    var col = document.createElement('div');
    var card = document.createElement('div');
    var cardBody = document.createElement('div');
    var cardTitle = document.createElement('h5');
    var weatherIcon = document.createElement('img');
    var tempEl = document.createElement('p');
    var windEl = document.createElement('p');
    var humidityEl = document.createElement('p');

    col.append(card);
    card.append(cardBody);
    cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

    col.setAttribute('class', 'col-md');
    col.classList.add('five-day-card');
    card.setAttribute('class', 'card bg-primary h-100 text-white');
    cardBody.setAttribute('class', 'card-body p-2');
    cardTitle.setAttribute('class', 'card-title');
    tempEl.setAttribute('class', 'card-text');
    windEl.setAttribute('class', 'card-text');
    humidityEl.setAttribute('class', 'card-text');
    // Add content to elements
    cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    tempEl.textContent = `Temp: ${tempF} °F`;
    windEl.textContent = `Wind: ${windMph} MPH`;
    humidityEl.textContent = `Humidity: ${humidity} %`;

    forecastContainer.append(col);
}
function appendForcast(dailyForecast) {

    var startDt = dayjs().add(1, 'day').startOf('day').unix();
    var endDt = dayjs().add(6, 'day').startOf('day').unix();

    var headingCol = document.createElement('div');
    var heading = document.createElement('h4');

    headingCol.setAttribute('class', 'col-12');
    heading.textContent = '5-Day Forecast:';
    headingCol.append(heading);

    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);

    for (var i = 0; i < dailyForecast.length; i++) {


        if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {

            if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
                renderForecastCard(dailyForecast[i]);
            }
        }
    }
}
// Function, For loops, objects 
function appendData(data) {
    $('#cityName').text(data.name)
    $('#currentTemp').text(data.main.temp)
    $('#currentHumidity').text(data.main.humidity)
    $('#currentWindSpeed').text(data.wind.speed)
}

function searchCity(event) {
    event.preventDefault()
    var searchInput = document.getElementById('search-input')

    cityName = searchInput.value.trim()

    inputCity(cityName)
}

$('#search-form').submit(searchCity)