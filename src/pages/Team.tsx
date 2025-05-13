
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ClipboardCopy } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Team() {
  // Mock referral data
  const referrals = [
    { id: 1, name: "Sarah Johnson", level: 1, joinDate: "2023-04-15", active: true, earnings: 120 },
    { id: 2, name: "Michael Smith", level: 1, joinDate: "2023-04-22", active: true, earnings: 85 },
    { id: 3, name: "Jessica Brown", level: 2, joinDate: "2023-05-03", active: true, earnings: 45 },
  ];

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
            <CardDescription>Share this link with your friends and earn 5% commission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value="https://forexyield.com/ref/johndoe123"
                className="font-mono text-sm"
              />
              <Button variant="outline" size="icon">
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
                <span className="text-2xl font-bold">{referrals.length}</span>
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
                Kes{referrals.reduce((sum, ref) => sum + ref.earnings, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Level 1 Referrals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {referrals.filter(ref => ref.level === 1).length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Your Team</CardTitle>
          </CardHeader>
          <CardContent>
            {referrals.length > 0 ? (
              <div className="space-y-4">
                {referrals.map(referral => (
                  <div key={referral.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <div className="font-medium">{referral.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Level {referral.level} • Joined {new Date(referral.joinDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-finance-green font-medium">
                      Kes{referral.earnings}
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
