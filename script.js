var searchBar = document.querySelector('.searchbar input');
var searchButton = document.querySelector('.searchbar img:nth-of-type(2)');
var recentSearch = document.querySelector('#recent-search');
var City;
window.onload = displayRecentSearches;
document.querySelector('.userLocation button').addEventListener('click', () => getUserLocation());

function showError(error) {
    let errorBox = document.createElement('div');
    errorBox.classList = 'error-message';

    let isDark = document.body.classList.contains('text-black');
    let theme = !isDark ? "invert" : '';

    errorBox.innerHTML = `<div class="flex gap-2 item-center justify-center">
            <img class="${theme}" src="https://img.icons8.com/?size=100&id=7JSM2OfYelRz&format=png&color=000000" alt="error-image">
            ${error}
        </div>
        <img class="${theme}" src="https://img.icons8.com/?size=100&id=6483&format=png&color=000000" alt="cross">`;
    document.body.appendChild(errorBox);
    errorBox.querySelectorAll('img')[1].addEventListener('click', () => errorBox.remove());
    setTimeout(() => errorBox.remove(), 7000);
}

function showmessege(message) {
    let errorBox = document.createElement('div');
    errorBox.classList = 'error-message';
    errorBox.setAttribute('id', 'message');

    let isDark = document.body.classList.contains('text-black');
    let theme = !isDark ? "invert" : '';

    errorBox.innerHTML = `<div class="flex gap-2 item-center justify-center">
            <img class="${theme}" src="https://img.icons8.com/?size=100&id=113776&format=png&color=000000" alt="loading-image">
            ${message}
        </div>
        <img class="${theme}" src="https://img.icons8.com/?size=100&id=6483&format=png&color=000000" alt="cross">`;
    document.body.appendChild(errorBox);
    errorBox.querySelectorAll('img')[1].addEventListener('click', () => errorBox.remove());
    setTimeout(() => errorBox.remove(), 7000);
}
let a = 0;
async function getWeatherData(city = null, lat = null, long = null) {
    const apiKey = 'fdc55ecc7901d54bf227ce26bde77c52';
    if (a == 0) {
        setTimeout(() => {
            document.querySelector('.head').remove();
            document.body.setAttribute('id', 'gap-0');
            a++;
        }, 1200)
    }
    let url;
    if (lat && long) {
        // url = `api/weather.js?lat=${lat}&lon=${long}&units=metric`;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
        // url = `api/weather.js?units=metric&city=${city}`;
        url = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&q=${city}`;
    } else {
        showError("Please Enter a valid location or enable location services.");
        return;
    }

    try {
        let response = await fetch(url);
        let data = await response.json();

        if (data.cod !== 200) {
            showError(data.message);
            return;
        }
        console.log('Temprature : ' + Math.round(data.main.temp));
        console.log("Description : " + data.weather[0].main);
        console.log("Humidity : " + data.main.humidity);
        console.log("Wind Speed : " + (data.wind.speed * 3.6).toFixed(2));
        console.log("Icon : " + data.weather[0].icon);
        City = data.name;
        if (city) storeSearch(city)
        else storeSearch(data.name);
        weatherBgchange(data.weather[0].main, Math.round(data.main.temp));
        displayRecentSearches();
        updateWeatherData(data);
        console.log(data);
    } catch (error) {
        showError("Failed to fetch data. Check your internet connection.");
        console.log(error);
    }
}

var updateWeatherData = async (data) => {
    document.querySelector('.status h1').innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
    document.querySelector('.status p').innerText = data.weather[0].description;
    document.querySelector('.humidity h3').innerHTML = `${data.main.humidity}%`;
    document.querySelector('.windSpeed h3').innerHTML = `${(data.wind.speed * 3.6).toFixed(2)}Km/h`;
    document.querySelector('.img-status img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector('.container').classList.add('visible');
    document.querySelectorAll('.disnone').forEach(e => e.classList.remove('disnone'));
}

function searchWeather() {
    if (searchBar.value.length >= 2) {
        getWeatherData(searchBar.value);
    }
}

function getUserLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lat = position.coords.latitude;
            let long = position.coords.longitude;
            console.log(lat, long);
            getWeatherData(null, lat, long);
        },
            (error) => {
                showError("Location access denied. Please enter a city manually.");
                console.log(error);
            }
        )
    } else {
        showError("Geolocation is not supported in this browser.")
    }
}

searchBar.addEventListener('keydown', (e) => {
    if (e.key == 'Enter') {
        searchWeather();
    }
})

searchButton.addEventListener('click', () => {
    if (searchBar.value.length >= 2) {
        searchWeather();
    }
})

function displayRecentSearches() {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    let imgsrc;
    if (searches.length === 0) {
        searches = ['Mumbai', 'Delhi', 'Kolkata', 'Bengaluru'];
        imgsrc = 'https://img.icons8.com/?size=100&id=73828&format=png&color=9C9C9C';
    } else {
        imgsrc = 'https://img.icons8.com/?size=100&id=82767&format=png&color=9C9C9C';
    }

    recentSearch.innerHTML = "";

    searches.forEach((city) => {
        let btn = document.createElement('button');
        let img = document.createElement('img');
        img.src = imgsrc;
        img.alt = 'clock';
        btn.onclick = () => getWeatherData(city);
        btn.appendChild(img);
        btn.append(city);
        recentSearch.appendChild(btn);
    })
}

function storeSearch(city) {
    let btns = Array.from(recentSearch.childNodes);
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];

    if (!searches.includes(city)) {
        if (searches.length >= 4) {
            recentSearch.removeChild(btns.pop());
            searches.pop();
        }
        searches.unshift(city);
    }

    localStorage.setItem('recentSearches', JSON.stringify(searches));
}

function weatherBgchange(status, temp) {
    let backgroundUrl;
    let isDarkbg;

    if (temp <= 0) {
        backgroundUrl = 'url(https://i.pinimg.com/1200x/ab/d3/3e/abd33e0c9c6ca92d42a5532ad5ceff35.jpg)'; // snowy
        isDarkbg = false;
    } else {
        switch (status.toLowerCase()) {
            case 'clear':
                backgroundUrl = 'url(https://i.pinimg.com/1200x/8f/65/63/8f6563a9d339ed641b026cb444d1fe3d.jpg)'; // sunny
                isDarkbg = false;
                break;
            case 'clouds':
                backgroundUrl = 'url(https://i.pinimg.com/1200x/54/17/a3/5417a3d0893e0138d03d8060dc73d1da.jpg)'; // cloudy
                isDarkbg = true;
                break;
            case 'rain':
                backgroundUrl = 'url(https://i.pinimg.com/originals/f0/d1/65/f0d16561ae98574833c1b62433277788.gif)'; // rainy
                isDarkbg = false;
                break;
            case 'snow':
                backgroundUrl = 'url(https://i.pinimg.com/1200x/ab/d3/3e/abd33e0c9c6ca92d42a5532ad5ceff35.jpg)'; // snowy
                isDarkbg = false;
                break;
            case 'haze':
                backgroundUrl = 'url(https://i.pinimg.com/1200x/f1/25/56/f125566a8d917386c638490506bf84fe.jpg)'; // haze
                isDarkbg = true;
                break;
            case 'mist':
            case 'fog':
                backgroundUrl = 'url(https://i.pinimg.com/1200x/b4/90/84/b49084326fea65dfc47d97f115d3d842.jpg)'; // mist
                isDarkbg = false;
                break;
            case 'thunderstorm':
                backgroundUrl = 'url(https://i.pinimg.com/1200x/07/0c/93/070c93d305c338c7619acecd15dd8977.jpg)'; // stormy
                isDarkbg = false;
                break;
            case 'drizzle':
                backgroundUrl = 'url(https://i.pinimg.com/originals/d7/bb/cd/d7bbcd0b7f309f88687c99579eea9310.gif)'; // drizzle
                isDarkbg = false;
                break;
            default:
                backgroundUrl = 'url(https://i.pinimg.com/originals/11/8f/1a/118f1aaea40193b3af9214cc45475f1d.gif)'; // default bg
                isDarkbg = false;
                break;
        }
    }

    if (isDarkbg) {
        document.querySelectorAll('.img').forEach(e => e.classList.remove('invert'));
        document.body.classList.remove('text-white');
        document.body.classList.add('text-black')
    } else {
        document.querySelectorAll('.img').forEach(e => e.classList.add('invert'));
        document.body.classList.remove('text-black');
        document.body.classList.add('text-white');
    }

    document.body.style.transition = "background-image 2s ease-in-out";
    document.body.style.backgroundImage = backgroundUrl;
}

const capture = new Audio('assets/capture-sound.mp3');
let color = ['cadetblue', 'burlywood', 'chocolate', 'coral', 'tomato', 'teal', 'steelblue', 'slateblue', 'sienna', 'seagreen', 'salmon', 'royalblue', 'rebeccapurple'];
let rand = Math.floor(Math.random() * 13);
document.querySelector('.userScreenshot button').addEventListener('click', () => {
    showmessege("Please wait a moment while we generate your weather screenshot...");
    html2canvas(document.querySelector('.container'), {
        useCORS: true,
        allowTaint: true,
        backgroundColor: color[rand]
    }).then((canvas) => {
        const link = document.createElement('a');
        link.download = `${City}-weather-screenshot.png`;
        link.href = canvas.toDataURL();
        link.click();
        capture.play();
        capture.currentTime = 0;
    }).catch((err) => showError(err));
});