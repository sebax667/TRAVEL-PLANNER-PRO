// js/weather.js

// Diccionario para mapear códigos WMO de Open-Meteo a descripciones legibles
const getWeatherDescription = (code) => {
    const weatherCodes = {
        0: 'Cielo despejado ☀️',
        1: 'Mayormente despejado 🌤️', 2: 'Parcialmente nublado ⛅', 3: 'Nublado ☁️',
        45: 'Niebla 🌫️', 48: 'Niebla con escarcha 🌫️',
        51: 'Llovizna ligera 🌧️', 53: 'Llovizna moderada 🌧️', 55: 'Llovizna densa 🌧️',
        61: 'Lluvia leve ☔', 63: 'Lluvia moderada ☔', 65: 'Lluvia fuerte ☔',
        71: 'Nieve ligera ❄️', 73: 'Nieve moderada ❄️', 75: 'Nieve fuerte ❄️',
        95: 'Tormenta eléctrica ⛈️'
    };
    return weatherCodes[code] || 'Clima desconocido 🌍';
};

export const fetchWeatherData = async (lat, lng) => {
    try {
        // Endpoint con los parámetros exactos solicitados
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('No se pudo obtener la información del clima.');
        
        const data = await response.json();
        const current = data.current;

        return {
            temperature: current.temperature_2m,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
            description: getWeatherDescription(current.weather_code)
        };
    } catch (error) {
        console.error("Error en fetchWeatherData:", error);
        throw new Error('Servicio de clima no disponible temporalmente.');
    }
};