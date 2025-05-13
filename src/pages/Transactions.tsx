
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUser } from "@/lib/data-service";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Plus, ArrowDown, ArrowUp } from "lucide-react";

export default function Transactions() {
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const { toast } = useToast();
  
  // Mock transactions data
  const transactions = [
    { id: 1, type: "investment", amount: 500, date: "2023-05-01", description: "Invested in Forex Starter" },
    { id: 2, type: "return", amount: 15, date: "2023-05-02", description: "Daily return from Forex Starter" },
    { id: 3, type: "return", amount: 16.25, date: "2023-05-03", description: "Daily return from Forex Starter" },
    { id: 4, type: "investment", amount: 2500, date: "2023-05-10", description: "Invested in Growth Trader" },
    { id: 5, type: "return", amount: 62.5, date: "2023-05-11", description: "Daily return from Growth Trader" },
  ];

  const handleDeposit = () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Deposit successful",
      description: `$${depositAmount} has been added to your account`,
    });
    
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (Number(withdrawAmount) > mockUser.balance) {
      toast({
        title: "Insufficient funds",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Withdrawal initiated",
      description: `$${withdrawAmount} withdrawal is being processed`,
    });
    
    setWithdrawAmount("");
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Transactions</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Card className="flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kes{mockUser.balance.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <div className="flex gap-2 items-center justify-center md:justify-end">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" /> Deposit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Deposit Funds</DialogTitle>
                  <DialogDescription>
                    Add funds to your investment account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="deposit-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="deposit-amount"
                        placeholder="Enter amount"
                        className="pl-8"
                        type="number" 
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">Payment Method</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md border-input bg-background">
                      <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Credit/Debit Card (Default)</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleDeposit}>
                    <ArrowDown className="mr-2 h-4 w-4" /> Deposit Funds
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds</DialogTitle>
                  <DialogDescription>
                    Withdraw funds from your investment account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                      <Input
                        id="withdraw-amount"
                        placeholder="Enter amount"
                        className="pl-8"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Available: ${mockUser.balance.toLocaleString()}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bank-account">Bank Account</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md border-input bg-background">
                      <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Bank Account (Default)</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleWithdraw}>
                    <ArrowUp className="mr-2 h-4 w-4" /> Withdraw Funds
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deposited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Kes{mockUser.totalInvested.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Withdrawn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-finance-green">Kes{mockUser.totalReturns.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{tx.description}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`font-medium ${tx.type === 'return' ? 'text-finance-green' : ''}`}>
                    {tx.type === 'investment' ? '-' : '+'} ${tx.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
