
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import PackageCard from "@/components/PackageCard";
import InvestForm from "@/components/InvestForm";

import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";

export default function Packages() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { mains } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<Product | undefined>();
  const [isInvestFormOpen, setIsInvestFormOpen] = useState(false);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    if (mains) {
      setUserBalance(mains.wallet.balance)
    }
  }, [mains])
  
  const handleInvest = (packageId: string) => {
    const pkg = mains.products.find(p => p.ID === packageId);
    if (pkg) {
      setSelectedPackage(pkg);
      setIsInvestFormOpen(true);
    }
  };
  
  const handleInvestSubmit = (packageId: string, amount: number) => {
    try {
      setUserBalance(mains?.wallet.balance);
      toast({
        title: "Investment successful",
        description: `Your investment of Kes ${useFormat(amount)} has been processed.`,
      });
      setTimeout(() => navigate(`/investments`), 500);
    } catch (error) {
      toast({
        title: "Investment failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">AI Traders Packages</h1>
          <p className="text-muted-foreground mt-2">
            Choose from our range of best AI traders start earning daily returns.
          </p>
        </div>
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
          {mains?.products.map(pkg => (
            <PackageCard
              key={pkg.ID}
              pkg={pkg}
              onInvest={handleInvest}
            />
          ))}
        </div>
      </div>
      
      <InvestForm
        packageData={selectedPackage}
        isOpen={isInvestFormOpen}
        onClose={() => setIsInvestFormOpen(false)}
        onInvest={handleInvestSubmit}
        userBalance={userBalance}
      />
    </Layout>
  );
}
