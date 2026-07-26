# 🌐 ClimateCue — Premium 3D Weather Platform & Analytics Dashboard

<div align="center">
  <h3>A Full-Stack, Portfolio-Grade Meteorological Platform</h3>
  <p>Powered by a <strong>Java Spring Boot 3</strong> Backend and an interactive <strong>React 18 + Three.js + Leaflet</strong> Frontend.</p>
</div>

---

## ✨ Executive Summary

**ClimateCue** is a state-of-the-art weather intelligence application designed to bridge robust backend engineering with cutting-edge frontend visual design. Built to production standards, the platform delivers live atmospheric monitoring, 24-hour precision forecasts, 7-day extended outlooks, interactive 3D globe visualization, real-time weather particle simulations, and English-only global radar mapping.

---

## 🏗️ System Architecture

```
                 +---------------------------------------+
                 |       Client Browser (React 18)       |
                 |  Vite 5 • Three.js • Leaflet • Recharts |
                 +-------------------+-------------------+
                                     |
                          REST API (CORS Enabled)
                                     |
                                     v
                 +---------------------------------------+
                 |    Backend Server (Spring Boot 3)     |
                 |   Java 17+ • Spring Web • RestTemplate|
                 +-------------------+-------------------+
                                     |
                      OpenWeatherMap API Integration
                                     |
                                     v
                 +---------------------------------------+
                 |     Global Meteorological Sensors     |
                 |  Current • Hourly • 7-Day • EPA AQI   |
                 +---------------------------------------+
```

---

## 🌟 Core Feature Highlights

### 🎨 Frontend Experience (`/frontend`)
* **Interactive 3D Weather Globe**: Orbit and zoom across a dynamic Three.js globe with atmospheric glow lighting and coordinate marker pins.
* **3D Particle Weather Systems**: Live volumetric particle simulations for falling rain, drifting snowflakes, floating clouds, sunbeams, and starry night skies.
* **English-Only Global Live Radar**: Built with Leaflet using a custom multi-layered tile architecture (CartoDB No-Labels + Esri English Reference) ensuring all world cities and roads are rendered strictly in English.
* **Unified Settings System**: Instant client-side unit conversions (°C/°F, m/s/kmh/mph), 5-language localization (en, es, fr, de, ja), and dark/light/auto themes saved in `localStorage`.
* **Exportable Intelligence**: One-click PDF generation and high-resolution PNG snapshot exporting for weather summaries.
* **WCAG AA Accessibility**: Full keyboard navigation, screen reader ARIA support, offline network detection, and `prefers-reduced-motion` compliance.

### ⚙️ Backend Server (`/backend`)
* **Java 17 & Spring Boot 3**: High-performance RESTful API architecture built with Spring Web and Spring Boot Actuator.
* **OpenWeatherMap Integration**: Seamlessly aggregates real-time current weather, hourly projections, 7-day extended forecasts, and air quality index data.
* **Robust Exception Handling**: Global error interception providing standardized, descriptive JSON error payloads to the frontend.
* **CORS Configuration**: Pre-configured global CORS mapping allowing smooth local development and production deployment across domains.

---

## 🚀 Quick Start Guide

### 1. Launch the Backend Server
Navigate to the root directory or `/backend` and execute the startup script or Maven command:

**Using Windows Batch Script (Root)**:
```cmd
.\start.bat
```

**Using Maven Directly**:
```bash
cd backend
mvn spring-boot:run
```
> The backend server will initialize and bind to `http://localhost:8081`.

---

### 2. Launch the Frontend Application
In a separate terminal window, start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```
> The frontend application will open at `http://localhost:5173` and automatically connect to the Spring Boot server.

---

## 📁 Project Structure

```
ClimateCue/
├── start.bat                  # One-click Windows startup script for backend
├── README.md                  # Root project documentation
├── backend/                   # Java Spring Boot Server
│   ├── pom.xml                # Maven configuration & dependencies
│   └── src/main/java/com/climatecue/
│       ├── controller/        # REST API Controllers (WeatherController)
│       ├── service/           # Business Logic & OWM Aggregation (WeatherService)
│       ├── model/             # DTOs and Data Structures
│       ├── exception/         # Global Exception Handlers
│       └── config/            # Web & CORS Configuration
└── frontend/                  # React 18 + Vite Frontend Application
    ├── package.json           # Node dependencies & build scripts
    ├── vite.config.js         # Vite bundler & server configuration
    └── src/
        ├── components/        # UI Components & 3D/Leaflet Map integrations
        │   ├── 3d/            # Three.js Globe and Particle Systems
        │   └── ...            # Weather Cards, Charts, Radar Map, Modals
        ├── context/           # Global Settings Context (Theme, Units, i18n)
        └── utils/             # Unit Conversion & Formatting Pipeline
```

---

## 🛡️ License & Attribution

* **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, [CARTO](https://carto.com/), and [Esri](https://www.esri.com/).
* **Weather Data**: Powered by [OpenWeatherMap API](https://openweathermap.org/).
* **License**: This project is developed as an open-source portfolio demonstration.
