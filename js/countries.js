// js/countries.js

const countriesData = {
    'Brazil': { name: 'Brazil', capital: 'Brasília', flag: 'https://flagcdn.com/br.svg', region: 'Americas', subregion: 'South America', population: 215313498, languages: 'Portuguese', currencyCode: 'BRL', currencyName: 'Brazilian Real', latlng: [-14.2350, -51.9253] },
    'Colombia': { name: 'Colombia', capital: 'Bogotá', flag: 'https://flagcdn.com/co.svg', region: 'Americas', subregion: 'South America', population: 52085168, languages: 'Spanish', currencyCode: 'COP', currencyName: 'Colombian Peso', latlng: [4.5709, -74.2973] },
    'France': { name: 'France', capital: 'Paris', flag: 'https://flagcdn.com/fr.svg', region: 'Europe', subregion: 'Western Europe', population: 67750000, languages: 'French', currencyCode: 'EUR', currencyName: 'Euro', latlng: [46.2276, 2.2137] },
    'Japan': { name: 'Japan', capital: 'Tokyo', flag: 'https://flagcdn.com/jp.svg', region: 'Asia', subregion: 'Eastern Asia', population: 125124989, languages: 'Japanese', currencyCode: 'JPY', currencyName: 'Japanese Yen', latlng: [36.2048, 138.2529] },
    'Spain': { name: 'Spain', capital: 'Madrid', flag: 'https://flagcdn.com/es.svg', region: 'Europe', subregion: 'Southern Europe', population: 47615034, languages: 'Spanish', currencyCode: 'EUR', currencyName: 'Euro', latlng: [40.4637, -3.7492] },
    'USA': { name: 'United States', capital: 'Washington D.C.', flag: 'https://flagcdn.com/us.svg', region: 'Americas', subregion: 'North America', population: 338289857, languages: 'English', currencyCode: 'USD', currencyName: 'United States Dollar', latlng: [37.0902, -95.7129] },
    'Mexico': { name: 'Mexico', capital: 'Mexico City', flag: 'https://flagcdn.com/mx.svg', region: 'Americas', subregion: 'North America', population: 128932753, languages: 'Spanish', currencyCode: 'MXN', currencyName: 'Mexican Peso', latlng: [23.6345, -102.5528] },
    'Canada': { name: 'Canada', capital: 'Ottawa', flag: 'https://flagcdn.com/ca.svg', region: 'Americas', subregion: 'North America', population: 39858480, languages: 'English, French', currencyCode: 'CAD', currencyName: 'Canadian Dollar', latlng: [56.1304, -106.3468] },
    'Germany': { name: 'Germany', capital: 'Berlin', flag: 'https://flagcdn.com/de.svg', region: 'Europe', subregion: 'Central Europe', population: 84536635, languages: 'German', currencyCode: 'EUR', currencyName: 'Euro', latlng: [51.1657, 10.4515] },
    'Italy': { name: 'Italy', capital: 'Rome', flag: 'https://flagcdn.com/it.svg', region: 'Europe', subregion: 'Southern Europe', population: 59110000, languages: 'Italian', currencyCode: 'EUR', currencyName: 'Euro', latlng: [41.8719, 12.5674] },
    'China': { name: 'China', capital: 'Beijing', flag: 'https://flagcdn.com/cn.svg', region: 'Asia', subregion: 'Eastern Asia', population: 1425893465, languages: 'Mandarin Chinese', currencyCode: 'CNY', currencyName: 'Chinese Yuan', latlng: [35.8617, 104.1954] },
    'India': { name: 'India', capital: 'New Delhi', flag: 'https://flagcdn.com/in.svg', region: 'Asia', subregion: 'Southern Asia', population: 1417173173, languages: 'Hindi, English', currencyCode: 'INR', currencyName: 'Indian Rupee', latlng: [20.5937, 78.9629] },
    'Australia': { name: 'Australia', capital: 'Canberra', flag: 'https://flagcdn.com/au.svg', region: 'Oceania', subregion: 'Oceania', population: 26068792, languages: 'English', currencyCode: 'AUD', currencyName: 'Australian Dollar', latlng: [-25.2744, 133.7751] },
    'Argentina': { name: 'Argentina', capital: 'Buenos Aires', flag: 'https://flagcdn.com/ar.svg', region: 'Americas', subregion: 'South America', population: 46648582, languages: 'Spanish', currencyCode: 'ARS', currencyName: 'Argentine Peso', latlng: [-38.4161, -63.6167] },
};

export const fetchCountryData = async (countryName) => {
    try {
        // Buscar en nuestra base de datos local primero (para velocidad y sin CORS)
        const key = Object.keys(countriesData).find(k => k.toLowerCase() === countryName.toLowerCase());
        
        if (key) {
            const country = countriesData[key];
            return {
                name: country.name,
                flag: country.flag,
                capital: country.capital,
                population: country.population.toLocaleString('es-ES'),
                region: country.region,
                subregion: country.subregion,
                currencyCode: country.currencyCode,
                currencyName: country.currencyName,
                languages: country.languages,
                latlng: country.latlng
            };
        }
        
        // Si no está en la base de datos, intentar con RESTCountries usando CORS proxy
        const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://restcountries.com/v3.1/name/${countryName}`)}`;
        const response = await fetch(corsProxyUrl);
        
        if (!response.ok) {
            throw new Error(`País "${countryName}" no encontrado. Intenta con: ${Object.keys(countriesData).slice(0, 5).join(', ')}...`);
        }

        const proxyData = await response.json();
        if (!proxyData.contents) {
            throw new Error(`País "${countryName}" no encontrado. Intenta con: ${Object.keys(countriesData).slice(0, 5).join(', ')}...`);
        }
        
        const data = JSON.parse(proxyData.contents);
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error(`País "${countryName}" no encontrado. Intenta con: ${Object.keys(countriesData).slice(0, 5).join(', ')}...`);
        }
        
        const country = data[0];
        const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : 'N/A';
        const currencyName = country.currencies ? country.currencies[currencyCode].name : 'Desconocida';
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'Desconocido';

        return {
            name: country.name.common,
            flag: country.flags.svg,
            capital: country.capital ? country.capital[0] : 'N/A',
            population: country.population.toLocaleString('es-ES'),
            region: country.region,
            subregion: country.subregion,
            currencyCode: currencyCode,
            currencyName: currencyName,
            languages: languages,
            latlng: country.latlng
        };

    } catch (error) {
        console.error("Error en fetchCountryData:", error);
        throw error;
    }
};