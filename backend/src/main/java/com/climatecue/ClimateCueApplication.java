package com.climatecue;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class ClimateCueApplication {
    public static void main(String[] args) {
        SpringApplication.run(ClimateCueApplication.class, args);
    }
}
