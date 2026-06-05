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
        // Usar Open Exchange Rates API (gratuita, confiable)
        // API endpoint: https://api.exchangerate-api.com/v4/latest/{currency}
        const url = `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Respuesta no válida: ${response.status}`);
        }

        const data = await response.json();
        
        // Validar estructura de respuesta
        if (!data.rates) {
            throw new Error('Sin tasas en la respuesta');
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
        console.error("Error en fetchCurrencyData:", error);
        throw new Error(`Tasas de cambio no disponibles para ${baseCurrency}.`);
    }
};