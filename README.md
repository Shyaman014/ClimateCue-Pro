# 🌐 ClimateCue — Premium 3D Weather Platform & Analytics Dashboard

<div align="center">
  <h3>A Full-Stack, Handcrafted Meteorological Platform with Apple Weather &amp; Linear Aesthetics</h3>
  <p>Powered by a <strong>Java Spring Boot 3</strong> Backend and a <strong>React 18 + Vite 5 + Leaflet</strong> Frontend.</p>
</div>

---

## ✨ Executive Summary

**ClimateCue** is a state-of-the-art weather intelligence platform designed to bridge robust enterprise Java backend engineering with handcrafted, senior-level frontend visual design. Built to professional standards inspired by Apple Weather, Google Weather, Linear, Stripe, and Vercel, the application delivers live atmospheric telemetry, 24-hour precision forecasts, 7-day extended outlooks, 60 FPS GPU-accelerated weather particle systems, subtle 3D perspective tilt mechanics, and English-only global radar mapping.

---

## 🏗️ System Architecture

```
                 +---------------------------------------+
                 |       Client Browser (React 18)       |
                 | Vite 5 • Leaflet • Recharts • CSS 3D  |
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

### 🎨 Handcrafted Frontend Experience (`/frontend`)
* **ONE Premium Hero Weather Card**: A prominent, minimal hero section featuring location telemetry, real-time clock, large 3D floating weather icon badge with inset lighting, primary temperature, condition, and feels-like temperatures—with zero duplicated metrics.
* **Professional Information Hierarchy**: Clutter-free vertical progression presenting dedicated sections for **Hourly Forecast**, **7-Day Forecast**, **Weather Metrics Grid** (UV Index, Humidity & Dew Point, Wind Speed & Gust, Atmospheric Pressure, Visibility, Cloud Cover), **Air Quality Console** (`AirQualityCard`), and **Sunrise & Sunset Solar Console** (`SolarCycleCard`).
* **60 FPS GPU Particle Weather Engine**: Lightweight, pure-CSS hardware-accelerated background particle simulations (`AtmosphericBackground`) for diagonal falling rain streaks, drifting snow, volumetric clouds, and warm sunshine motes.
* **Apple & Linear 3D Mechanics**: Subtle perspective card tilting (`perspective(1000px)`), dynamic cursor light reflection spotlights, and smooth elevation hover transforms (`.glass-panel-3d`, `.card-elevation-hover`).
* **English-Only Global Live Radar**: Built with Leaflet using a custom multi-layered tile architecture (CartoDB Dark Matter No-Labels + Esri English Reference) guaranteeing all world cities and roads are rendered strictly in English.
* **Unified Settings System**: Instant client-side unit conversions (°C/°F, m/s/kmh/mph), 5-language localization (en, es, fr, de, ja), and dark/light/auto themes saved in `localStorage`.
* **Exportable Intelligence**: One-click PDF generation (`jspdf`) and high-resolution PNG snapshot capturing (`html2canvas`) for weather summaries.
* **WCAG AA Accessibility**: Full keyboard navigation, screen reader ARIA support, offline network detection, and strict `prefers-reduced-motion` compliance.

### ⚙️ Robust Backend Server (`/backend`)
* **Java 17 & Spring Boot 3**: High-performance RESTful API architecture built with Spring Web and Spring Boot Actuator.
* **OpenWeatherMap Aggregation**: Aggregates real-time current weather, hourly projections, 7-day extended forecasts, and air quality index data into unified DTOs.
* **Robust Exception Handling**: Global error interception providing standardized, descriptive JSON error payloads to the frontend.
* **CORS Configuration**: Pre-configured global CORS mapping allowing seamless local development and production deployment.

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

### 3. Build for Production
To bundle and optimize the application for production deployment:

```bash
cd frontend
npm run build
```
> The optimized production bundle will be generated in `/frontend/dist`.

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
└── frontend/                  # React 18 + Vite 5 Frontend Application
    ├── package.json           # Node dependencies & build scripts
    ├── vite.config.js         # Vite bundler & server configuration
    └── src/
        ├── components/        # Handcrafted UI Components & Map integrations
        │   ├── CurrentWeatherCard.jsx # ONE Premium Hero Weather Card
        │   ├── AirQualityCard.jsx     # Dedicated EPA AQI Console
        │   ├── SolarCycleCard.jsx     # Sunrise, Sunset & Lunar Phase Console
        │   ├── AtmosphericBackground.jsx # 60 FPS GPU Particle Weather Engine
        │   ├── AdvancedMetricsGrid.jsx # 6-Metric Physical Weather Grid
        │   ├── WeatherMap.jsx         # CartoDB English-Only Leaflet Radar
        │   ├── WeatherCharts.jsx      # Recharts Trend Analytics
        │   └── ...                    # Modals, Navbar, Favorites, Skeleton loaders
        ├── context/           # Global Settings Context (Theme, Units, i18n)
        └── utils/             # Unit Conversion & Formatting Pipeline
```

---

## 🔌 Backend API Endpoints

The frontend communicates with the Java Spring Boot REST API on `http://localhost:8081`:
* `GET /api/weather/current?city={cityName}` — Real-time meteorological data
* `GET /api/weather/hourly?city={cityName}` — 24-hour hourly forecast
* `GET /api/weather/forecast?city={cityName}` — 7-day daily forecast
* `GET /api/weather/air-quality?lat={lat}&lon={lon}` — EPA Air Quality Index (AQI)

---

## 🛡️ License & Attribution

* **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, [CARTO](https://carto.com/), and [Esri](https://www.esri.com/).
* **Weather Data**: Powered by [OpenWeatherMap API](https://openweathermap.org/).
* **License**: Developed as an open-source, full-stack enterprise portfolio demonstration.
Testing YOLO Achievement
