
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCopy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Team() {
  const { mains, userID } = useAuth()
  const [copied, setCopied] = useState(false);
  const link = `https://app.trade-swing.tech/auth?upline=${userID}`;
  const { toast } = useToast()
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
        toast({
          title: "Copied Succefully!",
          description: "Now you can share you link to family and friends!",
        });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset copied state after 2 seconds
    } catch (err) {
      console.error("Failed to copy!", err);
      toast({
          title: "Failed to copy!",
          description: "Select the refferal link and copy manualy!",
        });
    }
  };
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Team & Referrals</h1>
          <Button className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90">
            Invite Friends
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
            <CardDescription>Share this link with your friends and earn 10% commission for their first trade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={`https://app.trade-swing.tech/auth?upline=${userID}`}
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <ClipboardCopy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Team Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{mains?.referral.total_downlines}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Earnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-finance-green">
                Kes {useFormat(mains ? mains.wallet.invite_income : 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active downlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mains?.referral.active_downlines}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Team</CardTitle>
          </CardHeader>
          <CardContent>
            {mains?.referral.downlines.length > 0 ? (
              <div className="space-y-4">
                {mains?.referral.downlines.map(downline => (
                  <div key={downline.ID} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{downline.email}</div>
                      <div className="text-sm text-muted-foreground">
                       Joined: {downline.date_created}
                      </div>
                    </div>
                    <div className={` ${downline.status == 'Active' ? 'text-finance-green' : 'text-finance-red' } font-medium`}>
                      {downline.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-medium">No team members yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Share your referral link to start building your team
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
