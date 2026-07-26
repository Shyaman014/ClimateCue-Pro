package com.climatecue.dto;

public class SearchHistoryDto {
    private String cityName;
    private long searchedAt;

    public SearchHistoryDto() {}

    public SearchHistoryDto(String cityName, long searchedAt) {
        this.cityName = cityName;
        this.searchedAt = searchedAt;
    }

    public String getCityName() { return cityName; }
    public void setCityName(String cityName) { this.cityName = cityName; }

    public long getSearchedAt() { return searchedAt; }
    public void setSearchedAt(long searchedAt) { this.searchedAt = searchedAt; }
}
