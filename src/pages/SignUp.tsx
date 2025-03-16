
import { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    acceptTerms: false
  });
  const navigate = useNavigate();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, acceptTerms: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.email || !formData.password || !formData.firstName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (!formData.acceptTerms) {
      toast.error("You must accept the terms and privacy policy");
      return;
    }
    
    // Simulate form submission
    setIsLoading(true);
    
    try {
      // In a real app, you would call your authentication API here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Account created successfully! Redirecting to dashboard...");
      
      // Redirect to dashboard after successful signup
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
      
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Sign Up | ChatSaaS</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <AnimatedTransition animation="fade-in">
            <div className="mb-8">
              <Link to="/" className="flex items-center mb-8">
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="text-sm text-muted-foreground">Back to home</span>
              </Link>
              
              <div className="text-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-4">
                  AI
                </div>
                <h1 className="text-2xl font-bold mb-2">Create your account</h1>
                <p className="text-muted-foreground mb-8">
                  Get started with ChatSaaS today
                </p>
              </div>
            </div>
            
            <div className="bg-card border border-border rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input 
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.acceptTerms}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-none">
                    I accept the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </Label>
                </div>
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </>
  );
};

export default SignUp;
