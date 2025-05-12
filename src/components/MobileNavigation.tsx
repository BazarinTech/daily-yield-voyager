
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, TrendingUp, BarChart3, Users, User, Gift } from "lucide-react";

export default function MobileNavigation() {
  const location = useLocation();
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Investments", path: "/investments", icon: TrendingUp },
    { name: "Transactions", path: "/transactions", icon: BarChart3 },
    { name: "Bonus", path: "/bonus", icon: Gift },
    { name: "Profile", path: "/profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 dark:bg-sidebar dark:border-sidebar-border md:hidden">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-3",
                isActive ? "text-primary" : "text-gray-500 dark:text-sidebar-foreground/70"
              )}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
