
import { useEffect, useState } from "react";
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
  mockUser, 
  investments,
  getInvestmentStats,
  packages
} from "@/lib/data-service";
import { Investment } from "@/types";
import {
  ArrowRight,
  Users,
  BarChart3,
  HelpCircle,
  Calendar,
  TrendingUp,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(() => getInvestmentStats());
  const [activeInvestments, setActiveInvestments] = useState<Product[]>([]);
  const { mains } = useAuth()
  
  // Featured investment packages
  const featuredPackages = packages.slice(0, 3);

  // Quick access menu items
  const quickMenuItems = [
    { name: "Deposit", icon: TrendingUp, path: "/deposit", color: "bg-finance-teal text-white" },
    { name: "Team", icon: Users, path: "/team", color: "bg-finance-blue text-white" },
    { name: "History", icon: BarChart3, path: "/history", color: "bg-finance-accent text-finance-blue" },
    { name: "Support", icon: HelpCircle, path: "/support", color: "bg-muted text-foreground" }
  ];

  // Featured articles/news
  const featuredNews = [
    {
      title: "Market Update: Forex Trends in 2025",
      excerpt: "Latest trends in the forex market and what they mean for investors.",
      image: "https://images.unsplash.com/photo-1607266443557-2a82e5edb348?q=80&w=500&auto=format&fit=crop",
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
  
  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Let AI work for you!</h1>
            <p className="text-muted-foreground">Discover new AI legitimate trading methods</p>
          </div>
          <Button 
            onClick={() => navigate('/packages')}
            className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90"
          >
            Start Now
          </Button>
        </div>
        
        {/* Hero Carousel */}
        <Card className="overflow-hidden border-none shadow-lg">
          <Carousel className="w-full">
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
                          <span className="text-sm">{pkg.return}% Daily Return</span>
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
    </Layout>
  );
}
