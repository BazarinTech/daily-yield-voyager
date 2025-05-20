
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";

export default function InvestmentDetail() {
  const { id } = useParams<{ id: string }>();
  const { mains } = useAuth()
  const navigate = useNavigate();
  const [investment, setInvestment] = useState<InvestmentOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const getInvestmentById = (id: string) => {
  const selectedPackage = mains.user_investments.find(pkg => pkg.ID == Number(id));
  return selectedPackage;
};

  
  useEffect(() => {
    if(mains){
      if (id) {
        const inv = getInvestmentById(id);
        console.log('Investment:', inv)
        if (inv) {
          setInvestment(inv);
        }
        setLoading(false);
      }
    }
    
  }, [id, mains]);
  
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
  
  const startDate = investment.investment_date;
  const today = new Date();
  
  // Calculate days elapsed and total days
  const progress = Math.min(100, Math.max(0, ((investment.duration - investment.remaining) / investment.duration) * 100));
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{investment.product_name|| "Investment"}</h1>
            </div>
            <p className="text-muted-foreground">
              Started on {startDate}
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
                  <p className="text-lg font-semibold">Kes {useFormat(investment.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Returns</p>
                  <p className="text-lg font-semibold text-finance-green">
                    +Kes {useFormat(investment.total_returns)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Return Rate</p>
                  <p className="text-lg font-semibold">
                    {investment.return_rate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-lg font-semibold">{investment.duration} days</p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground">Progress</p>
                <div className="mt-2 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-xs">
                    <span>{investment.duration - investment.remaining} days elapsed</span>
                    <span>{investment.remaining} days remaining</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-sm">Start Date</p>
                  <p className="text-sm font-medium">{startDate}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-sm">Return Rate</p>
                  <p className="text-sm font-medium text-finance-green">
                    +{((investment.total_returns / investment.amount) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Returns History</CardTitle>
              <CardDescription>
                Daily returns for your investment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReturnsChart dailyReturns={investment.dailyReturns} />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </Layout>
  );
}
