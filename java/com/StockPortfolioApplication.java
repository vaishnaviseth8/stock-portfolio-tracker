package com;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class StockPortfolioApplication {
    public static void main(String[] args) {
        SpringApplication.run(StockPortfolioApplication.class, args);
        System.out.println("🚀 Stock Portfolio Tracker is running!");
        System.out.println("📊 Access the application at: http://localhost:8080");
        System.out.println("💾 H2 Database console: http://localhost:8080/h2-console");
    }
}