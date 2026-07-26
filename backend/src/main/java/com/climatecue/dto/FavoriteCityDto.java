package com.climatecue.dto;

public class FavoriteCityDto {
    private String cityName;
    private String country;
    private double latitude;
    private double longitude;
    private long addedAt;

    public FavoriteCityDto() {}

    public FavoriteCityDto(String cityName, String country, double latitude, double longitude, long addedAt) {
        this.cityName = cityName;
        this.country = country;
        this.latitude = latitude;
        this.longitude = longitude;
        this.addedAt = addedAt;
    }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public long getAddedAt() { return addedAt; }
    public void setAddedAt(long addedAt) { this.addedAt = addedAt; }
}
