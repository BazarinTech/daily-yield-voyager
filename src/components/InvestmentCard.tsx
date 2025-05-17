
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Investment } from "@/types";
import { getPackageById } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";
import useFormat from "@/hooks/useFormat";

interface InvestmentCardProps {
  investment: InvestmentOrder;
  onViewDetails: (investmentId: number) => void;
}

export default function InvestmentCard({ investment, onViewDetails }: InvestmentCardProps) {
  const today = new Date();
  
  // Calculate days elapsed and total days

  const progress = Math.min(100, Math.max(0, ((investment.duration - investment.remaining) / investment.duration) * 100));
  
  // Calculate return rate
  const returnRate = investment.amount > 0 
    ? ((investment.total_returns / investment.amount) * 100).toFixed(2) 
    : "0.00";

  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle>{investment.product_name || "Investment Package"}</CardTitle>
            <CardDescription>
              Started on {investment.investment_date}
            </CardDescription>
          </div>
          <Badge 
            className={investment.status === 'active' 
              ? "bg-green-100 text-green-800" 
              : "bg-gray-100 text-gray-800"
            }
          >
            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount Invested</p>
            <p className="text-lg font-semibold">Kes {useFormat(investment.amount)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Returns</p>
            <p className="text-lg font-semibold text-finance-green">
              +Kes {useFormat(investment.total_returns)}
            </p>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{investment.investment_date}</span>
            <span></span>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Return Rate</p>
          <p className="text-lg font-semibold text-finance-green">+{investment.return_rate}%</p>
        </div>
      </CardContent>
      <CardFooter>
        <button 
          onClick={() => onViewDetails(investment.ID)}
          className="text-sm text-primary font-medium hover:underline w-full text-center"
        >
          View Details
        </button>
      </CardFooter>
    </Card>
  );
}
