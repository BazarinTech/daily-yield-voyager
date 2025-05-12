
import { useState } from "react";
import Layout from "@/components/Layout";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Gift, PartyPopper } from "lucide-react";

export default function Bonus() {
  const { toast } = useToast();
  const [claimedBonuses, setClaimedBonuses] = useState<number[]>([]);

  const bonusOffers = [
    {
      id: 1,
      title: "Welcome Bonus",
      description: "New users get $50 bonus when depositing $500 or more",
      reward: "$50",
      icon: <PartyPopper className="h-12 w-12 text-accent" />,
      color: "bg-soft-yellow",
    },
    {
      id: 2,
      title: "Referral Reward",
      description: "Earn $100 for each friend who joins and makes their first investment",
      reward: "$100",
      icon: <Gift className="h-12 w-12 text-primary" />,
      color: "bg-soft-blue",
    },
    {
      id: 3,
      title: "Loyalty Bonus",
      description: "Earn extra 0.5% on all investments after 6 months of activity",
      reward: "+0.5%",
      icon: <Trophy className="h-12 w-12 text-accent" />,
      color: "bg-soft-purple",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Investment",
      description: "Make your first investment",
      progress: 100,
      reward: "$10",
    },
    {
      id: 2,
      title: "Investment Master",
      description: "Invest in 5 different packages",
      progress: 40,
      reward: "$25",
    },
    {
      id: 3,
      title: "Long-term Investor",
      description: "Keep an investment for 30 days",
      progress: 70,
      reward: "$15",
    },
  ];

  const handleClaimBonus = (id: number) => {
    if (claimedBonuses.includes(id)) {
      toast({
        title: "Already claimed",
        description: "You've already claimed this bonus",
        variant: "destructive",
      });
      return;
    }

    setClaimedBonuses([...claimedBonuses, id]);
    toast({
      title: "Bonus claimed!",
      description: "Your bonus has been added to your account",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bonuses & Rewards</h1>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-4">Special Offers</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {bonusOffers.map((offer) => (
                <CarouselItem key={offer.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className={`h-full border-t-4 border-primary overflow-hidden ${offer.color}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{offer.title}</CardTitle>
                        <div>{offer.icon}</div>
                      </div>
                      <CardDescription className="text-sm mt-2">
                        {offer.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-primary">{offer.reward}</p>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        onClick={() => handleClaimBonus(offer.id)}
                        disabled={claimedBonuses.includes(offer.id)}
                      >
                        {claimedBonuses.includes(offer.id) ? "Claimed" : "Claim Bonus"}
                      </Button>
                    </CardFooter>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Achievements</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{achievement.title}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{achievement.progress}%</span>
                    <span>Reward: {achievement.reward}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={achievement.progress === 100 ? "default" : "outline"} 
                    disabled={achievement.progress < 100}
                  >
                    {achievement.progress === 100 ? "Claim Reward" : "In Progress"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <Card>
            <CardHeader>
              <CardTitle>Daily Login Streak</CardTitle>
              <CardDescription>Log in daily to earn bonus rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                  <div 
                    key={day} 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border 
                      ${day <= 5 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-sm text-center">Current streak: <span className="font-bold">5 days</span></p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground w-full text-center">
                Next reward in 2 days: <span className="font-medium text-foreground">$15 bonus</span>
              </p>
            </CardFooter>
          </Card>
        </section>
      </div>
    </Layout>
  );
}
