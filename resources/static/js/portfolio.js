class PortfolioTracker {
    constructor() {
        this.stocks = [];
        this.portfolio = [];
        this.baseUrl = 'http://localhost:8080/api';
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Portfolio Tracker...');
        await this.loadStocks();
        await this.loadPortfolio();
        this.setupEventListeners();
        this.startRealTimeUpdates();
        console.log('✅ Portfolio Tracker initialized successfully');
    }
    
    async loadStocks() {
        try {
            const response = await fetch(`${this.baseUrl}/stocks`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            this.stocks = await response.json();
            this.populateStockDropdown();
            this.displayStocks();
            console.log('📈 Loaded', this.stocks.length, 'stocks');
        } catch (error) {
            console.error('❌ Error loading stocks:', error);
            this.showError('Failed to load stock data. Please check if the server is running.');
        }
    }
    
    async loadPortfolio() {
        try {
            const response = await fetch(`${this.baseUrl}/portfolio`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            this.portfolio = await response.json();
            this.displayPortfolio();
            this.updateSummary();
            console.log('📋 Loaded', this.portfolio.length, 'portfolio holdings');
        } catch (error) {
            console.error('❌ Error loading portfolio:', error);
        }
    }
    
    populateStockDropdown() {
        const select = document.getElementById('stockSymbol');
        select.innerHTML = '<option value="">Select Stock...</option>';
        
        this.stocks.forEach(stock => {
            const option = document.createElement('option');
            option.value = stock.symbol;
            option.textContent = `${stock.symbol} - ${stock.name}`;
            select.appendChild(option);
        });
    }
    
    displayStocks() {
        const container = document.getElementById('stockList');
        
        if (this.stocks.length === 0) {
            container.innerHTML = '<div class="loading-placeholder">No stock data available</div>';
            return;
        }
        
        container.innerHTML = '';
        
        this.stocks.forEach(stock => {
            const stockElement = this.createStockElement(stock);
            container.appendChild(stockElement);
        });
        
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
    }
    
    createStockElement(stock) {
        const div = document.createElement('div');
        div.className = 'stock-item';
        
        const change = stock.currentPrice - stock.previousClose;
        const changePercent = stock.changePercent || 0;
        const changeClass = change >= 0 ? 'positive' : 'negative';
        const changePrefix = change >= 0 ? '+' : '';
        
        div.innerHTML = `
            <div class="stock-header">
                <div>
                    <div class="stock-symbol">${stock.symbol}</div>
                    <div class="stock-name">${stock.name}</div>
                </div>
                <div class="stock-price">$${stock.currentPrice.toFixed(2)}</div>
            </div>
            <div class="stock-change ${changeClass}">
                ${changePrefix}$${change.toFixed(2)} (${changePrefix}${changePercent.toFixed(2)}%)
            </div>
        `;
        
        return div;
    }
    
    displayPortfolio() {
        const container = document.getElementById('portfolioHoldings');
        
        if (this.portfolio.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>📈 No holdings yet!</p>
                    <p>Add some stocks to get started tracking your portfolio.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = '<div class="holdings-grid"></div>';
        const grid = container.querySelector('.holdings-grid');
        
        this.portfolio.forEach((holding, index) => {
            const stock = this.stocks.find(s => s.symbol === holding.stockSymbol);
            if (stock) {
                const holdingElement = this.createHoldingElement(holding, stock, index);
                grid.appendChild(holdingElement);
            }
        });
    }
    
    createHoldingElement(holding, stock, index) {
        const div = document.createElement('div');
        div.className = 'holding-item';
        
        const currentValue = stock.currentPrice * holding.quantity;
        const purchaseValue = holding.purchasePrice * holding.quantity;
        const gainLoss = currentValue - purchaseValue;
        const gainLossPercent = purchaseValue > 0 ? (gainLoss / purchaseValue) * 100 : 0;
        
        const gainLossClass = gainLoss >= 0 ? 'positive' : 'negative';
        const gainLossPrefix = gainLoss >= 0 ? '+' : '';
        
        div.innerHTML = `
            <div>
                <strong>${holding.stockSymbol}</strong><br>
                <small>${holding.quantity} shares @ $${holding.purchasePrice.toFixed(2)}</small>
            </div>
            <div>
                <strong>$${currentValue.toFixed(2)}</strong><br>
                <small>Current Value</small>
            </div>
            <div>
                <span class="${gainLossClass}">
                    ${gainLossPrefix}$${gainLoss.toFixed(2)}<br>
                    <small>${gainLossPrefix}${gainLossPercent.toFixed(2)}%</small>
                </span>
            </div>
            <button class="remove-btn" onclick="portfolio.removeHolding(${holding.id})">
                Remove
            </button>
        `;
        
        return div;
    }
    
    async updateSummary() {
        try {
            const response = await fetch(`${this.baseUrl}/portfolio/summary`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const summary = await response.json();
            
            document.getElementById('totalValue').textContent = `$${summary.totalValue.toFixed(2)}`;
            document.getElementById('totalCost').textContent = `$${summary.totalCost.toFixed(2)}`;
            
            const gainLossElement = document.getElementById('gainLoss');
            const gainLossPercentElement = document.getElementById('gainLossPercent');
            
            const gainLoss = summary.totalGainLoss;
            const gainLossPercent = summary.totalGainLossPercent;
            
            gainLossElement.textContent = `${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)}`;
            gainLossPercentElement.textContent = `${gainLossPercent >= 0 ? '+' : ''}${gainLossPercent.toFixed(2)}%`;
            
            const gainLossClass = gainLoss >= 0 ? 'positive' : 'negative';
            gainLossElement.className = gainLossClass;
            gainLossPercentElement.className = gainLossClass;
            
        } catch (error) {
            console.error('❌ Error updating summary:', error);
        }
    }
    
    setupEventListeners() {
        const form = document.getElementById('addStockForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.addStock();
        });
        
        // Auto-fill purchase price when stock is selected
        document.getElementById('stockSymbol').addEventListener('change', (e) => {
            const selectedStock = this.stocks.find(s => s.symbol === e.target.value);
            if (selectedStock) {
                document.getElementById('purchasePrice').value = selectedStock.currentPrice.toFixed(2);
            }
        });
    }
    
    async addStock() {
        const symbol = document.getElementById('stockSymbol').value;
        const quantity = parseInt(document.getElementById('quantity').value);
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value);
        
        if (!symbol || !quantity || !purchasePrice) {
            this.showError('Please fill in all fields');
            return;
        }
        
        if (quantity <= 0) {
            this.showError('Quantity must be greater than 0');
            return;
        }
        
        if (purchasePrice <= 0) {
            this.showError('Purchase price must be greater than 0');
            return;
        }
        
        const holding = {
            stockSymbol: symbol,
            quantity: quantity,
            purchasePrice: purchasePrice
        };
        
        try {
            const response = await fetch(`${this.baseUrl}/portfolio`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(holding)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP ${response.status}`);
            }
            
            document.getElementById('addStockForm').reset();
            await this.loadPortfolio();
            this.showSuccess(`Successfully added ${quantity} shares of ${symbol} to your portfolio!`);
            
        } catch (error) {
            console.error('❌ Error adding stock:', error);
            this.showError(`Failed to add stock: ${error.message}`);
        }
    }
    
    async removeHolding(id) {
        if (!confirm('Are you sure you want to remove this holding?')) {
            return;
        }
        
        try {
            const response = await fetch(`${this.baseUrl}/portfolio/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            await this.loadPortfolio();
            this.showSuccess('Holding removed successfully!');
            
        } catch (error) {
            console.error('❌ Error removing holding:', error);
            this.showError('Failed to remove holding');
        }
    }
    
    startRealTimeUpdates() {
        // Update stock prices every 5 seconds
        setInterval(async () => {
            await this.loadStocks();
            if (this.portfolio.length > 0) {
                this.updateSummary();
            }
        }, 5000);
        
        console.log('🔄 Started real-time updates (every 5 seconds)');
    }
    
    showSuccess(message) {
        this.showNotification(message, 'success');
        console.log('✅', message);
    }
    
    showError(message) {
        this.showNotification(message, 'error');
        console.error('❌', message);
    }
    
    showNotification(message, type) {
        // Remove existing notifications
        const existing = document.querySelectorAll('.notification');
        existing.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Fade in
        setTimeout(() => notification.style.opacity = '1', 100);
        
        // Remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }
}

// Initialize the portfolio tracker when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, initializing Portfolio Tracker...');
    window.portfolio = new PortfolioTracker();
});