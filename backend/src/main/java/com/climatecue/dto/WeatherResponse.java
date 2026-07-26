package com.climatecue.dto;

public class WeatherResponse {
    private String cityName;
    private double temperature;
    private double feelsLike;
    private int humidity;
    private double windSpeed;
    private int windDirection;
    private double windGust;
    private int pressure;
    private int visibility;
    private long sunrise;
    private long sunset;
    private double uvIndex;
    private String condition;
    private String icon;
    
    // Advanced metrics & features
    private double dewPoint;
    private int cloudCover;
    private String moonPhase;
    private long moonRise;
    private long moonSet;
    private int rainProbability;
    private int airQualityIndex;
    private String airQualityCategory;
    private String weatherAlert;
    private double latitude;
    private double longitude;

    // Getters and Setters
    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public double getFeelsLike() { return feelsLike; }
    public void setFeelsLike(double feelsLike) { this.feelsLike = feelsLike; }

    public int getHumidity() { return humidity; }
    public void setHumidity(int humidity) { this.humidity = humidity; }

    public double getWindSpeed() { return windSpeed; }
    public void setWindSpeed(double windSpeed) { this.windSpeed = windSpeed; }

    public int getWindDirection() { return windDirection; }
    public void setWindDirection(int windDirection) { this.windDirection = windDirection; }

    public double getWindGust() { return windGust; }
    public void setWindGust(double windGust) { this.windGust = windGust; }

    public int getPressure() { return pressure; }
    public void setPressure(int pressure) { this.pressure = pressure; }

    public int getVisibility() { return visibility; }
    public void setVisibility(int visibility) { this.visibility = visibility; }

    public long getSunrise() { return sunrise; }
    public void setSunrise(long sunrise) { this.sunrise = sunrise; }

    public long getSunset() { return sunset; }
    public void setSunset(long sunset) { this.sunset = sunset; }

    public double getUvIndex() { return uvIndex; }
    public void setUvIndex(double uvIndex) { this.uvIndex = uvIndex; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public double getDewPoint() { return dewPoint; }
    public void setDewPoint(double dewPoint) { this.dewPoint = dewPoint; }

    public int getCloudCover() { return cloudCover; }
    public void setCloudCover(int cloudCover) { this.cloudCover = cloudCover; }

    public String getMoonPhase() { return moonPhase; }
    public void setMoonPhase(String moonPhase) { this.moonPhase = moonPhase; }

    public long getMoonRise() { return moonRise; }
    public void setMoonRise(long moonRise) { this.moonRise = moonRise; }

    public long getMoonSet() { return moonSet; }
    public void setMoonSet(long moonSet) { this.moonSet = moonSet; }

    public int getRainProbability() { return rainProbability; }
    public void setRainProbability(int rainProbability) { this.rainProbability = rainProbability; }

    public int getAirQualityIndex() { return airQualityIndex; }
    public void setAirQualityIndex(int airQualityIndex) { this.airQualityIndex = airQualityIndex; }

    public String getAirQualityCategory() { return airQualityCategory; }
    public void setAirQualityCategory(String airQualityCategory) { this.airQualityCategory = airQualityCategory; }

    public String getWeatherAlert() { return weatherAlert; }
    public void setWeatherAlert(String weatherAlert) { this.weatherAlert = weatherAlert; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}
