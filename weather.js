// OpenWeatherMap API key
const apikey = "aa6a3807cdfe973196d2eea9624e2574";

// Event listener for page load
window.addEventListener("load", () => {
    // Check if geolocation is available in the browser
    if (navigator.geolocation) {
        // Get the user's current position
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude; // Longitude
            let lat = position.coords.latitude;  // Latitude

            // API URL to fetch weather data based on user's location
            const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            // Fetch weather data
            fetch(url).then((res) => {
                return res.json();
            }).then((data) => {
                console.log(data); // Log weather data
                console.log(new Date().getTime()); // Log current timestamp
                var dat = new Date(data.dt); // Convert timestamp to date
                console.log(dat.toLocaleString(undefined, 'Asia/Kolkata')); // Log date in local format
                console.log(new Date().getMinutes()); // Log current minutes
                weatherReport(data); // Call function to display weather report
            });
        });
    }
});

// Function to search weather by city name
function searchByCity() {
    // Get the city name from the input field
    var place = document.getElementById('input').value;

    // API URL to fetch weather data for the entered city
    var urlsearch = `http://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

    // Fetch weather data
    fetch(urlsearch).then((res) => {
        return res.json();
    }).then((data) => {
        console.log(data); // Log weather data
        weatherReport(data); // Call function to display weather report
    });

    // Clear the input field
    document.getElementById('input').value = '';
}

// Function to display the weather report
function weatherReport(data) {
    // API URL to fetch 5-day weather forecast
    var urlcast = `http://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

    // Fetch forecast data
    fetch(urlcast).then((res) => {
        return res.json();
    }).then((forecast) => {
        console.log(forecast.city); // Log city details
        hourForecast(forecast); // Call function to display hourly forecast
        dayForecast(forecast);  // Call function to display daily forecast

        // Display city name and country
        document.getElementById('city').innerText = data.name + ', ' + data.sys.country;

        // Display current temperature
        document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273) + ' °C';

        // Display weather description
        document.getElementById('clouds').innerText = data.weather[0].description;

        // Display weather icon
        let icon1 = data.weather[0].icon;
        let iconurl = "http://api.openweathermap.org/img/w/" + icon1 + ".png";
        document.getElementById('img').src = iconurl;
    });
}

// Function to display hourly forecast
function hourForecast(forecast) {
    // Clear the existing hourly forecast
    document.querySelector('.templist').innerHTML = '';

    // Loop through the first 5 forecast entries
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000); // Convert timestamp to date
        console.log((date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '')); // Log time

        // Create a container for the hourly forecast
        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        // Create a div for time and temperature
        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = (date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '');

        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';

        div.appendChild(time);
        div.appendChild(temp);

        // Create a paragraph for weather description
        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;

        // Append time, temperature, and description to the container
        hourR.appendChild(div);
        hourR.appendChild(desc);

        // Append the container to the hourly forecast section
        document.querySelector('.templist').appendChild(hourR);
    }
}

// Function to display daily forecast
function dayForecast(forecast) {
    // Clear the existing daily forecast
    document.querySelector('.weekF').innerHTML = '';

    // Loop through the forecast data for every 8th entry (daily data)
    for (let i = 8; i < forecast.list.length; i += 8) {
        console.log(forecast.list[i]); // Log daily forecast data

        // Create a container for the daily forecast
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        // Create a paragraph for the date
        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = new Date(forecast.list[i].dt * 1000).toDateString(undefined, 'Asia/Kolkata');
        div.appendChild(day);

        // Create a paragraph for the temperature
        let temp = document.createElement('p');
        temp.innerText = Math.floor((forecast.list[i].main.temp_max - 273)) + ' °C' + ' / ' + Math.floor((forecast.list[i].main.temp_min - 273)) + ' °C';
        div.appendChild(temp);

        // Create a paragraph for the weather description
        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = forecast.list[i].weather[0].description;
        div.appendChild(description);

        // Append the container to the daily forecast section
        document.querySelector('.weekF').appendChild(div);
    }
}