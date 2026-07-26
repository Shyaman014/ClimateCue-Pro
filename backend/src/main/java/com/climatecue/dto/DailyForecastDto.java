package com.climatecue.dto;

public class DailyForecastDto {
    private String dayName;
    private long timestamp;
    private double tempMax;
    private double tempMin;
    private String condition;
    private String description;
    private String icon;
    private int rainProbability;

    public DailyForecastDto() {}

    public DailyForecastDto(String dayName, long timestamp, double tempMax, double tempMin, String condition, String description, String icon, int rainProbability) {
        this.dayName = dayName;
        this.timestamp = timestamp;
        this.tempMax = tempMax;
        this.tempMin = tempMin;
        this.condition = condition;
        this.description = description;
        this.icon = icon;
        this.rainProbability = rainProbability;
    }

    public String getDayName() { return dayName; }
    public void setDayName(String dayName) { this.dayName = dayName; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public double getTempMax() { return tempMax; }
    public void setTempMax(double tempMax) { this.tempMax = tempMax; }

    public double getTempMin() { return tempMin; }
    public void setTempMin(double tempMin) { this.tempMin = tempMin; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getRainProbability() { return rainProbability; }
    public void setRainProbability(int rainProbability) { this.rainProbability = rainProbability; }
}
