// js/currency.js

// js/currency.js

export const fetchCurrencyData = async (baseCurrency) => {
    if (!baseCurrency || baseCurrency === 'N/A') {
        throw new Error('El país no tiene una moneda oficial válida para conversión.');
    }

    // Monedas objetivo para conversión
    const targetCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];
    
    // Filtramos la moneda base
    let targets = targetCurrencies.filter(c => c !== baseCurrency);
    
    if (targets.length === 0) {
        targets = ['USD', 'EUR', 'GBP'];
    }

    try {
        // Intentar con Open Exchange Rates API
        const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'TravelPlannerPro'
            },
            mode: 'cors'
        });
        
        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        // Validar estructura de respuesta
        if (!data.rates || typeof data.rates !== 'object') {
            throw new Error('Formato de respuesta inválido');
        }
        
        // Filtrar solo las monedas objetivo que queremos mostrar
        const filteredRates = {};
        targets.forEach(target => {
            if (data.rates[target] !== undefined) {
                filteredRates[target] = data.rates[target];
            }
        });
        
        // Si no hay ninguna tasa de las objetivo, devolver todas las disponibles
        if (Object.keys(filteredRates).length === 0) {
            return {
                base: baseCurrency,
                rates: data.rates
            };
        }
        
        return {
            base: baseCurrency,
            rates: filteredRates
        };
        
    } catch (error) {
        console.warn("API de tasas de cambio no disponible, usando datos aproximados:", error.message);
        
        // Fallback: Datos aproximados de tasas de cambio (actualizados a 2024)
        const fallbackRates = {
            'USD': { 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50, 'AUD': 1.53, 'CAD': 1.36, 'CHF': 0.88, 'CNY': 7.24, 'INR': 83.12 },
            'EUR': { 'USD': 1.09, 'GBP': 0.86, 'JPY': 162.50, 'AUD': 1.66, 'CAD': 1.48, 'CHF': 0.96, 'CNY': 7.87, 'INR': 90.30 },
            'GBP': { 'USD': 1.27, 'EUR': 1.16, 'JPY': 189.00, 'AUD': 1.93, 'CAD': 1.72, 'CHF': 1.12, 'CNY': 9.15, 'INR': 105.00 },
            'JPY': { 'USD': 0.0067, 'EUR': 0.0062, 'GBP': 0.0053, 'AUD': 0.010, 'CAD': 0.0091, 'CHF': 0.0059, 'CNY': 0.051, 'INR': 0.556 },
            'AUD': { 'USD': 0.65, 'EUR': 0.60, 'GBP': 0.52, 'JPY': 97.70, 'CAD': 0.89, 'CHF': 0.58, 'CNY': 4.74, 'INR': 54.40 },
            'CAD': { 'USD': 0.74, 'EUR': 0.68, 'GBP': 0.58, 'JPY': 110.00, 'AUD': 1.12, 'CHF': 0.65, 'CNY': 5.32, 'INR': 61.00 },
            'CHF': { 'USD': 1.14, 'EUR': 1.04, 'GBP': 0.89, 'JPY': 170.00, 'AUD': 1.74, 'CAD': 1.54, 'CNY': 8.20, 'INR': 93.50 },
            'CNY': { 'USD': 0.138, 'EUR': 0.127, 'GBP': 0.109, 'JPY': 19.65, 'AUD': 0.211, 'CAD': 0.188, 'CHF': 0.122, 'INR': 11.40 },
            'INR': { 'USD': 0.012, 'EUR': 0.011, 'GBP': 0.0095, 'JPY': 1.80, 'AUD': 0.018, 'CAD': 0.016, 'CHF': 0.0106, 'CNY': 0.088 }
        };
        
        // Si tenemos la moneda base en fallback
        if (fallbackRates[baseCurrency]) {
            const baseRates = fallbackRates[baseCurrency];
            const filteredRates = {};
            
            targets.forEach(target => {
                if (baseRates[target]) {
                    filteredRates[target] = baseRates[target];
                }
            });
            
            return {
                base: baseCurrency,
                rates: filteredRates,
                source: 'Tasas aproximadas (offline)'
            };
        }
        
        // Si no hay nada, lanzar error
        throw new Error(`Tasas de cambio no disponibles para ${baseCurrency}.`);
    }
};