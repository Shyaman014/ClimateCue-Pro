package com.climatecue.controller;

import com.climatecue.dto.*;
import com.climatecue.service.UserPreferencesService;
import com.climatecue.service.WeatherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    private final WeatherService weatherService;
    private final UserPreferencesService userPreferencesService;

    public WeatherController(WeatherService weatherService, UserPreferencesService userPreferencesService) {
        this.weatherService = weatherService;
        this.userPreferencesService = userPreferencesService;
    }

    // --- Legacy / Current Weather Endpoints ---

    @GetMapping
    public ResponseEntity<WeatherResponse> getWeather(@RequestParam String city) {
        WeatherResponse response = weatherService.getWeatherByCity(city);
        userPreferencesService.addSearchHistory(response.getCityName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/coordinates")
    public ResponseEntity<WeatherResponse> getWeatherByCoordinates(@RequestParam double lat, @RequestParam double lon) {
        WeatherResponse response = weatherService.getWeatherByCoordinates(lat, lon);
        userPreferencesService.addSearchHistory(response.getCityName());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/current")
    public ResponseEntity<WeatherResponse> getCurrentWeather(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        if (city != null && !city.trim().isEmpty()) {
            WeatherResponse response = weatherService.getWeatherByCity(city);
            userPreferencesService.addSearchHistory(response.getCityName());
            return ResponseEntity.ok(response);
        } else if (lat != null && lon != null) {
            WeatherResponse response = weatherService.getWeatherByCoordinates(lat, lon);
            userPreferencesService.addSearchHistory(response.getCityName());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().build();
        }
    }

    // --- Hourly Forecast Endpoint ---

    @GetMapping("/hourly")
    public ResponseEntity<List<HourlyForecastDto>> getHourlyForecast(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        double targetLat = lat != null ? lat : 0.0;
        double targetLon = lon != null ? lon : 0.0;

        if (city != null && !city.trim().isEmpty()) {
            WeatherResponse current = weatherService.getWeatherByCity(city);
            targetLat = current.getLatitude();
            targetLon = current.getLongitude();
        }

        List<HourlyForecastDto> hourly = weatherService.getHourlyForecast(targetLat, targetLon);
        return ResponseEntity.ok(hourly);
    }

    // --- 7-Day / Daily Forecast Endpoint ---

    @GetMapping("/forecast")
    public ResponseEntity<List<DailyForecastDto>> getDailyForecast(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        double targetLat = lat != null ? lat : 0.0;
        double targetLon = lon != null ? lon : 0.0;

        if (city != null && !city.trim().isEmpty()) {
            WeatherResponse current = weatherService.getWeatherByCity(city);
            targetLat = current.getLatitude();
            targetLon = current.getLongitude();
        }

        List<DailyForecastDto> daily = weatherService.getDailyForecast(targetLat, targetLon);
        return ResponseEntity.ok(daily);
    }

    // --- Air Quality Endpoint ---

    @GetMapping("/air-quality")
    public ResponseEntity<AirQualityDto> getAirQuality(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lon) {
        double targetLat = lat != null ? lat : 0.0;
        double targetLon = lon != null ? lon : 0.0;

        if (city != null && !city.trim().isEmpty()) {
            WeatherResponse current = weatherService.getWeatherByCity(city);
            targetLat = current.getLatitude();
            targetLon = current.getLongitude();
        }

        AirQualityDto aqi = weatherService.getAirQuality(targetLat, targetLon);
        return ResponseEntity.ok(aqi);
    }

    // --- Search History Endpoints ---

    @GetMapping("/history")
    public ResponseEntity<List<SearchHistoryDto>> getSearchHistory() {
        return ResponseEntity.ok(userPreferencesService.getSearchHistory());
    }

    @DeleteMapping("/history")
    public ResponseEntity<Map<String, String>> clearSearchHistory() {
        userPreferencesService.clearSearchHistory();
        return ResponseEntity.ok(Map.of("message", "Search history cleared successfully"));
    }

    // --- Favorites Endpoints ---

    @GetMapping("/favorites")
    public ResponseEntity<List<FavoriteCityDto>> getFavorites() {
        return ResponseEntity.ok(userPreferencesService.getFavorites());
    }

    @PostMapping("/favorites")
    public ResponseEntity<FavoriteCityDto> addFavorite(@RequestBody FavoriteCityDto favoriteCity) {
        FavoriteCityDto saved = userPreferencesService.addFavorite(favoriteCity);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/favorites")
    public ResponseEntity<Map<String, String>> removeFavorite(@RequestParam String cityName) {
        userPreferencesService.removeFavorite(cityName);
        return ResponseEntity.ok(Map.of("message", "Favorite city removed successfully"));
    }
}
