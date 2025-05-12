
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: number;
  className?: string;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center text-xs mt-2">
            <span
              className={cn(
                "mr-1",
                trend >= 0 ? "text-finance-green" : "text-finance-red"
              )}
            >
              {trend >= 0 ? "+" : ""}
              {trend}%
            </span>
            <span className="text-muted-foreground">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
