# 🌐 ClimateCue — Frontend Dashboard & Handcrafted 3D Experience

<div align="center">
  <h3>Next-Generation Weather Intelligence with Apple Weather &amp; Linear Aesthetics</h3>
  <p>Built with <strong>React 18</strong>, <strong>Vite 5</strong>, <strong>CSS 3D Transforms</strong>, and <strong>Leaflet</strong>.</p>
</div>

---

## ✨ Overview

**ClimateCue Frontend** is a portfolio-grade, state-of-the-art web application designed to deliver real-time meteorological insights with unparalleled visual fidelity. Moving beyond generic templates, ClimateCue immerses users in live weather conditions through **handcrafted 3D perspective tilt cards**, **60 FPS GPU-accelerated atmospheric particle simulations**, **English-only global live radar mapping**, and a **clutter-free professional information hierarchy**.

---

## 🚀 Key Features

### 🎨 1. Professional Information Hierarchy & Zero Duplication
* **ONE Premium Hero Weather Card**: Stands prominently at the top of the dashboard, presenting exclusively location telemetry, real-time clock, large 3D floating weather condition badge, primary temperature, condition, feels-like temperature, and action buttons.
* **Clutter-Free Architecture**: Every meteorological data point is displayed **exactly once** across purpose-driven vertical sections:
  * 🌡️ **Hourly Forecast**: 24-hour scrollable timeline with temperature progression.
  * 📅 **7-Day Forecast**: Extended outlook with daily low/high range bars.
  * 📊 **Weather Metrics Grid**: 6 distinct physical metrics (UV Index, Humidity & Dew Point, Wind Speed & Gust, Atmospheric Pressure, Visibility, Cloud Cover).
  * 🫁 **Air Quality Console (`AirQualityCard`)**: Numerical EPA AQI (1-5), category badges, pollutant health advice, and color-coded severity progress bar.
  * 🌅 **Sunrise & Sunset Console (`SolarCycleCard`)**: Daylight arc percentage progress, sunrise/sunset timestamps, and lunar cycle illumination.
  * 📈 **Interactive Analytics (`WeatherCharts`)**: Recharts-powered 24-hour temperature, precipitation, and wind trends.

### 🌌 2. 60 FPS GPU-Accelerated Particle Weather Engine (`AtmosphericBackground`)
* **Lightweight Hardware Compositing**: Replaced heavy CPU 3D wireframe models with pure-CSS hardware-accelerated particle systems (`transform: translate3d(...)`) running at a rock-solid 60 FPS:
  * 🌧️ **Rain & Drizzle**: Diagonal falling water droplet streaks with wind slant.
  * ❄️ **Snow**: Drifting glowing snowflakes with natural lateral sway.
  * ☁️ **Clouds**: Volumetric, multi-layered ambient cloud strips with slow parallax drift.
  * ☀️ **Clear / Sunny**: Warm floating golden sunshine motes that pulse gently.
* **Reduced Motion Compliance**: Automatically detects `prefers-reduced-motion` and includes a built-in one-click toggle in Settings to pause/resume animations instantly.

### 🗺️ 3. English-Only Global Live Radar Map (`Leaflet` & `WeatherMap`)
* **Guaranteed English-Only Labels**: Uses a custom multi-layered tile architecture combining **CartoDB Dark Matter (No-Labels)** with **Esri World Dark Gray Reference** and **Esri Boundaries & Places**. Regardless of the country or city searched (Tokyo, Beijing, Moscow, Riyadh, etc.), all map labels are rendered strictly in English.
* **Interactive Radar Layers**: Switch between live OpenWeatherMap radar overlays:
  * 💧 **Precipitation** Radar
  * ☁️ **Cloud Cover** Radar
  * 🌡️ **Temperature** Heatmap
  * 💨 **Wind Speed** Vectors

### ⚙️ 4. Unified Global Settings & State Persistence (`SettingsContext`)
* **Instant Unit Conversion**: Switch effortlessly between Celsius (°C) and Fahrenheit (°F), as well as Wind Speed units (`m/s`, `km/h`, `mph`) without re-fetching API data.
* **Internationalization (i18n)**: Seamless translation support across **English (`en`)**, **Spanish (`es`)**, **French (`fr`)**, **German (`de`)**, and **Japanese (`ja`)**.
* **Theme Customization**: Frosted obsidian Dark mode, crystal Light mode, and Auto day/night synchronization.
* **Persistent Preferences**: All user customization settings are automatically saved and synced via `localStorage`.

### ♿ 5. WCAG AA Accessibility & Exportable Intelligence
* **Full Screen Reader Support**: Complete ARIA attributes (`role="region"`, `role="alert"`, `aria-live="assertive"`) and keyboard navigation across all interactive elements.
* **Offline Resilience**: Automatic network loss detection that alerts users via a sleek status banner while continuing to serve cached telemetry.
* **One-Click Export Tools**: Generate instant PDF weather reports (`jspdf`) or capture high-resolution screenshot cards (`html2canvas`).

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | High-performance SPA with Lightning-fast HMR |
| **3D & Animations** | CSS 3D Transforms (`perspective`, `scale3d`) | Hardware-accelerated GPU tilt mechanics & particles |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) | Interactive tiled maps with CartoDB English tiles |
| **Data Visualization** | [Recharts](https://recharts.org/) | Responsive SVG charts and forecast trends |
| **Icons & Design** | [Lucide React](https://lucide.dev/) | Crisp, consistent modern vector iconography |
| **Report Generation** | `jspdf` & `html2canvas` | Client-side PDF generation and canvas capturing |
| **HTTP Client** | `axios` | Promise-based HTTP client communicating with Spring Boot |

---

## 📦 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **Backend Server**: Ensure the Java Spring Boot backend server is running on `http://localhost:8081`.

### Installation & Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   The application will launch on `http://localhost:5173`.

4. **Build for Production**:
   To bundle and optimize the application for production deployment:
   ```bash
   npm run build
   ```
   The optimized, code-split production files will be output to the `/dist` directory.

---

## 🔌 Backend API Integration

The frontend expects a REST API backend running on `http://localhost:8081` with the following endpoints:
* `GET /api/weather/current?city={cityName}` — Real-time meteorological data
* `GET /api/weather/hourly?city={cityName}` — 24-hour hourly forecast
* `GET /api/weather/forecast?city={cityName}` — 7-day daily forecast
* `GET /api/weather/air-quality?lat={lat}&lon={lon}` — EPA Air Quality Index (AQI)

---

## 📄 License & Attribution

* **Map Data**: © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors, [CARTO](https://carto.com/), and [Esri](https://www.esri.com/).
* **Weather Data**: Powered by [OpenWeatherMap API](https://openweathermap.org/).
* **License**: This project is developed as an open-source portfolio demonstration.
