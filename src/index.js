//document elements
const labelCity = document.getElementById('labelCityInfo');
const minTemperature = document.getElementById('minTemperature');
const maxTemperature = document.getElementById('maxTemperature');
const temperature = document.getElementById('temperature');
const img = document.getElementById('img');
const description = document.getElementById('description');
const inputSearchCity = document.getElementById('inputSearchCity');

//Constantes para a Url da api
const baseUrl = 'http://dataservice.accuweather.com/';
const key = 'keckW8GVZx87IJaGNDpQxFMzKopmSYMv';
const language = 'pt-br';

let topCities;
let currentCity;

async function getTopCities() {
    let cities
    await axios.get(`${baseUrl}locations/v1/topcities/50?apikey=${key}`)
        .then(res => {
            cities = res.data;
        })

    return cities;
}

function getFirstLocation() {
    navigator.geolocation.getCurrentPosition(position => {
        getCityInfo(position.coords.latitude, position.coords.longitude).then(
            res => {
                setLabelCity(res.LocalizedName, res.AdministrativeArea.LocalizedName, res.Country.LocalizedName);
                getForecastDaily(res.Key)
                    .then(res => {
                        setForecastLabel(res.data.DailyForecasts[0].Temperature.Minimum, res.data.DailyForecasts[0].Temperature.Maximum)
                    })
                getForecast(res.Key).then(
                    res => {
                        setCurrentForecastLabel(res.data[0]);
                    }
                )
            }
        )    
    })    
}

function setLocationSearched() {
    let cityName = inputSearchCity.value;
    getCityByName(cityName)
        .then(response => {
            setLabelCity(response[0].LocalizedName, response[0].AdministrativeArea.LocalizedName, response[0].Country.LocalizedName)
            getForecastDaily(response[0].Key)
                    .then(res => {
                        setForecastLabel(res.data.DailyForecasts[0].Temperature.Minimum, res.data.DailyForecasts[0].Temperature.Maximum)
                    })
                getForecast(response[0].Key).then(
                    res => {
                        setCurrentForecastLabel(res.data[0]);
                    }
                )
        })
    inputSearchCity.value = ""
}

async function getCityInfo(latitude, longitude) {
    try {
        const response = await axios.get(`${baseUrl}locations/v1/cities/geoposition/search?apikey=${key}&q=${latitude},${longitude}`)
        return response.data;
    } catch (err) {
        console.log('Get city error');
    }
      
}

async function getCityByName(city) {
    let result;
    await axios.get(`${baseUrl}locations/v1/cities/search?apikey=${key}&q=${city}`)
            .then(res => {
                result = res.data;
            })
    return result;
}

async function getForecast(locationKey) {
    try {
        const result = await axios.get(`${baseUrl}forecasts/v1/hourly/1hour/${locationKey}?apikey=${key}&language=${language}`);
        return result;
        
    } catch (err) {
        console.log('Err Get forecast');
    }
    
}

async function getForecastDaily(locationKey) {
    try {
        const result = await axios.get(`${baseUrl}forecasts/v1/daily/1day/${locationKey}?apikey=${key}&language=${language}`);
        return result;
        
    } catch (err) {
        console.log('Err Get forecast daily');
    }
    
}

function setLabelCity(city, uf, country) {
    let labelString = `${city}, ${uf}, ${country}`;
    labelCity.textContent = labelString;
}

function setForecastLabel(min, max) {
    //console.log(min);
    if(min.Unit == 'F') {
        minTemperature.textContent = convertToCelsius(min.Value).toString();
    }
    if(max.Unit == 'F') {
        maxTemperature.textContent = convertToCelsius(max.Value).toString();
    }
    
}

function setCurrentForecastLabel(data) {
    //console.log(data);
    if(data.Temperature.Unit == 'F') {
        temperature.textContent = convertToCelsius(data.Temperature.Value).toString() + '°C';
        description.textContent = data.IconPhrase;
        if(data.IsDaylight) {
            img.src = "asstes/sun.png";
        } else {
            img.src = "asstes/moon.png";
        }
    }
    
}

function convertToCelsius(temperature) {
    return ((temperature - 32) * (5/9)).toFixed(2) ;    
}

getFirstLocation();



