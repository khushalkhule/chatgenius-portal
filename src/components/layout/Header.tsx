
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Menu, X, LogIn, UserPlus, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AnimatedTransition from "../ui-custom/AnimatedTransition";

interface NavLinkProps {
  to: string;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const NavLink = ({ to, className, onClick, children }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        "relative px-3 py-2 text-sm font-medium transition-colors",
        "hover:text-primary",
        {
          "text-primary": isActive,
          "text-foreground/70": !isActive,
        },
        className
      )}
      onClick={onClick}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transform origin-left animate-scale-in"></span>
      )}
    </Link>
  );
};

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    const clientAuth = localStorage.getItem("isAuthenticated");
    const adminAuth = localStorage.getItem("isAdminAuthenticated");
    const userRole = localStorage.getItem("userRole");
    
    setIsAuthenticated(clientAuth === "true" || adminAuth === "true");
    setIsAdmin(userRole === "admin");

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("isAdminAuthenticated");
    localStorage.removeItem("userRole");
    
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-4",
        {
          "bg-background/80 backdrop-blur-lg shadow-sm": isScrolled,
          "bg-transparent": !isScrolled,
        }
      )}
    >
      <div className="container mx-auto flex justify-between items-center">
        <AnimatedTransition animation="slide-right" duration={600}>
          <Link to="/" className="flex items-center space-x-2">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              AI
            </span>
            <span className="font-semibold text-xl">ChatSaaS</span>
          </Link>
        </AnimatedTransition>

        {/* Desktop Navigation */}
        <AnimatedTransition animation="slide-left" duration={600}>
          <nav className="hidden md:flex space-x-1 items-center">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/features">Features</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/guides">Guides</NavLink>
            {isAuthenticated && (
              <NavLink to={isAdmin ? "/admin-dashboard" : "/dashboard"}>
                Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink to="/admin-dashboard/sales">
                Sales
              </NavLink>
            )}
            <div className="ml-4 flex space-x-2">
              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Button variant="outline" className="gap-2" asChild>
                      <Link to="/admin-dashboard">
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" className="gap-2" asChild>
                    <Link to="/sign-in">
                      <LogIn className="h-4 w-4" />
                      Log in
                    </Link>
                  </Button>
                  <Button className="gap-2" asChild>
                    <Link to="/sign-up">
                      <UserPlus className="h-4 w-4" />
                      Sign up
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </AnimatedTransition>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden p-2 rounded-full hover:bg-secondary transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          "fixed inset-x-0 top-[72px] p-4 border-b bg-background/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out",
          {
            "translate-y-0 opacity-100": isMobileMenuOpen,
            "-translate-y-full opacity-0 pointer-events-none": !isMobileMenuOpen,
          }
        )}
      >
        <nav className="flex flex-col space-y-4">
          <NavLink to="/" className="w-full text-center py-3" onClick={() => setIsMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/features" className="w-full text-center py-3" onClick={() => setIsMobileMenuOpen(false)}>
            Features
          </NavLink>
          <NavLink to="/pricing" className="w-full text-center py-3" onClick={() => setIsMobileMenuOpen(false)}>
            Pricing
          </NavLink>
          <NavLink to="/guides" className="w-full text-center py-3" onClick={() => setIsMobileMenuOpen(false)}>
            Guides
          </NavLink>
          {isAuthenticated && (
            <NavLink 
              to={isAdmin ? "/admin-dashboard" : "/dashboard"} 
              className="w-full text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </NavLink>
          )}
          {isAdmin && (
            <NavLink 
              to="/admin-dashboard/sales" 
              className="w-full text-center py-3"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sales
            </NavLink>
          )}
          <div className="pt-4 flex flex-col space-y-2">
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Button variant="outline" className="w-full gap-2" asChild onClick={() => setIsMobileMenuOpen(false)}>
                    <Link to="/admin-dashboard">
                      <Shield className="h-4 w-4" />
                      Admin Portal
                    </Link>
                  </Button>
                )}
                <Button 
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="w-full gap-2" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/sign-in">
                    <LogIn className="h-4 w-4" />
                    Log in
                  </Link>
                </Button>
                <Button className="w-full gap-2" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/sign-up">
                    <UserPlus className="h-4 w-4" />
                    Sign up
                  </Link>
                </Button>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
