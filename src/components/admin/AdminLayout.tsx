
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  Key,
  Shield,
  ExternalLink,
  Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface NavLinkProps {
  to: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ to, icon: Icon, children, onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        {
          "bg-primary/10 text-primary": isActive,
          "hover:bg-secondary text-muted-foreground hover:text-foreground": !isActive,
        }
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{children}</span>
    </Link>
  );
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const adminAuth = localStorage.getItem("isAdminAuthenticated");
    setIsAuthenticated(adminAuth === "true");
    
    if (adminAuth !== "true") {
      toast.error("Please login to access admin dashboard");
      navigate("/admin-sign-in");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("userRole");
    
    toast.success("Admin logged out successfully");
    setTimeout(() => {
      navigate("/admin-sign-in");
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-card border-r border-border transition-all duration-300 flex flex-col z-30",
          {
            "w-64": isSidebarOpen,
            "w-20": !isSidebarOpen,
          }
        )}
      >
        <div className="p-4 border-b border-border flex items-center justify-between h-16">
          <div
            className={cn("flex items-center gap-2", {
              "opacity-0": !isSidebarOpen,
            })}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              <Shield className="h-5 w-5" />
            </div>
            <span className="font-semibold">Admin Portal</span>
          </div>
          {!isSidebarOpen && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold mx-auto">
              <Shield className="h-5 w-5" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-md p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronDown className={`h-5 w-5 transform transition-transform ${!isSidebarOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <nav className="space-y-1">
            <NavLink to="/admin-dashboard" icon={Home}>
              {isSidebarOpen ? "Dashboard" : ""}
            </NavLink>
            <NavLink to="/admin-dashboard/api-keys" icon={Key}>
              {isSidebarOpen ? "API Keys" : ""}
            </NavLink>
            <NavLink to="/admin-dashboard/users" icon={Users}>
              {isSidebarOpen ? "Users" : ""}
            </NavLink>
            <NavLink to="/admin-dashboard/analytics" icon={LayoutDashboard}>
              {isSidebarOpen ? "Analytics" : ""}
            </NavLink>
            <NavLink to="/admin-dashboard/settings" icon={Settings}>
              {isSidebarOpen ? "Settings" : ""}
            </NavLink>
            
            <div className="pt-4 mt-4 border-t border-border">
              <NavLink to="/dashboard" icon={ExternalLink}>
                {isSidebarOpen ? "Client Area" : ""}
              </NavLink>
            </div>
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Shield className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium text-sm">Administrator</div>
                <div className="text-xs text-muted-foreground truncate">
                  admin@chatsaas.com
                </div>
              </div>
            )}
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleLogout}
              className="ml-auto text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <h1 className="text-xl font-semibold">Admin Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost"
              size="icon" 
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full"></span>
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
