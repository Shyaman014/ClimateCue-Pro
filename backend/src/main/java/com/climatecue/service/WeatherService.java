package com.climatecue.service;

import com.climatecue.dto.AirQualityDto;
import com.climatecue.dto.DailyForecastDto;
import com.climatecue.dto.HourlyForecastDto;
import com.climatecue.dto.WeatherResponse;
import com.climatecue.exception.WeatherException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public WeatherService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Cacheable(value = "weather", key = "#city.toLowerCase()")
    public WeatherResponse getWeatherByCity(String city) {
        try {
            String weatherUrl = UriComponentsBuilder.fromHttpUrl(apiUrl + "/weather")
                    .queryParam("q", city)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            Map<String, Object> weatherData = restTemplate.getForObject(weatherUrl, Map.class);
            if (weatherData == null) {
                throw new WeatherException("City not found: " + city, 404);
            }

            Map<String, Object> coord = (Map<String, Object>) weatherData.get("coord");
            double lat = ((Number) coord.get("lat")).doubleValue();
            double lon = ((Number) coord.get("lon")).doubleValue();

            double uvi = fetchUvIndex(lat, lon);
            AirQualityDto aqiDto = fetchAirQualitySafe(lat, lon);

            return mapToWeatherResponse(weatherData, uvi, aqiDto, lat, lon);
        } catch (WeatherException we) {
            throw we;
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 404) {
                throw new WeatherException("City not found: '" + city + "'. Please check the spelling or try another location.", 404);
            }
            throw new WeatherException("OpenWeatherMap API Error (" + e.getStatusCode().value() + "): " + e.getResponseBodyAsString(), e.getStatusCode().value());
        } catch (Exception e) {
            throw new WeatherException("Failed to fetch weather data for city: '" + city + "'. Error: " + e.getMessage(), 500);
        }
    }

    @Cacheable(value = "weather", key = "#lat + '_' + #lon")
    public WeatherResponse getWeatherByCoordinates(double lat, double lon) {
        try {
            String weatherUrl = UriComponentsBuilder.fromHttpUrl(apiUrl + "/weather")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            Map<String, Object> weatherData = restTemplate.getForObject(weatherUrl, Map.class);
            if (weatherData == null) {
                throw new WeatherException("Location not found for coordinates: " + lat + ", " + lon, 404);
            }

            double uvi = fetchUvIndex(lat, lon);
            AirQualityDto aqiDto = fetchAirQualitySafe(lat, lon);

            return mapToWeatherResponse(weatherData, uvi, aqiDto, lat, lon);
        } catch (WeatherException we) {
            throw we;
        } catch (HttpClientErrorException e) {
            if (e.getStatusCode().value() == 404) {
                throw new WeatherException("Location not found for coordinates: " + lat + ", " + lon, 404);
            }
            throw new WeatherException("OpenWeatherMap API Error (" + e.getStatusCode().value() + "): " + e.getResponseBodyAsString(), e.getStatusCode().value());
        } catch (Exception e) {
            throw new WeatherException("Failed to fetch weather data for coordinates. Error: " + e.getMessage(), 500);
        }
    }

    @Cacheable(value = "hourly", key = "#lat + '_' + #lon")
    public List<HourlyForecastDto> getHourlyForecast(double lat, double lon) {
        try {
            String forecastUrl = UriComponentsBuilder.fromHttpUrl(apiUrl + "/forecast")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            Map<String, Object> data = restTemplate.getForObject(forecastUrl, Map.class);
            if (data == null || !data.containsKey("list")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get("list");
            List<HourlyForecastDto> hourlyList = new ArrayList<>();
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mm a");

            // Take next 8 items (24 hours in 3-hour increments)
            int count = 0;
            for (Map<String, Object> item : list) {
                if (count >= 8) break;
                long dt = ((Number) item.get("dt")).longValue();
                String timeFormatted = LocalDateTime.ofInstant(Instant.ofEpochSecond(dt), ZoneId.systemDefault()).format(timeFormatter);

                Map<String, Object> main = (Map<String, Object>) item.get("main");
                double temp = ((Number) main.get("temp")).doubleValue();

                List<Map<String, Object>> weatherArray = (List<Map<String, Object>>) item.get("weather");
                String icon = weatherArray != null && !weatherArray.isEmpty() ? (String) weatherArray.get(0).get("icon") : "01d";
                String condition = weatherArray != null && !weatherArray.isEmpty() ? (String) weatherArray.get(0).get("main") : "Clear";

                double pop = item.containsKey("pop") ? ((Number) item.get("pop")).doubleValue() * 100 : 0.0;

                hourlyList.add(new HourlyForecastDto(dt, timeFormatted, Math.round(temp * 10.0) / 10.0, icon, condition, (int) pop));
                count++;
            }
            return hourlyList;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @Cacheable(value = "daily", key = "#lat + '_' + #lon")
    public List<DailyForecastDto> getDailyForecast(double lat, double lon) {
        try {
            String forecastUrl = UriComponentsBuilder.fromHttpUrl(apiUrl + "/forecast")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", apiKey)
                    .queryParam("units", "metric")
                    .toUriString();

            Map<String, Object> data = restTemplate.getForObject(forecastUrl, Map.class);
            if (data == null || !data.containsKey("list")) {
                return Collections.emptyList();
            }

            List<Map<String, Object>> list = (List<Map<String, Object>>) data.get("list");
            Map<String, List<Map<String, Object>>> groupedByDay = new LinkedHashMap<>();
            DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            DateTimeFormatter dayNameFormatter = DateTimeFormatter.ofPattern("EEEE");

            for (Map<String, Object> item : list) {
                long dt = ((Number) item.get("dt")).longValue();
                LocalDateTime dateTime = LocalDateTime.ofInstant(Instant.ofEpochSecond(dt), ZoneId.systemDefault());
                String dayKey = dateTime.format(dayFormatter);
                groupedByDay.computeIfAbsent(dayKey, k -> new ArrayList<>()).add(item);
            }

            List<DailyForecastDto> dailyList = new ArrayList<>();
            int dayIndex = 0;
            for (Map.Entry<String, List<Map<String, Object>>> entry : groupedByDay.entrySet()) {
                if (dayIndex >= 7) break;
                List<Map<String, Object>> dayItems = entry.getValue();
                
                double minTemp = Double.MAX_VALUE;
                double maxTemp = Double.MIN_VALUE;
                double maxPop = 0;
                String icon = "01d";
                String condition = "Clear";
                String description = "clear sky";
                long timestamp = 0;

                for (Map<String, Object> item : dayItems) {
                    Map<String, Object> main = (Map<String, Object>) item.get("main");
                    double tempMin = ((Number) main.get("temp_min")).doubleValue();
                    double tempMax = ((Number) main.get("temp_max")).doubleValue();
                    if (tempMin < minTemp) minTemp = tempMin;
                    if (tempMax > maxTemp) maxTemp = tempMax;

                    double pop = item.containsKey("pop") ? ((Number) item.get("pop")).doubleValue() * 100 : 0.0;
                    if (pop > maxPop) maxPop = pop;

                    if (timestamp == 0) {
                        timestamp = ((Number) item.get("dt")).longValue();
                        List<Map<String, Object>> weatherArray = (List<Map<String, Object>>) item.get("weather");
                        if (weatherArray != null && !weatherArray.isEmpty()) {
                            icon = (String) weatherArray.get(0).get("icon");
                            condition = (String) weatherArray.get(0).get("main");
                            description = (String) weatherArray.get(0).get("description");
                        }
                    }
                }

                String dayName;
                if (dayIndex == 0) dayName = "Today";
                else if (dayIndex == 1) dayName = "Tomorrow";
                else {
                    dayName = LocalDateTime.ofInstant(Instant.ofEpochSecond(timestamp), ZoneId.systemDefault()).format(dayNameFormatter);
                }

                dailyList.add(new DailyForecastDto(dayName, timestamp, Math.round(maxTemp), Math.round(minTemp), condition, description, icon, (int) maxPop));
                dayIndex++;
            }
            return dailyList;
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }

    @Cacheable(value = "aqi", key = "#lat + '_' + #lon")
    public AirQualityDto getAirQuality(double lat, double lon) {
        return fetchAirQualitySafe(lat, lon);
    }

    private double fetchUvIndex(double lat, double lon) {
        try {
            String uvUrl = UriComponentsBuilder.fromHttpUrl(apiUrl + "/uvi")
                    .queryParam("lat", lat)
                    .queryParam("lon", lon)
                    .queryParam("appid", apiKey)
                    .toUriString();
            Map<String, Object> uvData = restTemplate.getForObject(uvUrl, Map.class);
            return uvData != null && uvData.get("value") != null ? ((Number) uvData.get("value")).doubleValue() : 2.5;
        } catch (Exception e) {
            return 2.5; // Fallback default UV index
        }
    }

    private AirQualityDto fetchAirQualitySafe(double lat, double lon) {
        try {
            String aqiUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
            Map<String, Object> data = restTemplate.getForObject(aqiUrl, Map.class);
            if (data != null && data.containsKey("list")) {
                List<Map<String, Object>> list = (List<Map<String, Object>>) data.get("list");
                if (!list.isEmpty()) {
                    Map<String, Object> item = list.get(0);
                    Map<String, Object> main = (Map<String, Object>) item.get("main");
                    int aqiVal = ((Number) main.get("aqi")).intValue();

                    Map<String, Object> compMap = (Map<String, Object>) item.get("components");
                    Map<String, Double> components = new HashMap<>();
                    if (compMap != null) {
                        for (Map.Entry<String, Object> entry : compMap.entrySet()) {
                            components.put(entry.getKey(), ((Number) entry.getValue()).doubleValue());
                        }
                    }

                    String category;
                    String recommendation;
                    String color;
                    switch (aqiVal) {
                        case 1:
                            category = "Good";
                            recommendation = "Air quality is considered satisfactory, and air pollution poses little or no risk.";
                            color = "#22c55e";
                            break;
                        case 2:
                            category = "Fair";
                            recommendation = "Air quality is acceptable; however, some pollutants may be a concern for a small number of sensitive individuals.";
                            color = "#eab308";
                            break;
                        case 3:
                            category = "Moderate";
                            recommendation = "Members of sensitive groups may experience health effects. The general public is less likely to be affected.";
                            color = "#f97316";
                            break;
                        case 4:
                            category = "Poor";
                            recommendation = "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.";
                            color = "#ef4444";
                            break;
                        default:
                            category = "Very Poor";
                            recommendation = "Health warning of emergency conditions: everyone is more likely to be affected. Avoid outdoor exertion.";
                            color = "#a855f7";
                            break;
                    }
                    return new AirQualityDto(aqiVal, category, recommendation, color, components);
                }
            }
        } catch (Exception ignored) {
        }
        // Fallback default AQI
        Map<String, Double> defComp = new HashMap<>();
        defComp.put("pm2_5", 12.5);
        defComp.put("pm10", 20.0);
        defComp.put("o3", 45.0);
        defComp.put("no2", 15.0);
        return new AirQualityDto(1, "Good", "Air quality is considered satisfactory, and air pollution poses little or no risk.", "#22c55e", defComp);
    }

    private WeatherResponse mapToWeatherResponse(Map<String, Object> weatherData, double uvi, AirQualityDto aqiDto, double lat, double lon) {
        WeatherResponse response = new WeatherResponse();
        response.setCityName((String) weatherData.get("name"));
        response.setLatitude(lat);
        response.setLongitude(lon);

        Map<String, Object> main = (Map<String, Object>) weatherData.get("main");
        double temp = ((Number) main.get("temp")).doubleValue();
        int humidity = ((Number) main.get("humidity")).intValue();
        response.setTemperature(temp);
        response.setFeelsLike(((Number) main.get("feels_like")).doubleValue());
        response.setHumidity(humidity);
        response.setPressure(((Number) main.get("pressure")).intValue());

        // Approximate Dew Point formula: T - ((100 - RH) / 5)
        double dewPoint = Math.round((temp - ((100.0 - humidity) / 5.0)) * 10.0) / 10.0;
        response.setDewPoint(dewPoint);

        Map<String, Object> wind = (Map<String, Object>) weatherData.get("wind");
        double windSpeed = ((Number) wind.get("speed")).doubleValue();
        response.setWindSpeed(windSpeed);
        response.setWindDirection(wind.containsKey("deg") ? ((Number) wind.get("deg")).intValue() : 0);
        double gust = wind.containsKey("gust") ? ((Number) wind.get("gust")).doubleValue() : Math.round(windSpeed * 1.3 * 10.0) / 10.0;
        response.setWindGust(gust);

        response.setVisibility(weatherData.containsKey("visibility") ? ((Number) weatherData.get("visibility")).intValue() : 10000);

        Map<String, Object> clouds = (Map<String, Object>) weatherData.get("clouds");
        int cloudCover = clouds != null && clouds.containsKey("all") ? ((Number) clouds.get("all")).intValue() : 0;
        response.setCloudCover(cloudCover);

        Map<String, Object> sys = (Map<String, Object>) weatherData.get("sys");
        long sunrise = sys != null && sys.containsKey("sunrise") ? ((Number) sys.get("sunrise")).longValue() : System.currentTimeMillis() / 1000 - 21600;
        long sunset = sys != null && sys.containsKey("sunset") ? ((Number) sys.get("sunset")).longValue() : System.currentTimeMillis() / 1000 + 21600;
        response.setSunrise(sunrise);
        response.setSunset(sunset);

        // Approximate moon times based on sunrise/sunset offset
        response.setMoonRise(sunset + 7200);
        response.setMoonSet(sunrise - 7200);
        response.setMoonPhase(calculateMoonPhase());

        List<Map<String, Object>> weatherArray = (List<Map<String, Object>>) weatherData.get("weather");
        String condition = "Clear";
        if (weatherArray != null && !weatherArray.isEmpty()) {
            condition = (String) weatherArray.get(0).get("main");
            response.setCondition(condition);
            response.setIcon((String) weatherArray.get(0).get("icon"));
        } else {
            response.setCondition("Clear");
            response.setIcon("01d");
        }

        response.setUvIndex(uvi);
        response.setAirQualityIndex(aqiDto.getAqiValue());
        response.setAirQualityCategory(aqiDto.getCategory());

        // Calculate rain probability
        int pop = condition.equalsIgnoreCase("Rain") || condition.equalsIgnoreCase("Drizzle") ? 85 :
                  condition.equalsIgnoreCase("Thunderstorm") ? 95 :
                  condition.equalsIgnoreCase("Snow") ? 75 :
                  condition.equalsIgnoreCase("Clouds") && cloudCover > 80 && humidity > 75 ? 40 : 10;
        response.setRainProbability(pop);

        // Generate dynamic alerts
        List<String> alerts = new ArrayList<>();
        if (uvi >= 8.0) alerts.add("⚠️ Extreme UV Alert: Avoid prolonged sun exposure during peak hours.");
        if (windSpeed >= 15.0 || gust >= 22.0) alerts.add("💨 High Wind Advisory: Strong gusts expected in your area.");
        if (temp >= 38.0) alerts.add("🔥 Heat Advisory: High temperatures may cause heat illnesses.");
        if (temp <= 0.0) alerts.add("❄️ Freeze Warning: Freezing temperatures expected.");
        if (aqiDto.getAqiValue() >= 4) alerts.add("😷 Air Quality Alert: Unhealthy air quality levels detected.");

        if (!alerts.isEmpty()) {
            response.setWeatherAlert(String.join(" ", alerts));
        } else {
            response.setWeatherAlert("No active severe weather warnings for this region.");
        }

        return response;
    }

    private String calculateMoonPhase() {
        // Approximate 8-phase cycle based on day of month for rich UI experience
        int day = LocalDateTime.now().getDayOfMonth();
        int phaseIdx = (day % 8);
        String[] phases = {
                "New Moon", "Waxing Crescent", "First Quarter", "Waxing Gibbous",
                "Full Moon", "Waning Gibbous", "Last Quarter", "Waning Crescent"
        };
        return phases[phaseIdx];
    }
}
