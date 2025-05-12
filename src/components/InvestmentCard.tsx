
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Investment } from "@/types";
import { getPackageById } from "@/lib/data-service";
import { Badge } from "@/components/ui/badge";

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails: (investmentId: string) => void;
}

export default function InvestmentCard({ investment, onViewDetails }: InvestmentCardProps) {
  const pkg = getPackageById(investment.packageId);
  const startDate = new Date(investment.startDate);
  const endDate = new Date(investment.endDate);
  const today = new Date();
  
  // Calculate days elapsed and total days
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const progress = Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
  
  // Calculate return rate
  const returnRate = investment.amount > 0 
    ? ((investment.totalReturn / investment.amount) * 100).toFixed(2) 
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
          <div>
            <CardTitle>{pkg?.name || "Investment Package"}</CardTitle>
            <CardDescription>
              Started on {formatDate(startDate)}
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
            <p className="text-lg font-semibold">${investment.amount.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Returns</p>
            <p className="text-lg font-semibold text-finance-green">
              +${investment.totalReturn.toLocaleString()}
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
            <span>{formatDate(startDate)}</span>
            <span>{formatDate(endDate)}</span>
          </div>
        </div>
        
        <div className="pt-2">
          <p className="text-sm text-muted-foreground">Return Rate</p>
          <p className="text-lg font-semibold text-finance-green">+{returnRate}%</p>
        </div>
      </CardContent>
      <CardFooter>
        <button 
          onClick={() => onViewDetails(investment.id)}
          className="text-sm text-primary font-medium hover:underline w-full text-center"
        >
          View Details
        </button>
      </CardFooter>
    </Card>
  );
}
