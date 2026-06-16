// Módulo para manejar información turística y recomendaciones.

// js/tourism.js

// NOTA: Usamos Wikipedia API (gratuita, sin API Key requerida)
// Busca artículos sobre lugares geográficos cercanos a las coordenadas del país.

export const fetchTourismData = async (lat, lng) => {
    try {
        // Wikipedia Geosearch API: busca artículos cercanos a las coordenadas
        // Sin necesidad de API Key, es completamente gratuita
        const radius = 10000; // 10km de radio
        const url = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gscoord=${lat}|${lng}&gsradius=${radius}&gslimit=10&format=json&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (!data.query?.geosearch || data.query.geosearch.length === 0) {
            throw new Error('No tourism data found from Wikipedia');
        }

        // Tomar solo los primeros 5 resultados y mapear al formato esperado
        return data.query.geosearch.slice(0, 5).map(place => ({
            id: place.pageid,
            name: place.title,
            category: 'landmark',
            // Imagen usando Picsum con el ID del lugar como semilla para una imagen estable
            image: `https://picsum.photos/seed/${place.pageid}/400/300`
        }));

    } catch (error) {
        console.warn("Usando datos de respaldo para turismo debido a:", error.message);
        // Fallback elegante si la API falla
        return [
            { id: '1', name: 'Centro Histórico Principal', category: 'cultural', image: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=400' },
            { id: '2', name: 'Museo Nacional', category: 'museums', image: 'https://images.unsplash.com/photo-1518998053401-878c735c908c?w=400' },
            { id: '3', name: 'Parque Natural Central', category: 'nature', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400' },
            { id: '4', name: 'Monumento Conmemorativo', category: 'monuments', image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=400' },
            { id: '5', name: 'Plaza Mayor', category: 'architecture', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400' }
        ];
    }
};