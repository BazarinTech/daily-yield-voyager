import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { mockUser } from "@/lib/data-service";
import NotificationsModal from "./NotificationsModal";
import MobileNavigation from "./MobileNavigation";
import { Button } from "@/components/ui/button";
import { User, Gift } from "lucide-react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/AuthContext";
import useFormat from "@/hooks/useFormat";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  const location = useLocation();
  const navItems = [
    { name: "Dashboard", path: "/", icon: "📊" },
    { name: "Investments", path: "/investments", icon: "💰" },
    { name: "Packages", path: "/packages", icon: "📦" },
    { name: "History", path: "/history", icon: "📜" },
    { name: "Bonus", path: "/bonus", icon: "🎁" },
  ];
  const { mains } = useAuth()

  const isAuthenticated = true; // For demo purposes, in real app this would be from auth context/state

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex md:w-64 md:min-h-screen md:flex-col bg-sidebar">
          {/* Logo */}
          <div className="p-4 flex items-center justify-center md:justify-start">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              <span className="text-primary">Trade</span>Vault
            </h1>
          </div>
          
          {/* Navigation */}
          <nav className="px-2 flex-grow">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                      location.pathname === item.path && "bg-sidebar-accent font-medium"
                    )}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* User */}
          {isAuthenticated ? (
            <div className="p-4 border-t border-sidebar-border">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {mains?.user.email.charAt(0)}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-sidebar-foreground">
                    Portfolio
                  </p>
                  <p className="text-xs text-sidebar-foreground/70">
                    Balance: Kes {useFormat(mains ? mains.wallet.balance : 0)}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-sidebar-border">
              <Link to="/auth">
                <Button className="w-full bg-primary hover:bg-primary/90">Sign In</Button>
              </Link>
            </div>
          )}
        </div>
        
        {/* Mobile header */}
        <div className="md:hidden flex justify-between items-center p-4 border-b border-border bg-background sticky top-0 z-10">
          <h1 className="text-lg font-bold">
            <span className="text-primary">Trade</span>Vault
          </h1>
          <div className="flex items-center gap-2">
            <NotificationsModal />
            {isAuthenticated ? (
              <Link to="/profile">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium">
                  {mains?.user.email.charAt(0)}
                </div>
              </Link>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-primary hover:bg-primary/90">Sign In</Button>
              </Link>
            )}
          </div>
        </div>
        
        {/* Desktop header */}
        <div className="hidden md:flex md:flex-col md:flex-grow">
          <div className="flex justify-between items-center p-4 border-b border-border bg-background">
            <h2 className="text-xl font-semibold">
              {navItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
            </h2>
            <div className="flex items-center gap-2">
              <NotificationsModal />
              {!isAuthenticated && (
                <Link to="/auth">
                  <Button className="bg-primary hover:bg-primary/90">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Main content */}
          <div className={cn("flex-grow p-4 md:p-8 overflow-y-auto", className)}>
            {children}
          </div>
        </div>

        {/* Mobile content */}
        <div className="md:hidden flex-grow p-4 pb-20">
          {children}
        </div>

        {/* Mobile navigation */}
        <MobileNavigation />
      </div>
    </TooltipProvider>
  );
}
