
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import InvestmentCard from "@/components/InvestmentCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { investments } from "@/lib/data-service";
import { Investment } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

export default function Investments() {
  const navigate = useNavigate();
  const { mains } = useAuth()
  const [activeInvestments, setActiveInvestments] = useState<InvestmentOrder[]>([]);
  const [completedInvestments, setCompletedInvestments] = useState<InvestmentOrder[]>([]);
  
  useEffect(() => {
    if (mains) {
      setActiveInvestments(mains.user_investments.filter(inv => inv.status === 'Active'));
      setCompletedInvestments(mains.user_investments.filter(inv => inv.status === 'Completed'));
    }

  }, [mains]);
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Ai Traders</h1>
          <Button 
            onClick={() => navigate('/packages')}
            className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90"
          >
            Add Traders
          </Button>
        </div>
        
        {/* Active Investments */}
        <div className="space-y-4">
          {activeInvestments.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {activeInvestments.map(investment => (
                <InvestmentCard
                  key={investment.ID}
                  investment={investment}
                  onViewDetails={(id) => navigate(`/investments/${id}`)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6">
                <p className="text-muted-foreground text-center">
                  You don't have any active investments yet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
        
      </div>
    </Layout>
  );
}
