// js/countries.js

export const fetchCountryData = async (countryName) => {
    try {
        // Usar CORS proxy para acceder a RESTCountries API desde GitHub Pages
        const corsProxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://restcountries.com/v3.1/name/${countryName}`)}`;
        
        const response = await fetch(corsProxyUrl);
        
        if (!response.ok) {
            throw new Error('Servicio temporalmente no disponible');
        }

        const proxyData = await response.json();
        
        // El proxy devuelve los datos en la propiedad 'contents'
        if (!proxyData.contents) {
            throw new Error('País no encontrado. Verifica el nombre e intenta en inglés.');
        }
        
        const data = JSON.parse(proxyData.contents);
        
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('País no encontrado. Verifica el nombre e intenta en inglés.');
        }
        
        const country = data[0]; // Tomamos la mejor coincidencia (el primer resultado)

        // Extraer moneda e idioma de forma segura (vienen como objetos dinámicos en la API)
        const currencyCode = country.currencies ? Object.keys(country.currencies)[0] : 'N/A';
        const currencyName = country.currencies ? country.currencies[currencyCode].name : 'Desconocida';
        const languages = country.languages ? Object.values(country.languages).join(', ') : 'Desconocido';

        // Retornamos un objeto limpio y estructurado solo con lo que necesitamos
        return {
            name: country.name.common,
            flag: country.flags.svg,
            capital: country.capital ? country.capital[0] : 'N/A',
            population: country.population.toLocaleString('es-ES'), // Formato con separador de miles
            region: country.region,
            subregion: country.subregion,
            currencyCode: currencyCode,
            currencyName: currencyName,
            languages: languages,
            latlng: country.latlng // ¡CRÍTICO PARA LA FASE 4 (Clima)!
        };

    } catch (error) {
        console.error("Error en fetchCountryData:", error);
        throw error; // Propagamos el error para que app.js lo muestre en la UI
    }
};