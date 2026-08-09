package com.portfolio.service;

import com.portfolio.model.Portfolio;
import com.portfolio.model.Stock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.*;

@Service
public class PortfolioService {
    private final List<Portfolio> portfolioHoldings = new ArrayList<>();
    private Long nextId = 1L;
    
    @Autowired
    private StockService stockService;
    
    public List<Portfolio> getAllHoldings() {
        return new ArrayList<>(portfolioHoldings);
    }
    
    public Portfolio addHolding(Portfolio holding) {
        holding.setId(nextId++);
        portfolioHoldings.add(holding);
        System.out.println("✅ Added holding: " + holding.getStockSymbol() + " - " + holding.getQuantity() + " shares");
        return holding;
    }
    
    public boolean removeHolding(Long id) {
        boolean removed = portfolioHoldings.removeIf(h -> h.getId() != null && h.getId().equals(id));
        if (removed) {
            System.out.println("❌ Removed holding with ID: " + id);
        }
        return removed;
    }
    
    public Map<String, Object> getPortfolioSummary() {
        Map<String, Object> summary = new HashMap<>();
        BigDecimal totalValue = BigDecimal.ZERO;
        BigDecimal totalCost = BigDecimal.ZERO;
        
        for (Portfolio holding : portfolioHoldings) {
            Stock stock = stockService.getStock(holding.getStockSymbol());
            if (stock != null) {
                BigDecimal currentValue = stock.getCurrentPrice().multiply(new BigDecimal(holding.getQuantity()));
                totalValue = totalValue.add(currentValue);
                totalCost = totalCost.add(holding.getTotalPurchaseValue());
            }
        }
        
        BigDecimal totalGainLoss = totalValue.subtract(totalCost);
        BigDecimal totalGainLossPercent = totalCost.compareTo(BigDecimal.ZERO) > 0 
            ? totalGainLoss.divide(totalCost, 4, BigDecimal.ROUND_HALF_UP).multiply(new BigDecimal("100"))
            : BigDecimal.ZERO;
        
        summary.put("totalValue", totalValue);
        summary.put("totalCost", totalCost);
        summary.put("totalGainLoss", totalGainLoss);
        summary.put("totalGainLossPercent", totalGainLossPercent);
        summary.put("holdings", portfolioHoldings.size());
        
        return summary;
    }
}