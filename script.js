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
        updateWeatherData(data);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
}

var updateWeatherData = (data) =>  {
    document.querySelector('.status h1').innerHTML = `${Math.round(data.main.temp)}<sup>°C</sup>`;
    document.querySelector('.status p').innerText = data.weather[0].main;
    document.querySelector('.humidity h3').innerHTML = `${data.main.humidity}%`;
    document.querySelector('.windSpeed h3').innerHTML = `${(data.wind.speed * 3.6).toFixed(2)}Km/h`;
    document.querySelector('.img-status img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.querySelectorAll('.disnone').forEach(e => e.classList.remove('disnone'));
    document.querySelector('.container').classList.add('visible');
}
var searchBar = document.querySelector('.searchbar input');
var recentSearch = document.querySelector('.recent-search');
searchBar.addEventListener('click',() => recentSearch.classList.remove('disnone'));

document.addEventListener('click',(e) => {
    console.log(e.target);
    console.log(recentSearch.contains(e.target));
    console.log(searchBar.contains(e.target));
    if(!searchBar.contains(e.target) && !recentSearch.contains(e.target)){
        recentSearch.classList.add('disnone');
    }
});
searchBar.addEventListener('keydown', (e) => {
    if(e.key == 'Enter' && searchBar.value.length >= 2){
        getWeatherData(searchBar.value);
    }
    document.querySelector('.searchbar img:nth-of-type(2)').addEventListener('click',() => {
        if(searchBar.value.length >= 2){
            getWeatherData(searchBar.value);
        }
    })
})