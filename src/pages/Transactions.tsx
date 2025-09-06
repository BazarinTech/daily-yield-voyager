
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";
import { deposit, withdraw } from "@/lib/actions";

export default function Transactions() {
  const { mains, userID,mainFetcher } = useAuth()
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositAccount, setDepositAccount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isLoading, setLoading] = useState(false)
  const { toast } = useToast();
  
  const handleDeposit = async() => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      toast({
        title: "Invalid amount!",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (!depositAccount || isNaN(Number(depositAccount)) || Number(depositAccount) <= 0) {
      toast({
        title: "Invalid Phone number!",
        description: "Please enter a valid mpesa phone number",
        variant: "destructive"
      });
      return;
    }
    setLoading(true)
    try {
      const results = await deposit({userID, amount: depositAmount, account: depositAccount})
      if (results.status == "Success") {
          toast({
            title: "Stk Successfull!",
            description: results.message,
          });
      }else{
        toast({
            title: "Stk Failed!",
            description: results.message,
            variant: "destructive"
          });
      }
      mainFetcher(userID)
    } catch (error) {
      console.error("Deposit Error:", error)
    }
    
    setDepositAmount("");
    setDepositAccount("")
    setLoading(false)
  };

  const handleWithdraw = async() => {

    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({
        title: "Invalid amount!",
        description: "Please enter a valid amount greater than 0",
        variant: "destructive"
      });
      return;
    }

    if (Number(withdrawAmount) > mains.wallet.balance) {
      toast({
        title: "Insufficient funds!",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true)
     try {
      const results = await withdraw({userID, amount: withdrawAmount, account: mains.user.phone})
      if (results.status == "Success") {
          toast({
            title: "Transaction Successfull!",
            description: results.message,
          });
      }else{
        toast({
            title: "Transaction Failed!",
            description: results.message,
            variant: "destructive"
          });
      }
      mainFetcher(userID)
    } catch (error) {
      console.error("Deposit Error:", error)
    }
    
    setWithdrawAmount("");
    setLoading(false)
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
              <div className="text-2xl font-bold">Kes {useFormat(mains ? mains.wallet.balance : 0)}</div>
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
                    <Label htmlFor="deposit-amount">Amount(kes)</Label>
                    <div className="relative">
                      <Input
                        id="deposit-amount"
                        placeholder="Enter amount"
                        className=""
                        type="number" 
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="payment-method">Payment Phone(Mpesa)</Label>
                    <div className="flex items-center h-10 border rounded-md border-input bg-background">
                      <Input
                        id="deposit-amount"
                        placeholder="Enter mpesa phone"
                        className=""
                        type="tel" 
                        value={depositAccount}
                        onChange={(e) => setDepositAccount(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleDeposit} disabled={isLoading}>
                    <ArrowDown className="mr-2 h-4 w-4" /> {isLoading ? 'Initiating...' : 'Deposit Funds'} 
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
                    Withdraw funds instantly. Ensure to have correct details beacuse all transactions are irreversible
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="withdraw-amount">Amount</Label>
                    <div className="relative">
                      <Input
                        id="withdraw-amount"
                        placeholder="Enter amount"
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">Available: Kes {useFormat(mains ? mains.wallet.balance : 0)}</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bank-account">Mpesa Account (To change, head to your profile)</Label>
                    <div className="flex items-center h-10 px-3 border rounded-md border-input bg-background">
                      <Wallet className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{mains?.user.phone}</span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleWithdraw} disabled={isLoading}>
                    <ArrowUp className="mr-2 h-4 w-4" /> {isLoading ? 'Initiating...' : 'Withdraw Funds'} 
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
              <div className="text-2xl font-bold">Kes {useFormat(mains ? mains.wallet.total_deposits : 0)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Withdrawn
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-finance-green">Kes {useFormat(mains ? mains.wallet.total_withdrawals : 0)}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mains?.transactions.map((tx) => (
                <div key={tx.ID} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                  <div>
                    <div className="font-medium">{tx.type} <span className={` ${tx.status == 'Success' ? 'bg-green-500/30 text-green-800' : 'bg-red-500/30 text-red-800'} px-2 text-sm py-1 rounded font-bold `}>{tx.status}</span></div>
                    <div className="text-sm text-muted-foreground">
                      {tx.time}
                    </div>
                  </div>
                  <div className={`font-medium ${tx.type === 'Deposit' ? 'text-finance-green' : 'text-finance-red'}`}>
                    {tx.type === 'Deposit' ? '+' : '-'}kes { useFormat(tx.amount)}
                  </div>
                </div>
              ))}
              {mains?.transactions.length < 1 && 'No transaction records found'}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
