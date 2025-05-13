
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import ReturnsChart from "@/components/ReturnsChart";
import { getInvestmentById, getPackageById } from "@/lib/data-service";
import { Investment } from "@/types";

export default function InvestmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      const inv = getInvestmentById(id);
      if (inv) {
        setInvestment(inv);
      }
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-2xl">Loading...</div>
        </div>
      </Layout>
    );
  }
  
  if (!investment) {
    return (
      <Layout>
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold">Investment Not Found</h1>
          <p className="text-muted-foreground">The investment you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/investments')}>
            Back to Investments
          </Button>
        </div>
      </Layout>
    );
  }
  
  const pkg = getPackageById(investment.packageId);
  const startDate = new Date(investment.startDate);
  const endDate = new Date(investment.endDate);
  const today = new Date();
  
  // Calculate days elapsed and total days
  const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
  const daysElapsed = Math.min(
    totalDays,
    Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24)))
  );
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const progress = (daysElapsed / totalDays) * 100;
  
  // Format dates
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{pkg?.name || "Investment"}</h1>
              <Badge 
                className={investment.status === 'active' 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
                }
              >
                {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Started on {formatDate(startDate)}
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/investments')}
          >
            Back to Investments
          </Button>
        </div>
        
        {/* Investment Summary */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Investment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Amount Invested</p>
                  <p className="text-lg font-semibold">Kes{investment.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                  <p className="text-lg font-semibold text-finance-green">
                    +Kes{investment.totalReturn.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Return Rate</p>
                  <p className="text-lg font-semibold">
                    {pkg?.dailyReturnRange.min}% - {pkg?.dailyReturnRange.max}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{totalDays} days</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="mt-2 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span>{daysElapsed} days elapsed</span>
                    <span>{daysRemaining} days remaining</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm">Start Date</p>
                  <p className="text-sm font-medium">{formatDate(startDate)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">End Date</p>
                  <p className="text-sm font-medium">{formatDate(endDate)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Return Rate</p>
                  <p className="text-sm font-medium text-finance-green">
                    +{((investment.totalReturn / investment.amount) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Returns History</CardTitle>
              <CardDescription>
                Daily returns for your investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReturnsChart dailyReturns={investment.dailyReturns} />
            </CardContent>
          </Card>
        </div>
        
        {/* Returns Table */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Returns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-right">Return Rate</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {investment.dailyReturns
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-3 px-4 text-right text-finance-green">
                          +{item.percentage.toFixed(2)}%
                        </td>
                        <td className="py-3 px-4 text-right font-medium">
                          +${item.amount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
