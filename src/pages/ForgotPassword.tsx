
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z.string().min(6, "Please enter the complete verification code"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });
  
  const resetForm = useForm({
    resolver: zodResolver(
      z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
      }).refine(data => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
      })
    ),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  const handleEmailSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to send an OTP to the user's email
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmail(data.email);
      
      // Simulating an OTP being sent
      toast.success("Verification code sent to your email");
      setStep("otp");
    } catch (error) {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpSubmit = async (data: OtpFormValues) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to verify the OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulating a successful OTP verification
      toast.success("Verification successful");
      setStep("reset");
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to resend the OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("A new verification code has been sent to your email");
    } catch (error) {
      toast.error("Failed to resend verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResetSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      // In a real app, this would call an API to reset the password
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulating a successful password reset
      toast.success("Password reset successful! You can now sign in with your new password.");
      setTimeout(() => {
        navigate("/sign-in");
      }, 1500);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFillDemoEmail = () => {
    emailForm.setValue("email", "demo@chatsaas.com");
  };
  
  const handleFillDemoOtp = () => {
    otpForm.setValue("otp", "123456");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/40">
      <Helmet>
        <title>Forgot Password | AI Chatbot Platform</title>
      </Helmet>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {step === "email" && "Forgot Password"}
            {step === "otp" && "Verification Code"}
            {step === "reset" && "Reset Password"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "email" && "Enter your email address to receive a verification code"}
            {step === "otp" && `Enter the verification code sent to ${email}`}
            {step === "reset" && "Create a new password for your account"}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {step === "email" && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
                <FormField
                  control={emailForm.control}
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
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleFillDemoEmail}
                  disabled={isLoading}
                >
                  Fill with demo email
                </Button>
              </form>
            </Form>
          )}
          
          {step === "otp" && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(handleOtpSubmit)} className="space-y-6">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-center justify-center space-y-4">
                      <FormControl>
                        <InputOTP 
                          maxLength={6} 
                          {...field} 
                          disabled={isLoading}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="text-center text-sm text-muted-foreground">
                  Didn't receive a code?{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto font-normal"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                  >
                    Resend
                  </Button>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mb-2"
                  onClick={handleFillDemoOtp}
                  disabled={isLoading}
                >
                  Fill with demo code
                </Button>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => setStep("email")}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="sm:flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
          
          {step === "reset" && (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          disabled={isLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={resetForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          disabled={isLoading}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="sm:flex-1"
                    onClick={() => setStep("otp")}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button type="submit" className="sm:flex-1" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <div className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/sign-in" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;
