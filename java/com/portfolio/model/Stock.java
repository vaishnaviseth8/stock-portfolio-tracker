package com.portfolio.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
public class Stock {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String symbol;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal currentPrice;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal previousClose;
    
    @Column(precision = 8, scale = 4)
    private BigDecimal changePercent;
    
    @Column
    private LocalDateTime lastUpdated;
    
    // Constructors
    public Stock() {}
    
    public Stock(String symbol, String name, BigDecimal currentPrice, BigDecimal previousClose) {
        this.symbol = symbol;
        this.name = name;
        this.currentPrice = currentPrice;
        this.previousClose = previousClose;
        this.changePercent = calculateChangePercent(currentPrice, previousClose);
        this.lastUpdated = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { 
        this.currentPrice = currentPrice;
        this.changePercent = calculateChangePercent(currentPrice, previousClose);
        this.lastUpdated = LocalDateTime.now();
    }
    
    public BigDecimal getPreviousClose() { return previousClose; }
    public void setPreviousClose(BigDecimal previousClose) { this.previousClose = previousClose; }
    
    public BigDecimal getChangePercent() { return changePercent; }
    public void setChangePercent(BigDecimal changePercent) { this.changePercent = changePercent; }
    
    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
    
    private BigDecimal calculateChangePercent(BigDecimal current, BigDecimal previous) {
        if (previous == null || previous.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return current.subtract(previous)
                     .divide(previous, 4, BigDecimal.ROUND_HALF_UP)
                     .multiply(new BigDecimal("100"));
    }
    
    public BigDecimal getChange() {
        return currentPrice.subtract(previousClose);
    }
}