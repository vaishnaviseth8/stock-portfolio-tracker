import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Plus, Search } from "lucide-react";
import { PortfolioChart } from "./PortfolioChart";
import { StockCard } from "./StockCard";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  value: number;
}

const SAMPLE_STOCKS: Stock[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 175.43,
    change: 2.34,
    changePercent: 1.35,
    shares: 10,
    value: 1754.30,
  },
  {
    symbol: "GOOGL", 
    name: "Alphabet Inc.",
    price: 138.21,
    change: -1.45,
    changePercent: -1.04,
    shares: 5,
    value: 691.05,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation", 
    price: 378.85,
    change: 4.12,
    changePercent: 1.10,
    shares: 3,
    value: 1136.55,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 248.42,
    change: -5.23,
    changePercent: -2.06,
    shares: 2,
    value: 496.84,
  },
];

export const PortfolioDashboard = () => {
  const [stocks, setStocks] = useState<Stock[]>(SAMPLE_STOCKS);
  const [searchSymbol, setSearchSymbol] = useState("");

  // Calculate portfolio totals
  const totalValue = stocks.reduce((sum, stock) => sum + stock.value, 0);
  const totalChange = stocks.reduce((sum, stock) => sum + (stock.change * stock.shares), 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          const priceChange = (Math.random() - 0.5) * 2; // Random change between -1 and 1
          const newPrice = Math.max(0.01, stock.price + priceChange);
          const change = newPrice - stock.price;
          const changePercent = (change / stock.price) * 100;
          
          return {
            ...stock,
            price: newPrice,
            change: change,
            changePercent: changePercent,
            value: newPrice * stock.shares,
          };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const addStock = () => {
    if (!searchSymbol) return;
    
    // Mock adding a new stock
    const newStock: Stock = {
      symbol: searchSymbol.toUpperCase(),
      name: `${searchSymbol.toUpperCase()} Company`,
      price: Math.random() * 200 + 50,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      shares: 1,
      value: 0,
    };
    newStock.value = newStock.price * newStock.shares;
    
    setStocks([...stocks, newStock]);
    setSearchSymbol("");
  };

  const removeStock = (symbol: string) => {
    setStocks(stocks.filter(stock => stock.symbol !== symbol));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Stock Portfolio Tracker
          </h1>
          <p className="text-muted-foreground text-lg">
            Real-time portfolio monitoring and management
          </p>
        </div>

        {/* Portfolio Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Portfolio Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Daily Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <span className={`text-3xl font-bold ${totalChange >= 0 ? 'text-gain' : 'text-loss'}`}>
                  ${Math.abs(totalChange).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {totalChange >= 0 ? (
                  <TrendingUp className="w-6 h-6 text-gain" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-loss" />
                )}
              </div>
              <Badge 
                variant="secondary" 
                className={`mt-1 ${totalChange >= 0 ? 'bg-success/10 text-gain' : 'bg-destructive/10 text-loss'}`}
              >
                {totalChangePercent >= 0 ? '+' : ''}{totalChangePercent.toFixed(2)}%
              </Badge>
            </CardContent>
          </Card>

          <Card className="shadow-card bg-gradient-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Holdings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stocks.length}</div>
              <p className="text-sm text-muted-foreground mt-1">Active positions</p>
            </CardContent>
          </Card>
        </div>

        {/* Portfolio Chart */}
        <Card className="shadow-elevation">
          <CardHeader>
            <CardTitle>Portfolio Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioChart stocks={stocks} />
          </CardContent>
        </Card>

        {/* Add Stock */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Add Stock to Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Enter stock symbol (e.g., AAPL)"
                value={searchSymbol}
                onChange={(e) => setSearchSymbol(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addStock} className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stock Holdings */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Your Holdings</h2>
          <div className="grid gap-4">
            {stocks.map((stock) => (
              <StockCard 
                key={stock.symbol}
                stock={stock}
                onRemove={() => removeStock(stock.symbol)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
