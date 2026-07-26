# 🌐 ClimateCue — Frontend Dashboard & 3D Experience

<div align="center">
  <h3>Next-Generation Weather Intelligence & Atmospheric Simulation Platform</h3>
  <p>Built with <strong>React 18</strong>, <strong>Vite 5</strong>, <strong>Three.js / React Three Fiber</strong>, and <strong>Leaflet</strong>.</p>
</div>

---

## ✨ Overview

**ClimateCue Frontend** is a portfolio-grade, state-of-the-art web application designed to deliver real-time meteorological insights with unparalleled visual fidelity. Moving beyond static charts, ClimateCue immerses users in live weather conditions through **3D interactive globes**, **volumetric atmospheric particle simulations**, **English-only global live radar mapping**, and **responsive glassmorphic aesthetics**.

---

## 🚀 Key Features

### 🌍 1. Interactive 3D Weather Environment (`@react-three/fiber` & `three.js`)
* **Interactive 3D Globe**: Orbit, zoom, and pan across a dynamically rendered globe featuring atmospheric glow lighting and real-time geographic marker pins.
* **Live Atmospheric Particle Systems**: Custom 3D particle simulations adapted to real-time weather conditions:
  * 🌧️ **Rain**: Realistic falling water droplets with dynamic wind velocities.
  * ❄️ **Snow**: Drifting snowflakes with natural lateral sway.
  * ☁️ **Clouds**: Volumetric cloud formations floating through 3D space.
  * ☀️ **Sun Rays**: Radiant sunbeams for clear daytime conditions.
  * 🌌 **Starfield**: Twinkling night sky simulation for clear evenings.
* **Performance Control**: Includes a dedicated one-click toggle to pause/resume 3D animations for battery saving or accessibility.

### 🗺️ 2. English-Only Global Live Radar Map (`Leaflet`)
* **Guaranteed English-Only Labels**: Uses a custom multi-layered tile architecture combining **CartoDB Dark Matter (No-Labels)** with **Esri World Dark Gray Reference** and **Esri Boundaries & Places**. Regardless of the country or city searched (Tokyo, Beijing, Moscow, Riyadh, etc.), all map labels are rendered strictly in English.
* **Interactive Radar Layers**: Switch between live OpenWeatherMap radar overlays:
  * 💧 **Precipitation** Radar
  * ☁️ **Cloud Cover** Radar
  * 🌡️ **Temperature** Heatmap
  * 💨 **Wind Speed** Vectors

### ⚙️ 3. Unified Global Settings & State Persistence
* **Instant Unit Conversion**: Switch effortlessly between Celsius (°C) and Fahrenheit (°F), as well as Wind Speed units (`m/s`, `km/h`, `mph`) without re-fetching API data.
* **Internationalization (i18n)**: Seamless translation support across **English (`en`)**, **Spanish (`es`)**, **French (`fr`)**, **German (`de`)**, and **Japanese (`ja`)**.
* **Theme Customization**: Frosted obsidian Dark mode, crystal Light mode, and Auto day/night synchronization.
* **Persistent Preferences**: All user customization settings are automatically saved and synced via `localStorage`.

### 🎨 4. Premium Glassmorphic UI & Analytics
* **Dynamic Background Gradients**: Smooth CSS transitions that adapt in real time to the current weather category.
* **Comprehensive Metrics**: Air Quality Index (AQI), UV Index, Dew Point, Humidity, Visibility, Atmospheric Pressure, and Solar/Lunar cycles.
* **Interactive Visualizations**: Recharts-powered 24-hour temperature/precipitation trends and 7-day extended forecasts.
* **Exportable Reports**: Generate and download instant PDF weather summaries or capture high-resolution screenshot cards using `html2canvas` and `jspdf`.

### ♿ 5. Accessibility (WCAG AA) & Resilience
* **Keyboard Navigation & ARIA**: Complete screen reader compliance (`role="region"`, `role="alert"`, `aria-live="assertive"`) and `tabIndex={0}` scrolling containers.
* **Reduced Motion Compliance**: Automatically detects `prefers-reduced-motion` and applies CSS overrides to freeze animations for sensitive users.
* **Offline Resilience**: Features automatic network loss detection that alerts users via a non-intrusive status banner while continuing to display cached data.
* **Code Splitting & Optimization**: Uses `React.lazy()` and `<Suspense>` boundaries for Three.js and charting libraries, delivering sub-second initial load times.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Core Framework** | [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/) | High-performance SPA with Lightning-fast HMR |
| **3D Engine** | [Three.js](https://threejs.org/) & [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) | Hardware-accelerated 3D graphics and particle systems |
| **Mapping Engine** | [Leaflet](https://leafletjs.com/) | Interactive tiled maps with custom glowing HTML markers |
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

## 📄 License

This project is open-source and developed as a production-grade portfolio demonstration.
