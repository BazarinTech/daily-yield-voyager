
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUser, getInvestmentStats } from "@/lib/data-service";
import { User, Mail, Phone, Shield, LogOut, DollarSign, LineChart, TrendingUp, ArrowUp } from "lucide-react";
import StatCard from "@/components/StatCard";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const stats = getInvestmentStats();
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
            {mockUser.name.charAt(0)}
          </div>
        </div>

        {/* Stats Cards - Moved from Dashboard */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard
            title="Total Invested"
            value={`$${stats.totalInvested.toLocaleString()}`}
            description="Across all packages"
            icon={<DollarSign className="h-4 w-4" />}
            trend={2.5}
          />
          <StatCard
            title="Active Investments"
            value={stats.activeInvestments.toString()}
            description="Currently running"
            icon={<LineChart className="h-4 w-4" />}
            trend={0}
          />
          <StatCard
            title="Total Earned"
            value={`$${stats.totalEarned.toLocaleString()}`}
            description="From all investments"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={3.2}
            className="text-finance-green"
          />
          <StatCard
            title="Average Return"
            value={`${stats.averageReturn}%`}
            description="Return on investment"
            icon={<ArrowUp className="h-4 w-4" />}
            trend={1.8}
          />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Balance</CardTitle>
            <CardDescription>Your current balance and funds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold">${mockUser.balance.toLocaleString()}</p>
              </div>
              <Button className="bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90">
                Deposit Funds
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={mockUser.name}
                    readOnly={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={mockUser.email}
                    readOnly={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    value="+1 (123) 456-7890"
                    readOnly={!editing}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
            {editing && <Button>Save Changes</Button>}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Enable Two-Factor Authentication
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
