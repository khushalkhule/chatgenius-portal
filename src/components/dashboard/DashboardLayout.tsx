
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronDown,
  Home,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  PanelRight,
  Plus,
  Settings,
  User,
  Users,
  FileText,
  CreditCard,
  Plug,
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
  const isActive = location.pathname === to;

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

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const clientAuth = localStorage.getItem("isAuthenticated");
    setIsAuthenticated(clientAuth === "true");
    
    if (clientAuth !== "true") {
      toast.error("Please login to access dashboard");
      navigate("/sign-in");
    }
  }, [navigate]);

  const handleLogout = () => {
    // In a real app, you would handle session logout here
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    
    toast.success("Logged out successfully");
    // Redirect to sign-in page after logout
    setTimeout(() => {
      navigate("/sign-in");
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
          "bg-card border-r border-border transition-all duration-300 flex flex-col",
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
              AI
            </div>
            <span className="font-semibold">ChatSaaS</span>
          </div>
          {!isSidebarOpen && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold mx-auto">
              AI
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="rounded-md p-1.5 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="mb-6">
            <Button className="w-full justify-start gap-2" size="sm" asChild>
              <Link to="/create-chatbot">
                <Plus className="h-4 w-4" />
                {isSidebarOpen ? "Create Chatbot" : ""}
              </Link>
            </Button>
          </div>

          <nav className="space-y-1">
            <NavLink to="/dashboard" icon={Home}>
              {isSidebarOpen ? "Overview" : ""}
            </NavLink>
            <NavLink to="/dashboard/chatbots" icon={MessageSquare}>
              {isSidebarOpen ? "Chatbots" : ""}
            </NavLink>
            <NavLink to="/dashboard/analytics" icon={LayoutDashboard}>
              {isSidebarOpen ? "Analytics" : ""}
            </NavLink>
            <NavLink to="/dashboard/leads" icon={FileText}>
              {isSidebarOpen ? "Leads" : ""}
            </NavLink>
            <NavLink to="/dashboard/integrations" icon={Plug}>
              {isSidebarOpen ? "Integrations" : ""}
            </NavLink>
            <NavLink to="/dashboard/team" icon={Users}>
              {isSidebarOpen ? "Team" : ""}
            </NavLink>
            <NavLink to="/dashboard/subscription" icon={CreditCard}>
              {isSidebarOpen ? "Subscription" : ""}
            </NavLink>
            <NavLink to="/dashboard/settings" icon={Settings}>
              {isSidebarOpen ? "Settings" : ""}
            </NavLink>
          </nav>
        </div>

        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground">
              <User className="h-5 w-5" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="truncate font-medium text-sm">John Doe</div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  john.doe@example.com
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
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4">
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
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

            <Button 
              variant="ghost"
              size="icon"
              className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
