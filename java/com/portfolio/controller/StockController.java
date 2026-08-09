package com.portfolio.controller;

import com.portfolio.model.Stock;
import com.portfolio.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "*")
public class StockController {
    
    @Autowired
    private StockService stockService;
    
    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        try {
            List<Stock> stocks = stockService.getAllStocks();
            return ResponseEntity.ok(stocks);
        } catch (Exception e) {
            System.err.println("Error fetching stocks: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{symbol}")
    public ResponseEntity<Stock> getStock(@PathVariable String symbol) {
        try {
            Stock stock = stockService.getStock(symbol.toUpperCase());
            if (stock != null) {
                return ResponseEntity.ok(stock);
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error fetching stock " + symbol + ": " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @Scheduled(fixedRate = 5000) // Update every 5 seconds
    public void updateStockPrices() {
        try {
            stockService.updateAllStockPrices();
        } catch (Exception e) {
            System.err.println("Error in scheduled stock update: " + e.getMessage());
        }
    }
}