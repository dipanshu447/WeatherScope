export default async function handler(req, res) {
    const { city, lat, lon } = req.query;
    const apiKey = process.env.WEATHER_API_KEY;

    let apiURL = '';
    if (lat && long) {
        apiURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    } else if (city) {
        apiURL = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric&q=${city}`
    } else {
        return res.status(400).json({ error: 'Please Enter a valid location or enable location services.' });
    }

    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        if (response.ok) {
            res.status(200).json(data);
        } else {
            res.status(response.status).json({ error: data.message || "Failed to fetch weather data." });
        }
    } catch (err) {
        res.status(500).json({ error: "Internal server error." });
    }
}