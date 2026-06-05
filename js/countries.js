// js/countries.js

export const fetchCountryData = async (countryName) => {
    try {
        // Petición a la API usando Fetch con Async/Await
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        
        // Manejo estricto de errores HTTP
        if (!response.ok) {
            throw new Error('País no encontrado. Verifica el nombre e intenta en inglés.');
        }

        const data = await response.json();
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