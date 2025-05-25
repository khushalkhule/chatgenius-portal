
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Mail, Lock, Shield, User, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormValues = z.infer<typeof formSchema>;

// Hard-coded client credentials for demo
const CLIENT_CREDENTIALS = {
  email: "client@chatsaas.com",
  password: "client12345"
};

// Hard-coded admin credentials for demo
const ADMIN_CREDENTIALS = {
  email: "admin@chatsaas.com",
  password: "admin123456"
};

const SignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const handleSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Try Supabase authentication first
      await signIn(data.email, data.password);
      navigate("/dashboard");
    } catch (error) {
      // Fallback to demo credentials
      if (data.email === ADMIN_CREDENTIALS.email && data.password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("isAdminAuthenticated", "true");
        navigate("/admin-dashboard");
      } else if (data.email === CLIENT_CREDENTIALS.email && data.password === CLIENT_CREDENTIALS.password) {
        localStorage.setItem("userRole", "client");
        localStorage.setItem("isAuthenticated", "true");
        navigate("/dashboard");
      }
      // If Supabase auth failed and not demo credentials, error is already shown by useAuth
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFillClientDemo = () => {
    form.setValue("email", CLIENT_CREDENTIALS.email);
    form.setValue("password", CLIENT_CREDENTIALS.password);
  };
  
  const handleFillAdminDemo = () => {
    form.setValue("email", ADMIN_CREDENTIALS.email);
    form.setValue("password", ADMIN_CREDENTIALS.password);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Helmet>
        <title>Sign In | AI Chatbot Platform</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="your@email.com"
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="pl-10"
                          disabled={isLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="text-right text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center text-sm space-y-4">
            <div className="text-muted-foreground">
              Use one of these demo accounts:
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <button 
                className="border rounded-md p-2 hover:bg-muted/50 transition-colors"
                onClick={handleFillClientDemo}
                disabled={isLoading}
              >
                <div className="flex items-center gap-1 mb-1 text-primary">
                  <User className="h-3 w-3" />
                  <span>Client</span>
                </div>
                <div className="font-mono text-muted-foreground">client@chatsaas.com</div>
                <div className="font-mono text-muted-foreground">client12345</div>
              </button>
              <button 
                className="border rounded-md p-2 hover:bg-muted/50 transition-colors"
                onClick={handleFillAdminDemo}
                disabled={isLoading}
              >
                <div className="flex items-center gap-1 mb-1 text-destructive">
                  <Shield className="h-3 w-3" />
                  <span>Admin</span>
                </div>
                <div className="font-mono text-muted-foreground">admin@chatsaas.com</div>
                <div className="font-mono text-muted-foreground">admin123456</div>
              </button>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-primary hover:underline">
              Sign up
            </Link>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignIn;
