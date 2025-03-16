
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MessageSquare, Sparkles, Database, BarChart, Users, Shield, Zap, Code, Repeat, Globe } from "lucide-react";

const FeatureSection = ({ 
  title, 
  description, 
  icon: Icon, 
  direction = "ltr",
  imageSrc
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType; 
  direction?: "ltr" | "rtl";
  imageSrc: string;
}) => {
  const isRtl = direction === "rtl";
  
  return (
    <div className="py-16 border-b border-border/50 last:border-0">
      <div className={`container mx-auto px-4 flex flex-col ${isRtl ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
        <div className="w-full md:w-1/2 space-y-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
          <Button variant="outline" asChild>
            <Link to="/signup">Try it now</Link>
          </Button>
        </div>
        <div className="w-full md:w-1/2">
          <div className="bg-card p-4 rounded-xl border border-border shadow-lg">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <>
      <Helmet>
        <title>Features | ChatSaaS</title>
      </Helmet>
      
      <Header />
      
      <main>
        <section className="pt-32 pb-16 bg-gradient-to-b from-background to-secondary/20">
          <AnimatedTransition animation="fade-in">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Powerful AI Features for Your Website
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                Transform visitor engagement with intelligent, personalized, and conversion-focused AI chatbots
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Start Free Trial</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Request Demo</Link>
                </Button>
              </div>
            </div>
          </AnimatedTransition>
        </section>
        
        <FeatureSection 
          title="Natural Language Understanding" 
          description="Our chatbots understand complex queries, context, and user intent, providing human-like responses that keep your visitors engaged and satisfied."
          icon={MessageSquare}
          imageSrc="/placeholder.svg"
        />
        
        <FeatureSection 
          title="AI-Powered Knowledge Base" 
          description="Easily import your existing content, documents, FAQs, and product information to train your chatbot on your unique business knowledge."
          icon={Database}
          direction="rtl"
          imageSrc="/placeholder.svg"
        />
        
        <FeatureSection 
          title="Customizable Design System" 
          description="Match your brand identity with customizable colors, themes, positioning, and messaging that seamlessly integrates with your website design."
          icon={Sparkles}
          imageSrc="/placeholder.svg"
        />
        
        <FeatureSection 
          title="Lead Generation & Qualification" 
          description="Convert visitors into qualified leads with intelligent forms that capture contact information and qualify prospects based on your criteria."
          icon={Users}
          direction="rtl"
          imageSrc="/placeholder.svg"
        />
        
        <FeatureSection 
          title="Advanced Analytics Dashboard" 
          description="Gain valuable insights from comprehensive reports on user interactions, popular topics, conversion metrics, and engagement patterns."
          icon={BarChart}
          imageSrc="/placeholder.svg"
        />
        
        <section className="py-20 bg-secondary/20">
          <div className="container mx-auto px-4">
            <AnimatedTransition animation="slide-up">
              <h2 className="text-3xl font-bold text-center mb-16">More Powerful Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {additionalFeatures.map((feature, index) => (
                  <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </AnimatedTransition>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <AnimatedTransition animation="fade-in">
              <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Website?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join thousands of businesses using ChatSaaS to increase engagement, 
                generate leads, and provide exceptional customer experiences.
              </p>
              <Button size="lg" asChild>
                <Link to="/signup">Get Started Today</Link>
              </Button>
            </AnimatedTransition>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

const additionalFeatures = [
  {
    title: "Enterprise-Grade Security",
    description: "Advanced encryption, data protection, and compliance features keep your conversations and customer data secure.",
    icon: Shield
  },
  {
    title: "Multi-Language Support",
    description: "Communicate with visitors in their preferred language with support for over 50 languages.",
    icon: Globe
  },
  {
    title: "Seamless Integrations",
    description: "Connect with your CRM, email marketing, help desk, and other tools for streamlined workflows.",
    icon: Repeat
  },
  {
    title: "Fast Implementation",
    description: "Get up and running in minutes with our simple setup process and no-code configuration options.",
    icon: Zap
  },
  {
    title: "Developer API",
    description: "Access our powerful API for custom integrations and advanced implementation scenarios.",
    icon: Code
  },
  {
    title: "Team Collaboration",
    description: "Multiple team members can manage chatbots, review conversations, and handle lead follow-up.",
    icon: Users
  }
];

export default Features;
