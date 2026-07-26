package com.climatecue.exception;

public class WeatherException extends RuntimeException {
    private final int statusCode;

    public WeatherException(String message) {
        super(message);
        this.statusCode = 400;
    }

    public WeatherException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }
}
