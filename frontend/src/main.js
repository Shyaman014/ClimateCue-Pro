// Fallback for vanilla JS script if it's still being used
const API_BASE = import.meta.env?.VITE_API_URL || 'https://climatecue-pro-production.up.railway.app/api/weather';

const elements = {
  cityInput: document.getElementById('cityInput'),
  searchBtn: document.getElementById('searchBtn'),
  locationBtn: document.getElementById('locationBtn'),
  historyList: document.getElementById('historyList'),
  weatherDisplay: document.getElementById('weatherDisplay'),
  loading: document.getElementById('loading'),
  error: document.getElementById('error')
};

let searchHistory = JSON.parse(localStorage.getItem('climateCueHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
  renderHistory();
  if (searchHistory.length > 0) {
    fetchWeather(searchHistory[0]); // Load last searched
  }
});

elements.searchBtn.addEventListener('click', () => {
  const city = elements.cityInput.value.trim();
  if (city) fetchWeather(city);
});

elements.cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = elements.cityInput.value.trim();
    if (city) fetchWeather(city);
  }
});

elements.locationBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser');
    return;
  }
  
  showLoading();
  navigator.geolocation.getCurrentPosition(
    position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByCoords(latitude, longitude);
    },
    () => {
      showError('Unable to retrieve your location');
    }
  );
});

async function fetchWeather(city) {
  showLoading();
  try {
    const res = await fetch(`${API_BASE}?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error('City not found');
    const data = await res.json();
    renderWeather(data);
    addToHistory(data.cityName);
  } catch (err) {
    showError(err.message);
  }
}

async function fetchWeatherByCoords(lat, lon) {
  showLoading();
  try {
    const res = await fetch(`${API_BASE}/coordinates?lat=${lat}&lon=${lon}`);
    if (!res.ok) throw new Error('Location not found');
    const data = await res.json();
    renderWeather(data);
    addToHistory(data.cityName);
  } catch (err) {
    showError(err.message);
  }
}

function renderWeather(data) {
  elements.loading.style.display = 'none';
  elements.error.style.display = 'none';
  
  const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@4x.png`;
  const timeFormat = new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' });
  
  elements.weatherDisplay.innerHTML = `
    <div class="weather-header">
      <div>
        <h2>${data.cityName}</h2>
        <p class="condition">${data.condition}</p>
      </div>
      <img src="${iconUrl}" alt="${data.condition}" width="100" />
    </div>
    
    <div class="weather-main">
      <div class="temp">${Math.round(data.temperature)}°C</div>
      <div style="color: var(--text-muted)">Feels like ${Math.round(data.feelsLike)}°C</div>
    </div>

    <div class="weather-details">
      <div class="detail-card">
        <span class="detail-label">Humidity</span>
        <span class="detail-value">${data.humidity}%</span>
      </div>
      <div class="detail-card">
        <span class="detail-label">Wind Speed</span>
        <span class="detail-value">${data.windSpeed} m/s</span>
      </div>
      <div class="detail-card">
        <span class="detail-label">UV Index</span>
        <span class="detail-value">${data.uvIndex}</span>
      </div>
      <div class="detail-card">
        <span class="detail-label">Sunrise</span>
        <span class="detail-value">${timeFormat.format(new Date(data.sunrise * 1000))}</span>
      </div>
    </div>
  `;
  elements.weatherDisplay.style.display = 'flex';
}

function showLoading() {
  elements.weatherDisplay.style.display = 'none';
  elements.error.style.display = 'none';
  elements.loading.style.display = 'block';
}

function showError(msg) {
  elements.weatherDisplay.style.display = 'none';
  elements.loading.style.display = 'none';
  elements.error.textContent = msg;
  elements.error.style.display = 'block';
}

function addToHistory(city) {
  searchHistory = searchHistory.filter(item => item.toLowerCase() !== city.toLowerCase());
  searchHistory.unshift(city);
  if (searchHistory.length > 5) searchHistory.pop();
  localStorage.setItem('climateCueHistory', JSON.stringify(searchHistory));
  renderHistory();
}

function deleteFromHistory(city) {
  searchHistory = searchHistory.filter(item => item !== city);
  localStorage.setItem('climateCueHistory', JSON.stringify(searchHistory));
  renderHistory();
}

function renderHistory() {
  elements.historyList.innerHTML = '';
  searchHistory.forEach(city => {
    const li = document.createElement('li');
    li.className = 'history-item';
    
    const span = document.createElement('span');
    span.className = 'history-city';
    span.textContent = city;
    span.onclick = () => fetchWeather(city);
    
    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    delBtn.onclick = (e) => {
      e.stopPropagation();
      deleteFromHistory(city);
    };
    
    li.appendChild(span);
    li.appendChild(delBtn);
    elements.historyList.appendChild(li);
  });
}
