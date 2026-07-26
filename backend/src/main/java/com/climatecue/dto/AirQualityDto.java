package com.climatecue.dto;

import java.util.Map;

public class AirQualityDto {
    private int aqiValue; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    private String category;
    private String healthRecommendation;
    private String colorIndicator;
    private Map<String, Double> components; // CO, NO, NO2, O3, SO2, PM2.5, PM10, NH3

    public AirQualityDto() {}

    public AirQualityDto(int aqiValue, String category, String healthRecommendation, String colorIndicator, Map<String, Double> components) {
        this.aqiValue = aqiValue;
        this.category = category;
        this.healthRecommendation = healthRecommendation;
        this.colorIndicator = colorIndicator;
        this.components = components;
    }

    public int getAqiValue() { return aqiValue; }
    public void setAqiValue(int aqiValue) { this.aqiValue = aqiValue; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getHealthRecommendation() { return healthRecommendation; }
    public void setHealthRecommendation(String healthRecommendation) { this.healthRecommendation = healthRecommendation; }

    public String getColorIndicator() { return colorIndicator; }
    public void setColorIndicator(String colorIndicator) { this.colorIndicator = colorIndicator; }

    public Map<String, Double> getComponents() { return components; }
    public void setComponents(Map<String, Double> components) { this.components = components; }
}
