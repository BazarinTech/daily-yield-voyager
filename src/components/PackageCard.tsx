
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "@/types";
import { cn } from "@/lib/utils";

interface PackageCardProps {
  pkg: Package;
  onInvest: (packageId: string) => void;
  className?: string;
}

export default function PackageCard({ pkg, onInvest, className }: PackageCardProps) {
  // Determine badge color based on risk level
  const getBadgeColor = (riskLevel: number) => {
    switch(riskLevel) {
      case 1: return "bg-blue-100 text-blue-800";
      case 2: return "bg-green-100 text-green-800";
      case 3: return "bg-yellow-100 text-yellow-800";
      case 4: return "bg-orange-100 text-orange-800";
      case 5: return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className={cn("transition-all hover:shadow-md", className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{pkg.name}</CardTitle>
            <CardDescription className="mt-1">
              {pkg.tier} Package
            </CardDescription>
          </div>
          <Badge className={getBadgeColor(pkg.riskLevel)}>
            Risk Level {pkg.riskLevel}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Min Investment</p>
            <p className="text-lg font-semibold">${pkg.minInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Max Investment</p>
            <p className="text-lg font-semibold">${pkg.maxInvestment.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Daily Return</p>
            <p className="text-lg font-semibold">
              {pkg.dailyReturnRange.min}% - {pkg.dailyReturnRange.max}%
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Duration</p>
            <p className="text-lg font-semibold">{pkg.durationDays} days</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{pkg.description}</p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={() => onInvest(pkg.id)}
          className="w-full bg-gradient-to-r from-finance-teal to-finance-blue hover:opacity-90"
        >
          Invest Now
        </Button>
      </CardFooter>
    </Card>
  );
}
