package com.portfolio.service;

import com.portfolio.model.Stock;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class StockService {
    private final Map<String, Stock> stocks = new HashMap<>();
    
    public StockService() {
        initializeStocks();
    }
    
    private void initializeStocks() {
        stocks.put("AAPL", new Stock("AAPL", "Apple Inc.", new BigDecimal("175.25"), new BigDecimal("173.50")));
        stocks.put("GOOGL", new Stock("GOOGL", "Alphabet Inc.", new BigDecimal("2890.75"), new BigDecimal("2875.00")));
        stocks.put("MSFT", new Stock("MSFT", "Microsoft Corp.", new BigDecimal("380.45"), new BigDecimal("375.25")));
        stocks.put("TSLA", new Stock("TSLA", "Tesla Inc.", new BigDecimal("245.80"), new BigDecimal("240.30")));
        stocks.put("AMZN", new Stock("AMZN", "Amazon.com Inc.", new BigDecimal("155.90"), new BigDecimal("153.75")));
        stocks.put("NVDA", new Stock("NVDA", "NVIDIA Corp.", new BigDecimal("485.20"), new BigDecimal("478.50")));
        stocks.put("META", new Stock("META", "Meta Platforms Inc.", new BigDecimal("325.65"), new BigDecimal("322.10")));
        stocks.put("NFLX", new Stock("NFLX", "Netflix Inc.", new BigDecimal("445.30"), new BigDecimal("441.85")));
        
        System.out.println("📈 Initialized " + stocks.size() + " stocks for tracking");
    }
    
    public List<Stock> getAllStocks() {
        return new ArrayList<>(stocks.values());
    }
    
    public Stock getStock(String symbol) {
        return stocks.get(symbol.toUpperCase());
    }
    
    public void updateStockPrice(String symbol) {
        Stock stock = stocks.get(symbol);
        if (stock != null) {
            BigDecimal currentPrice = stock.getCurrentPrice();
            double changePercent = (ThreadLocalRandom.current().nextDouble() - 0.5) * 0.06;
            BigDecimal newPrice = currentPrice.multiply(BigDecimal.valueOf(1 + changePercent));
            stock.setCurrentPrice(newPrice.setScale(2, BigDecimal.ROUND_HALF_UP));
        }
    }
    
    public void updateAllStockPrices() {
        stocks.keySet().forEach(this::updateStockPrice);
        System.out.println("🔄 Updated prices for all " + stocks.size() + " stocks");
    }
    
    public boolean stockExists(String symbol) {
        return stocks.containsKey(symbol.toUpperCase());
    }
}