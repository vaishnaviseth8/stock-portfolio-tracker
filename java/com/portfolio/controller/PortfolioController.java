package com.portfolio.controller;

import com.portfolio.model.Portfolio;
import com.portfolio.service.PortfolioService;
import com.portfolio.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/portfolio")
@CrossOrigin(origins = "*")
public class PortfolioController {
    
    @Autowired
    private PortfolioService portfolioService;
    
    @Autowired
    private StockService stockService;
    
    @GetMapping
    public ResponseEntity<List<Portfolio>> getAllHoldings() {
        try {
            List<Portfolio> holdings = portfolioService.getAllHoldings();
            return ResponseEntity.ok(holdings);
        } catch (Exception e) {
            System.err.println("Error fetching portfolio holdings: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping
    public ResponseEntity<?> addHolding(@RequestBody Portfolio holding) {
        try {
            if (!stockService.stockExists(holding.getStockSymbol())) {
                return ResponseEntity.badRequest().body("Stock symbol not found: " + holding.getStockSymbol());
            }
            
            if (holding.getQuantity() == null || holding.getQuantity() <= 0) {
                return ResponseEntity.badRequest().body("Quantity must be greater than 0");
            }
            
            if (holding.getPurchasePrice() == null || holding.getPurchasePrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return ResponseEntity.badRequest().body("Purchase price must be greater than 0");
            }
            
            Portfolio savedHolding = portfolioService.addHolding(holding);
            return ResponseEntity.ok(savedHolding);
            
        } catch (Exception e) {
            System.err.println("Error adding holding: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to add holding: " + e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> removeHolding(@PathVariable Long id) {
        try {
            boolean removed = portfolioService.removeHolding(id);
            if (removed) {
                return ResponseEntity.ok("Holding removed successfully");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            System.err.println("Error removing holding: " + e.getMessage());
            return ResponseEntity.internalServerError().body("Failed to remove holding");
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getPortfolioSummary() {
        try {
            Map<String, Object> summary = portfolioService.getPortfolioSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            System.err.println("Error fetching portfolio summary: " + e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}