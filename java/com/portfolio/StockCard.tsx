import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, X } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  shares: number;
  value: number;
}

interface StockCardProps {
  stock: Stock;
  onRemove: () => void;
}

export const StockCard = ({ stock, onRemove }: StockCardProps) => {
  const isPositive = stock.change >= 0;

  return (
    <Card className="shadow-card bg-gradient-card hover:shadow-elevation transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-lg font-bold text-foreground">{stock.symbol}</h3>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant="secondary"
                  className={`${isPositive ? 'bg-success/10 text-gain' : 'bg-destructive/10 text-loss'}`}
                >
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </Badge>
                {isPositive ? (
                  <TrendingUp className="w-4 h-4 text-gain" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-loss" />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="text-lg font-semibold">${stock.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Change</p>
                <p className={`text-lg font-semibold ${isPositive ? 'text-gain' : 'text-loss'}`}>
                  {isPositive ? '+' : ''}${stock.change.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Shares</p>
                <p className="text-lg font-semibold">{stock.shares}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Value</p>
                <p className="text-lg font-semibold text-primary">${stock.value.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="ml-4 hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
