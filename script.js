var searchBar = document.querySelector('.searchbar input');
var searchButton = document.querySelector('.searchbar img:nth-of-type(2)');
var recentSearch = document.querySelector('#recent-search');

window.onload = displayRecentSearches;

async function getWeatherData(city) {
    const url = `http://api.openweathermap.org/data/2.5/weather?appid=fdc55ecc7901d54bf227ce26bde77c52&units=metric&q=${city}`;
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log('Temprature : '+ Math.round(data.main.temp));
        console.log("Description : "+ data.weather[0].main);
        console.log("Humidity : "+ data.main.humidity);
        console.log("Wind Speed : "+ (data.wind.speed * 3.6).toFixed(2));
        console.log("Icon : "+ data.weather[0].icon);
        storeSearch(city);
        displayRecentSearches();
        updateWeatherData(data);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

var updateWeatherData = async (data) =>  {
    document.querySelector('.status h1').innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
    document.querySelector('.status p').innerText = data.weather[0].main;
    document.querySelector('.humidity h3').innerHTML = `${data.main.humidity}%`;
    document.querySelector('.windSpeed h3').innerHTML = `${(data.wind.speed * 3.6).toFixed(2)}Km/h`;
    document.querySelector('.img-status img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelector('.container').classList.add('visible');
    document.querySelectorAll('.disnone').forEach(e => e.classList.remove('disnone'));
}

function searchWeather(){
    if(searchBar.value.length >= 2){
        getWeatherData(searchBar.value);
    }
}

searchBar.addEventListener('keydown', (e) => {
    if(e.key == 'Enter'){
        searchWeather();
    }
})

searchButton.addEventListener('click',() => {
    if(searchBar.value.length >= 2){
        searchWeather();
    }
})

function displayRecentSearches() {
    let searches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    let imgsrc;
    if(searches.length === 0){
        searches = ['Mumbai','Banglore','New york','Spain'];
        imgsrc = 'https://img.icons8.com/?size=100&id=73828&format=png&color=9C9C9C';
    }else {
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

    if(!searches.includes(city)){
        if(searches.length >= 4){
            recentSearch.removeChild(btns.pop());
            searches.pop();
        }
        searches.unshift(city);
    }

    localStorage.setItem('recentSearches',JSON.stringify(searches));
}