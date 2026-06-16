// js/app.js
import { initStorage, saveUser, getUser, toggleThemeStorage, getTheme, getDashboardStats, addToHistory, toggleFavoriteCountry, isCountryFavorite, toggleFavoriteAttraction, isAttractionFavorite } from './storage.js';
import { fetchCountryData } from './countries.js';
import { getCountryFromLocalDB } from './api.js';
import { fetchWeatherData } from './weather.js';
import { fetchCurrencyData } from './currency.js';
import { fetchTourismData } from './tourism.js';

// Referencias al DOM
const formRegistration = document.getElementById('registration-form');
const sectionRegistration = document.getElementById('registration-section');
const sectionDashboard = document.getElementById('dashboard-section');
const welcomeMessage = document.getElementById('welcome-message');
const btnThemeToggle = document.getElementById('theme-toggle');

// Nuevas referencias al DOM (Fase 2)
const statHistory = document.getElementById('stat-history');
const statFavCountries = document.getElementById('stat-fav-countries');
const statFavAttractions = document.getElementById('stat-fav-attractions');
const searchForm = document.getElementById('search-form');

// Inicialización de la App
document.addEventListener('DOMContentLoaded', () => {
    initStorage();
    applyTheme(getTheme());
    checkUserStatus();
});

// Lógica de Tema
btnThemeToggle.addEventListener('click', () => {
    const newTheme = toggleThemeStorage();
    applyTheme(newTheme);
});

const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
};

// Lógica de Usuario y Dashboard
const checkUserStatus = () => {
    const user = getUser();
    if (user && user.name !== "") {
        sectionRegistration.classList.add('hidden');
        sectionDashboard.classList.remove('hidden');
        welcomeMessage.textContent = `¡Hola de nuevo, ${user.name.toUpperCase()} de ${user.country.toUpperCase()}!`;
        updateDashboardStats(); // Inyectar estadísticas
    } else {
        sectionRegistration.classList.remove('hidden');
        sectionDashboard.classList.add('hidden');
    }
};

// Actualizar contadores del Dashboard
const updateDashboardStats = () => {
    const stats = getDashboardStats();
    statHistory.textContent = stats.historyCount;
    statFavCountries.textContent = stats.favCountriesCount;
    statFavAttractions.textContent = stats.favAttractionsCount;
};

// Manejo del Formulario de Registro
formRegistration.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('user-name').value.trim();
    const email = document.getElementById('user-email').value.trim();
    const country = document.getElementById('user-country').value.trim();

    if (name && email && country) {
        saveUser({ name, email, country });
        checkUserStatus();
    }
});

// Referencias adicionales al DOM
const loader = document.getElementById('loader');
const resultsSection = document.getElementById('results-section');
const countryInfoContainer = document.getElementById('country-info');

// Manejo del Buscador (Fase 3-5)
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchInput = document.getElementById('search-input').value.trim();
    
    if (!searchInput) return;

    // 1. Preparar UI
    loader.classList.remove('hidden');
    resultsSection.classList.add('hidden');

    const weatherContainer = document.getElementById('weather-info');
    const currencyContainer = document.getElementById('currency-info');
    const tourismContainer = document.getElementById('tourism-info');

    weatherContainer.innerHTML = '<div class="info-card"><div class="spinner"></div><p style="text-align:center">Cargando clima...</p></div>';
    currencyContainer.innerHTML = '<div class="info-card"><div class="spinner"></div><p style="text-align:center">Cargando divisas...</p></div>';
    tourismContainer.innerHTML = '<div class="info-card"><div class="spinner"></div><p style="text-align:center">Buscando atracciones...</p></div>';

    try {
        // 2. Consumir API de país - Primero desde BD local, luego API
        let countryData = getCountryFromLocalDB(searchInput);
        
        if (!countryData) {
            countryData = await fetchCountryData(searchInput);
        }

        // 3. Renderizar País con botón de favorito
        const isFav = isCountryFavorite(countryData.name);
        countryInfoContainer.innerHTML = `
            <div class="card country-card">
                <img src="${countryData.flag}" alt="Bandera de ${countryData.name}" class="country-flag">
                <div class="country-details">
                    <h3>${countryData.name}</h3>
                    <p><strong>Capital:</strong> ${countryData.capital}</p>
                    <p><strong>Población:</strong> ${countryData.population} habitantes</p>
                    <p><strong>Región:</strong> ${countryData.region} (${countryData.subregion})</p>
                    <p><strong>Moneda:</strong> ${countryData.currencyName} (${countryData.currencyCode})</p>
                    <p><strong>Idiomas:</strong> ${countryData.languages}</p>
                    <button class="btn-fav btn-fav-country ${isFav ? 'active' : ''}" data-country="${countryData.name}">
                        ${isFav ? '⭐ Quitar de Favoritos' : '☆ Guardar País'}
                    </button>
                </div>
            </div>
        `;

        // 4. Coordenadas para clima y turismo (con fallback si latlng no está disponible)
        let lat, lng;
        
        if (countryData.latlng && Array.isArray(countryData.latlng) && countryData.latlng.length === 2) {
            [lat, lng] = countryData.latlng;
        } else {
            // Si latlng no está disponible, usar coordenadas por defecto según la región
            const regionCoords = {
                'Africa': [-8.7832, 34.5085],
                'Americas': [-56.1645, -106.3468],
                'Asia': [34.0479, 100.6197],
                'Europe': [54.5260, 15.2551],
                'Oceania': [-22.7359, 140.0188]
            };
            [lat, lng] = regionCoords[countryData.region] || [20, 0]; // Fallback: 20°N, 0°E
        }

        // 5. APIs en paralelo: Clima y Moneda
        Promise.allSettled([
            fetchWeatherData(lat, lng),
            fetchCurrencyData(countryData.currencyCode)
        ]).then(([weatherResult, currencyResult]) => {
            // Renderizar Clima
            if (weatherResult.status === 'fulfilled') {
                const w = weatherResult.value;
                weatherContainer.innerHTML = `
                    <div class="info-card">
                        <h4>🌡️ Clima Actual</h4>
                        <ul>
                            <li><span>Estado:</span> <strong>${w.description}</strong></li>
                            <li><span>Temperatura:</span> <strong>${w.temperature}°C</strong></li>
                            <li><span>Humedad:</span> <strong>${w.humidity}%</strong></li>
                            <li><span>Viento:</span> <strong>${w.windSpeed} km/h</strong></li>
                        </ul>
                    </div>
                `;
            } else {
                weatherContainer.innerHTML = `<div class="info-card error-message">⚠️ ${weatherResult.reason.message}</div>`;
            }

            // Renderizar Moneda
            if (currencyResult.status === 'fulfilled') {
                const c = currencyResult.value;
                let ratesHtml = '';
                
                // Validar que haya rates válidas
                if (c.rates && Object.keys(c.rates).length > 0) {
                    for (const [currency, rate] of Object.entries(c.rates)) {
                        // Asegurar que rate sea un número válido
                        const rateValue = parseFloat(rate).toFixed(4);
                        ratesHtml += `<li><span>1 ${c.base} =</span> <strong>${rateValue} ${currency}</strong></li>`;
                    }
                } else {
                    ratesHtml = `<li><strong>Sin datos de conversión disponibles.</strong></li>`;
                }
                
                currencyContainer.innerHTML = `
                    <div class="info-card">
                        <h4>💰 Conversión de Moneda</h4>
                        <ul>${ratesHtml}</ul>
                    </div>
                `;
            } else {
                // Error en la API
                const errorMsg = currencyResult.reason?.message || 'Error desconocido en tasas de cambio.';
                currencyContainer.innerHTML = `<div class="info-card error-message">⚠️ ${errorMsg}</div>`;
            }
        });

        // 6. Turismo (en secuencia, sin esperar clima/moneda)
        fetchTourismData(lat, lng).then(tourismData => {
            let tourismHtml = '<div class="tourism-section"><h3>📸 Lugares Destacados</h3><div class="tourism-grid">';
            
            tourismData.forEach(place => {
                const isAttrFav = isAttractionFavorite(place.name);
                tourismHtml += `
                    <div class="attraction-card">
                        <img src="${place.image}" alt="${place.name}" class="attraction-img" loading="lazy">
                        <div class="attraction-info">
                            <h5>${place.name}</h5>
                            <p>Categoría: ${place.category}</p>
                            <button class="btn-fav btn-fav-attr ${isAttrFav ? 'active' : ''}" data-attr="${place.name}">
                                ${isAttrFav ? '⭐ Guardado' : '☆ Guardar'}
                            </button>
                        </div>
                    </div>
                `;
            });
            
            tourismHtml += '</div></div>';
            tourismContainer.innerHTML = tourismHtml;
        }).catch(error => {
            tourismContainer.innerHTML = `<div class="info-card error-message">⚠️ ${error.message}</div>`;
        });

        // 7. Guardar en historial
        addToHistory(countryData.name);
        updateDashboardStats();

        // 8. Mostrar resultados
        resultsSection.classList.remove('hidden');

    } catch (error) {
        resultsSection.classList.remove('hidden');
        countryInfoContainer.innerHTML = `<div class="error-message">⚠️ ${error.message}</div>`;
    } finally {
        loader.classList.add('hidden');
    }
});

// Manejo de eventos para botones de favoritos (Delegación)
resultsSection.addEventListener('click', (e) => {
    // Favorito País
    if (e.target.classList.contains('btn-fav-country')) {
        const countryName = e.target.getAttribute('data-country');
        const isNowFav = toggleFavoriteCountry(countryName);
        
        e.target.classList.toggle('active');
        e.target.textContent = isNowFav ? '⭐ Quitar de Favoritos' : '☆ Guardar País';
        updateDashboardStats();
    }
    
    // Favorito Atracción
    if (e.target.classList.contains('btn-fav-attr')) {
        const attrName = e.target.getAttribute('data-attr');
        const isNowFav = toggleFavoriteAttraction(attrName);
        
        e.target.classList.toggle('active');
        e.target.textContent = isNowFav ? '⭐ Guardado' : '☆ Guardar';
        updateDashboardStats();
    }
});