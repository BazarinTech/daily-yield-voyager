
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Gift, PartyPopper } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";
import { claimBonus } from "@/lib/actions";

export default function Bonus() {
  const { toast } = useToast();
  const { mains, userID, mainFetcher } = useAuth()
  const [isLoading, setLoading] = useState(false)
  
  const progressCalc = (achievement: Bonus): number => {
      const calc = achievement.progress / achievement.target;
      return calc * 100;
  }

  const handleClaimBonus = async(id: number) => {
    setLoading(true)
    try {
      const results = await claimBonus({userID, bonusID: id})
      if(results.status == 'Success') {
        toast({
          title: "Bonus claimed!",
          description: "Your bonus has been added to your account",
        });
      }else{
        toast({
          title: "Bonus claimed failed!",
          description: "Seems like you have already claimed or there is system downtime.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Claim Bonus Error:", error)
    }
    setLoading(false)
    mainFetcher(userID)
  };


  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bonuses & Rewards</h1>
        </div>
        <section>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mains?.bonuses.map((achievement) => (
              <Card key={achievement.ID} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{achievement.name}</CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div 
                      className="bg-primary h-2.5 rounded-full" 
                      style={{ width: `${progressCalc(achievement)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>{progressCalc(achievement)}%</span>
                    <span>Reward: Kes {useFormat(achievement.reward)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={progressCalc(achievement) >= 100 ? "default" : "outline"} 
                    disabled={progressCalc(achievement) < 100 || isLoading || achievement.is_claimed}
                    onClick={() => handleClaimBonus(achievement.ID)}
                  >
                    {progressCalc(achievement)=== 100 && !isLoading && !achievement.is_claimed ? "Claim Reward" : isLoading ? "Claiming..." : achievement.is_claimed ? 'Claimed' : "In Progress"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {mains?.bonuses.length < 1 && 'No Active bonus found'}
          </div>
        </section>
      </div>
    </Layout>
  );
}
