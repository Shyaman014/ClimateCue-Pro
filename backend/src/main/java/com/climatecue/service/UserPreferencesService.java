package com.climatecue.service;

import com.climatecue.dto.FavoriteCityDto;
import com.climatecue.dto.SearchHistoryDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UserPreferencesService {

    private final List<FavoriteCityDto> favorites = new CopyOnWriteArrayList<>();
    private final List<SearchHistoryDto> searchHistory = new CopyOnWriteArrayList<>();

    public UserPreferencesService() {
        // Add some default popular favorites for demo / portfolio presentation
        favorites.add(new FavoriteCityDto("New York", "US", 40.7128, -74.0060, System.currentTimeMillis()));
        favorites.add(new FavoriteCityDto("London", "GB", 51.5074, -0.1278, System.currentTimeMillis()));
        favorites.add(new FavoriteCityDto("Tokyo", "JP", 35.6762, 139.6503, System.currentTimeMillis()));
        favorites.add(new FavoriteCityDto("Paris", "FR", 48.8566, 2.3522, System.currentTimeMillis()));
    }

    public List<FavoriteCityDto> getFavorites() {
        return new ArrayList<>(favorites);
    }

    public FavoriteCityDto addFavorite(FavoriteCityDto city) {
        // Remove if already exists to update
        favorites.removeIf(f -> f.getCityName().equalsIgnoreCase(city.getCityName()));
        if (city.getAddedAt() == 0) {
            city.setAddedAt(System.currentTimeMillis());
        }
        favorites.add(0, city);
        return city;
    }

    public void removeFavorite(String cityName) {
        favorites.removeIf(f -> f.getCityName().equalsIgnoreCase(cityName));
    }

    public List<SearchHistoryDto> getSearchHistory() {
        return new ArrayList<>(searchHistory);
    }

    public void addSearchHistory(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) return;
        String cleanName = cityName.trim();
        searchHistory.removeIf(s -> s.getCityName().equalsIgnoreCase(cleanName));
        searchHistory.add(0, new SearchHistoryDto(cleanName, System.currentTimeMillis()));
        // Keep only top 15 searches
        if (searchHistory.size() > 15) {
            searchHistory.remove(searchHistory.size() - 1);
        }
    }

    public void clearSearchHistory() {
        searchHistory.clear();
    }
}
