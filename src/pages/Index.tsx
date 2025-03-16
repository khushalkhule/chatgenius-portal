
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Features from "@/components/sections/Features";
import Hero from "@/components/sections/Hero";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import ChatInterface from "@/components/chat/ChatInterface";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />

        {/* How It Works Section */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <AnimatedTransition animation="slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  How ChatSaaS Works
                </h2>
              </AnimatedTransition>
              <AnimatedTransition animation="slide-up" delay={200}>
                <p className="text-xl text-muted-foreground">
                  Get your AI chatbot up and running on your website in three simple steps
                </p>
              </AnimatedTransition>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <AnimatedTransition animation="slide-up" delay={300}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Create Your Chatbot</h3>
                  <p className="text-muted-foreground">
                    Sign up for an account and follow our simple wizard to create your first
                    AI chatbot.
                  </p>
                </div>
              </AnimatedTransition>

              <AnimatedTransition animation="slide-up" delay={400}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Customize & Train</h3>
                  <p className="text-muted-foreground">
                    Customize the design, add your knowledge base, and configure your
                    chatbot to match your brand.
                  </p>
                </div>
              </AnimatedTransition>

              <AnimatedTransition animation="slide-up" delay={500}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary text-2xl font-bold flex items-center justify-center mx-auto mb-6">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Deploy & Monitor</h3>
                  <p className="text-muted-foreground">
                    Add a single line of code to your website and start engaging with
                    visitors. Monitor results in real-time.
                  </p>
                </div>
              </AnimatedTransition>
            </div>

            <div className="text-center">
              <Button size="lg" asChild className="rounded-full">
                <Link to="/signup">
                  Get started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <AnimatedTransition animation="slide-right">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold">
                    Try Our AI Chatbot Demo
                  </h2>
                  <p className="text-xl text-muted-foreground">
                    Experience the power of our AI chatbot firsthand. Ask questions,
                    get responses, and see how it can transform your website's visitor
                    experience.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Natural language understanding",
                      "Knowledge base integration",
                      "Lead capture functionality",
                      "Customizable appearance",
                      "Seamless website integration",
                    ].map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedTransition>

              <AnimatedTransition animation="slide-left">
                <div className="flex justify-center">
                  <ChatInterface
                    initialMessages={[
                      {
                        id: "1",
                        content: "Hi there! I'm the ChatSaaS AI assistant. How can I help you today?",
                        isBot: true,
                        timestamp: new Date(),
                      },
                    ]}
                    botName="ChatSaaS AI"
                  />
                </div>
              </AnimatedTransition>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-secondary/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <AnimatedTransition animation="slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Simple, Transparent Pricing
                </h2>
              </AnimatedTransition>
              <AnimatedTransition animation="slide-up" delay={200}>
                <p className="text-xl text-muted-foreground">
                  Choose the plan that works best for your business
                </p>
              </AnimatedTransition>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Free",
                  price: "$0",
                  description: "Perfect for trying out the platform",
                  features: [
                    "1 chatbot",
                    "500 messages/month",
                    "Basic customization",
                    "Standard AI model",
                    "Email support",
                  ],
                  cta: "Get Started",
                  highlighted: false,
                },
                {
                  name: "Pro",
                  price: "$29",
                  period: "/month",
                  description: "For growing businesses",
                  features: [
                    "5 chatbots",
                    "5,000 messages/month",
                    "Advanced customization",
                    "Choice of AI models",
                    "Lead capture forms",
                    "Knowledge base integration",
                    "Priority support",
                  ],
                  cta: "Start Free Trial",
                  highlighted: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  description: "For large organizations",
                  features: [
                    "Unlimited chatbots",
                    "Unlimited messages",
                    "Full customization",
                    "Premium AI models",
                    "SSO authentication",
                    "Advanced analytics",
                    "API access",
                    "Dedicated support",
                  ],
                  cta: "Contact Sales",
                  highlighted: false,
                },
              ].map((plan, index) => (
                <AnimatedTransition
                  key={plan.name}
                  animation="scale-up"
                  delay={100 * index}
                >
                  <div
                    className={`rounded-xl border ${
                      plan.highlighted
                        ? "border-primary/50 bg-card shadow-lg ring-2 ring-primary/20"
                        : "border-border bg-card/50"
                    } overflow-hidden h-full flex flex-col transition-transform hover:scale-[1.01]`}
                  >
                    <div className="p-6 border-b border-border">
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <div className="mb-4">
                        <span className="text-3xl font-bold">{plan.price}</span>
                        {plan.period && (
                          <span className="text-muted-foreground">{plan.period}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground">{plan.description}</p>
                    </div>
                    <div className="p-6 flex-1">
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 pt-0">
                      <Button
                        className={`w-full ${
                          plan.highlighted ? "" : "bg-secondary text-foreground hover:bg-secondary/80"
                        }`}
                        asChild
                      >
                        <Link to={plan.name === "Enterprise" ? "/contact" : "/signup"}>
                          {plan.cta}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </AnimatedTransition>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <AnimatedTransition animation="slide-up">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Ready to Transform Your Website with AI?
                </h2>
              </AnimatedTransition>
              <AnimatedTransition animation="slide-up" delay={200}>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Join thousands of businesses already using ChatSaaS to engage visitors,
                  answer questions, and generate leads 24/7.
                </p>
              </AnimatedTransition>
              <AnimatedTransition animation="slide-up" delay={300}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild className="rounded-full">
                    <Link to="/signup">
                      Start your free trial <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="rounded-full">
                    <Link to="/contact">Contact sales</Link>
                  </Button>
                </div>
              </AnimatedTransition>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
