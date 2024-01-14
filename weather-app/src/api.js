import env from "react-dotenv";

const API_KEY = env.WEATHER_API_KEY;

export async function fetchWeather(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('Weather data fetching failed');
    }
    return await response.json();
}

export async function fetchWeatherForecast(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) {
        throw new Error('Weather forecast fetching failed');
    }
    return await response.json();
}