
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { 
  getInvestmentStats,
} from "@/lib/data-service";
import {
  ArrowRight,
  Users,
  BarChart3,
  HelpCircle,
  Calendar,
  Star,
  MessageCircle,
  ArrowUp,
  Wallet,
  ArrowDown,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import Autoplay from "embla-carousel-autoplay"
import TradingViewChart from "@/components/TradingViewChart";
import { useToast } from "@/hooks/use-toast";
import { deposit, withdraw } from "@/lib/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useFormat from "@/hooks/useFormat";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getInvestmentStats());
  const [activeInvestments, setActiveInvestments] = useState<Product[]>([]);
  const { mains, userID,mainFetcher  } = useAuth()
  const [onBoardModal, setOnBoardModal] = useState(false)
  const plugin = useRef(
  Autoplay({ delay: 2000, stopOnInteraction: false })
);
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [depositAccount, setDepositAccount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [isLoading, setLoading] = useState(false)
  const { toast } = useToast();

  // Quick access menu items
  const quickMenuItems = [
    { name: "Group", icon: MessageCircle, path: "https://chat.whatsapp.com/BV85A7KjFKP4hGHDcvTyg6", color: "bg-finance-teal text-white" },
    { name: "Team", icon: Users, path: "/team", color: "bg-finance-blue text-white" },
    { name: "History", icon: BarChart3, path: "/history", color: "bg-finance-accent text-finance-blue" },
    { name: "Support", icon: HelpCircle, path: "https://wa.me/254765472722?text=Hi%20I%20need%20help", color: "bg-muted text-foreground" }
  ];

  // Featured articles/news
  const featuredNews = [
    {
      title: "Market Update: Forex Trends in 2025",
      excerpt: "Latest trends in the forex market and what they mean for investors.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format&fit=crop",
      date: "May 3, 2025"
    },
    {
      title: "New Investment Opportunities",
      excerpt: "Explore the emerging markets and exciting new investment packages.",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=500&auto=format&fit=crop",
      date: "May 1, 2025"
    },
    {
      title: "Investment Strategies for Growth",
      excerpt: "Learn how to optimize your portfolio for maximum returns.",
      image: "https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?q=80&w=500&auto=format&fit=crop",
      date: "April 29, 2025"
    }
  ];
  
  useEffect(() => {
    if (mains) {
      setStats(getInvestmentStats());
      setActiveInvestments(mains.products.filter(inv => inv.status === 'active').slice(0, 3));
    }

  }, [mains]);

  // useEffect(() => {
  //   const isCom = localStorage.getItem('isCom');
  //   if (isCom) {
  //     setOnBoardModal(false)
  //   }else{
  //     setOnBoardModal(true)
  //     localStorage.setItem('isCom', 'true')
  //   }
  // }, [])

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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          {/* <div>
            <h1 className="text-3xl font-bold">Let AI work for you!</h1>
            <p className="text-muted-foreground">Discover new AI legitimate trading methods</p>
          </div> */}
          <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-finance-green to-finance-green hover:opacity-90">
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
                <Button variant="outline" className="bg-red-700 text-white">
                  <ArrowUp className="mr-2 h-4 w-4" /> Withdraw
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Withdraw Funds  (Fee 8%)</DialogTitle>
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
          <Button 
            onClick={() => navigate('/packages')}
            className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90"
          >
            Start Now
          </Button>
        </div>
        
        {/* Hero Carousel */}
        <Card className="overflow-hidden border-none shadow-lg">
          <Carousel plugins={[plugin.current]} className="w-full">
            <CarouselContent>
              {mains?.products.map((pkg) => (
                <CarouselItem key={pkg.ID}>
                  <div className="relative h-64 md:h-80 p-6 flex flex-col justify-between bg-gradient-to-r from-finance-blue to-finance-teal text-white">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10">
                      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-white/10"></div>
                      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/10"></div>
                    </div>
                    
                    <div className="z-10">
                      <h2 className="text-3xl font-bold">{pkg.name}</h2>
                      <p className="text-white/80 mt-2 max-w-md">{pkg.description}</p>
                    </div>
                    
                    <div className="z-10 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="space-y-2 md:space-y-1">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-finance-accent mr-2" />
                          <span className="text-sm">{pkg.returns}% Daily Return</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-finance-accent mr-2" />
                          <span className="text-sm">{pkg.duration} Days Duration</span>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => navigate(`/packages`)}
                        className="mt-4 md:mt-0 bg-white text-finance-blue hover:bg-white/90"
                      >
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </div>
          </Carousel>
        </Card>
        
        {/* Quick Access Menu */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
          <div className="grid grid-cols-4 gap-3">
            {quickMenuItems.map((item) => (
              <Link to={item.path} key={item.name} className="flex flex-col items-center">
                <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center mb-2 transition-transform hover:scale-105`}>
                  <item.icon size={24} />
                </div>
                <span className="text-sm text-center">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
        {/* Trading View Chart */}
        <div style={{ width: "100%", height: "100vh" }}>
          <TradingViewChart />
        </div>
        
        {/* Featured News/Articles */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Latest Updates</h2>
            <Button variant="link" className="text-finance-teal">
              View All
            </Button>
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {featuredNews.map((news, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 overflow-hidden">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">{news.date}</p>
                  <h3 className="font-semibold mt-1">{news.title}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{news.excerpt}</p>
                  <Button variant="link" className="p-0 h-auto text-sm text-finance-teal mt-2">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog onOpenChange={setOnBoardModal} open={onBoardModal}>
          <DialogContent>
            <DialogHeader className="space-y-2">
              <DialogTitle>Become Part of Our Community!</DialogTitle>
              <DialogDescription>
                Join Our whatsapp group to get the latest updates and news. And gain experience in the field of finance.
              </DialogDescription>
            </DialogHeader>
              <div className="grid place-items-center w-full gap-4 py-4">
              <img src="/Community.png" alt="WhatsApp" width="60%" className="rounded" />
            </div>
            <DialogFooter>
              <Button onClick={() => {
                location.replace('https://chat.whatsapp.com/BV85A7KjFKP4hGHDcvTyg6')
              }}>
                 Join
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </Layout>
  );
}
