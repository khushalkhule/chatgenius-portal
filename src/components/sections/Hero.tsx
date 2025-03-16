
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedTransition from "../ui-custom/AnimatedTransition";
import GlassPanel from "../ui-custom/GlassPanel";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-3xl opacity-60 animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <AnimatedTransition animation="slide-up" delay={200}>
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                Now in public beta
              </div>
            </AnimatedTransition>

            <AnimatedTransition animation="slide-up" delay={400}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-balance">
                Enterprise AI Chatbot Platform for Your Website
              </h1>
            </AnimatedTransition>

            <AnimatedTransition animation="slide-up" delay={600}>
              <p className="text-xl text-muted-foreground text-balance">
                Create, customize, and deploy intelligent AI chatbots for your website in minutes. 
                Enhance customer engagement and drive conversions with ChatSaaS.
              </p>
            </AnimatedTransition>

            <AnimatedTransition animation="slide-up" delay={800}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="rounded-full">
                  <Link to="/signup">
                    Start for free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full">
                  <Link to="/demo">See live demo</Link>
                </Button>
              </div>
            </AnimatedTransition>

            <AnimatedTransition animation="fade-in" delay={1000}>
              <div className="text-sm text-muted-foreground">
                No credit card required • Free plan available • Easy setup
              </div>
            </AnimatedTransition>
          </div>

          <AnimatedTransition animation="scale-up" delay={800}>
            <div className="relative">
              <GlassPanel className="p-6 relative z-20">
                <div className="aspect-video w-full">
                  <div className="bg-background rounded-lg shadow-sm border border-border h-full flex flex-col overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                      <div className="text-xs text-muted-foreground">ai-chatbot.example.com</div>
                      <div className="w-4" />
                    </div>
                    <div className="flex-1 p-4 flex items-center justify-center">
                      <div className="w-full max-w-xs">
                        <div className="flex items-start gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            AI
                          </div>
                          <div className="glass-card p-3 rounded-2xl rounded-tl-sm text-sm text-balance animate-slide-up opacity-0" style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}>
                            Hello! How can I help you today?
                          </div>
                        </div>
                        <div className="flex items-start gap-2 mb-4 justify-end">
                          <div className="bg-primary/10 p-3 rounded-2xl rounded-tr-sm text-sm text-balance animate-slide-up opacity-0" style={{ animationDelay: "1.6s", animationFillMode: "forwards" }}>
                            Can you tell me about your pricing plans?
                          </div>
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold shrink-0">
                            U
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            AI
                          </div>
                          <div className="glass-card p-3 rounded-2xl rounded-tl-sm text-sm text-balance animate-slide-up opacity-0" style={{ animationDelay: "2s", animationFillMode: "forwards" }}>
                            We offer three plans: Free, Pro ($29/mo), and Enterprise (custom pricing). Would you like me to explain the features of each?
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassPanel>
              
              {/* Decorative elements */}
              <div className="absolute top-1/2 -right-12 w-24 h-24 bg-cyan-500/20 rounded-full blur-xl -z-10" />
              <div className="absolute bottom-0 -left-8 w-16 h-16 bg-primary/20 rounded-full blur-xl -z-10" />
            </div>
          </AnimatedTransition>
        </div>
      </div>
    </section>
  );
};

export default Hero;
