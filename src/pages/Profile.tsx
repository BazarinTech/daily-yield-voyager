
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUser, getInvestmentStats } from "@/lib/data-service";
import { User, Mail, Phone, Shield, LogOut, DollarSign, LineChart, TrendingUp, ArrowUp, EyeOff, Eye } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";
import { Label } from "@/components/ui/label";
import { updateAccount, updatePassword } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const [editing, setEditing] = useState(false);
  const stats = getInvestmentStats();
  const { mains, logout, userID } = useAuth()
  const [isPass, setIsPass] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("")
  const [isSave, setIsSave] = useState(false)
  const [isPasswordUpdate, setIsPasswordUpdate] = useState(false)
  const { toast } = useToast();

  useEffect(() => {
    if (mains) {
      setPhone(mains.user.phone)
    }
  }, [mains])

  const handleSaveAccount = async () => {
    setIsSave(true)
    try {
      const results = await updateAccount({userID, email: mains.user.email, phone})
      if (results.status == "Success") {
        toast({
          title: "Operation Success!",
          description: results.message,
        });
      }else{
        toast({
          title: "Operation failed!",
          description: results.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Account Update Error:", error)
    }
    setIsSave(false)
  }

   const handleUpdatePassword = async () => {
    if (newPassword && oldPassword && confirmPassword) {
        setIsPasswordUpdate(true)
        try {
          const results = await updatePassword({userID, oldPassword, newPassword, confirmPassword})
          if (results.status == "Success") {
            toast({
              title: "Operation Success!",
              description: results.message,
            });
          }else{
            toast({
              title: "Operation failed!",
              description: results.message,
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Account Update Error:", error)
        }
        setIsPasswordUpdate(false)
      }else{
        toast({
              title: "Operation failed!",
              description: "You have some empty fields!",
              variant: "destructive",
            });
      }
    }

  
  return (
    <Layout>
      <div className="space-y-6">
        
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-semibold">
            {mockUser.name.charAt(0)}
          </div>
        </div>

        {/* Stats Cards - Moved from Dashboard */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <StatCard
            title="Investments Income"
            value={`Kes ${useFormat(mains ? mains.wallet.income : 0)}`}
            description="Across all packages"
            icon={<DollarSign className="h-4 w-4" />}
            trend={2.5}
          />
          <StatCard
            title="Active Investments"
            value={mains ? mains.active_investment : '0'}
            description="Currently running"
            icon={<LineChart className="h-4 w-4" />}
            trend={0}
          />
          <StatCard
            title="Invite Income"
            value={`Kes ${useFormat(mains ? mains.wallet.invite_income : 0)}`}
            description="From all investments"
            icon={<TrendingUp className="h-4 w-4" />}
            trend={3.2}
            className="text-finance-green"
          />
          <StatCard
            title="Average Return"
            value={`${mains ? mains.average_return : 0}%`}
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
                <p className="text-3xl font-bold">kes {useFormat(mains ? mains.wallet.balance : 0)}</p>
              </div>
              
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
                <label className="text-sm font-medium block mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={mains ? mains.user.email : ''}
                    readOnly
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    value={phone}
                    readOnly={!editing}
                    className="pl-10"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setEditing(!editing)}>
              {editing ? "Cancel" : "Edit Profile"}
            </Button>
            {editing && <Button onClick={handleSaveAccount} disabled={isSave}>{isSave ? 'Saving...' : 'Save Changes'}</Button>}
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <Button variant="outline" onClick={() => setIsPass(true)} className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Change Password
                </Button>
              </div>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" onClick={logout} className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog onOpenChange={setIsPass} open={isPass}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Modify Password</DialogTitle>
              <DialogDescription>
                Enter Old and new then confirm it to change your password
              </DialogDescription>
            </DialogHeader>
              <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="old-pass">Old password</Label>
                <div className="relative">
                  <Input
                    id="old-pass"
                    placeholder="Enter Old Password"
                    className="pl-2 pr-10"
                    type={showOldPassword ? "text" : "password"}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showOldPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="old-pass">New password</Label>
                <div className="relative">
                  <Input
                    id="new-pass"
                    placeholder="Enter New Password"
                    className="pl-2 pr-10"
                    type={showNewPassword ? "text" : "password"}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="old-pass">Confirm password</Label>
                <div className="relative">
                  <Input
                    id="new-pass"
                    placeholder="Confirm new Password"
                    className="pl-2 pr-10"
                    type={showConPassword ? "text" : "password"}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConPassword((prev) => !prev)}
                    className="absolute right-2 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    {showConPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button disabled={isPasswordUpdate} onClick={handleUpdatePassword}>
                 {isPasswordUpdate ? 'Updating...' : 'Update Password'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </Layout>
  );
}
