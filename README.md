# 🌍 Travel Planner Pro

Plataforma Inteligente de Planificación de Viajes desarrollada como Proyecto Final para la asignatura de Diseño Web. Esta aplicación centraliza información vital para viajeros utilizando tecnologías web nativas y consumo de APIs concurrentes.

## 🚀 Tecnologías Utilizadas (Stack Nativo)
- **HTML5 Semántico:** Estructuración accesible.
- **CSS3:** Diseño 100% Responsive con CSS Grid y Flexbox (Sin frameworks).
- **Vanilla JavaScript (ES6+):** Lógica de negocio y manipulación del DOM.
- **Fetch API & Async/Await:** Orquestación asíncrona de peticiones HTTP.
- **LocalStorage:** Persistencia de estado en el cliente (Historial, Favoritos, Tema, Usuario).

## 🔌 APIs Integradas
1. **REST Countries API:** Información demográfica y geográfica.
2. **Open-Meteo API:** Datos climáticos en tiempo real por coordenadas.
3. **Frankfurter API:** Conversión de divisas (USD, EUR, GBP, COP).
4. **Open TripMap API:** Lugares turísticos destacados por radio geográfico.

## 📂 Arquitectura del Proyecto
El proyecto sigue un patrón modular estricto (Single Responsibility Principle):
```text
/
├── index.html          # Estructura principal y UI
├── css/
│   └── styles.css      # Variables de tema y diseño responsive
└── js/
    ├── app.js          # Orquestador principal y delegación de eventos
    ├── storage.js      # Motor de persistencia (LocalStorage)
    ├── countries.js    # Servicio API REST Countries
    ├── weather.js      # Servicio API Open-Meteo
    ├── currency.js     # Servicio API Frankfurter
    └── tourism.js      # Servicio API OpenTripMap
