// js/storage.js

const STORAGE_KEY = 'dataPlanner';

// Estructura de datos por defecto
const defaultData = {
    user: { name: "", email: "", country: "" },
    favorites: { countries: [], attractions: [] },
    history: [],
    theme: "light"
};

// Inicializa el storage si no existe
export const initStorage = () => {
    if (!localStorage.getItem(STORAGE_KEY)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
    }
};

// Obtener todo el estado
export const getStorage = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
};

// Guardar todo el estado
const saveStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// --- Funciones Específicas ---

export const saveUser = (userObj) => {
    const data = getStorage();
    data.user = userObj;
    saveStorage(data);
};

export const getUser = () => {
    return getStorage().user;
};

export const toggleThemeStorage = () => {
    const data = getStorage();
    data.theme = data.theme === 'light' ? 'dark' : 'light';
    saveStorage(data);
    return data.theme;
};

export const getTheme = () => {
    return getStorage().theme;
};

// Obtener estadísticas para el Dashboard (Módulo 11)
export const getDashboardStats = () => {
    const data = getStorage();
    return {
        historyCount: data.history ? data.history.length : 0,
        favCountriesCount: data.favorites && data.favorites.countries ? data.favorites.countries.length : 0,
        favAttractionsCount: data.favorites && data.favorites.attractions ? data.favorites.attractions.length : 0
    };
};

// Añadir consulta al historial (Módulo 9)
export const addToHistory = (countryName) => {
    const data = getStorage();
    
    // Obtener fecha y hora actual en formato local
    const timestamp = new Date().toLocaleString('es-ES');
    
    // Evitar duplicados consecutivos (opcional pero recomendado)
    const lastSearch = data.history[data.history.length - 1];
    if (!lastSearch || lastSearch.country.toLowerCase() !== countryName.toLowerCase()) {
        data.history.push({ country: countryName, date: timestamp });
        saveStorage(data);
    }
};

// --- GESTIÓN DE FAVORITOS (Módulos 7 y 8) ---

export const toggleFavoriteCountry = (countryName) => {
    const data = getStorage();
    const index = data.favorites.countries.indexOf(countryName);
    
    if (index === -1) {
        data.favorites.countries.push(countryName); // Agregar
    } else {
        data.favorites.countries.splice(index, 1); // Quitar
    }
    
    saveStorage(data);
    return index === -1; // Retorna true si se agregó, false si se quitó
};

export const isCountryFavorite = (countryName) => {
    const data = getStorage();
    return data.favorites.countries.includes(countryName);
};

export const toggleFavoriteAttraction = (attractionName) => {
    const data = getStorage();
    const index = data.favorites.attractions.indexOf(attractionName);
    
    if (index === -1) {
        data.favorites.attractions.push(attractionName);
    } else {
        data.favorites.attractions.splice(index, 1);
    }
    
    saveStorage(data);
    return index === -1;
};

export const isAttractionFavorite = (attractionName) => {
    const data = getStorage();
    return data.favorites.attractions.includes(attractionName);
};