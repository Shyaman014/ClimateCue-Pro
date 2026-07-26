package com.climatecue.dto;

public class HourlyForecastDto {
    private long timestamp;
    private String timeFormatted;
    private double temperature;
    private String icon;
    private String condition;
    private int rainProbability;

    public HourlyForecastDto() {}

    public HourlyForecastDto(long timestamp, String timeFormatted, double temperature, String icon, String condition, int rainProbability) {
        this.timestamp = timestamp;
        this.timeFormatted = timeFormatted;
        this.temperature = temperature;
        this.icon = icon;
        this.condition = condition;
        this.rainProbability = rainProbability;
    }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getTimeFormatted() { return timeFormatted; }
    public void setTimeFormatted(String timeFormatted) { this.timeFormatted = timeFormatted; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public int getRainProbability() { return rainProbability; }
    public void setRainProbability(int rainProbability) { this.rainProbability = rainProbability; }
}
