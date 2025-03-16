import { useState } from "react";
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Link } from "react-router-dom";
import { Check, X, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { subscriptionData } from "@/components/admin/SubscriptionDetails";

interface PricingFeature {
  name: string;
  tooltip?: string;
  tiers: {
    starter: boolean | string;
    professional: boolean | string;
    enterprise: boolean | string;
  };
}

const PricingCard = ({
  name,
  price,
  period,
  description,
  features,
  highlighted = false,
  badge,
  ctaText = "Get started",
  isFree = false,
}: {
  name: string;
  price: number | string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  ctaText?: string;
  isFree?: boolean;
}) => {
  return (
    <div
      className={`border rounded-xl p-6 relative ${
        highlighted
          ? "border-primary shadow-lg shadow-primary/10"
          : "border-border"
      }`}
    >
      {badge && (
        <Badge
          className="absolute -top-3 right-6 px-3 py-1"
          variant="secondary"
        >
          {badge}
        </Badge>
      )}
      <h3 className="text-xl font-semibold">{name}</h3>
      <div className="mt-4 mb-2">
        {typeof price === 'number' ? (
          <>
            <span className="text-3xl font-bold">${price}</span>
            <span className="text-muted-foreground ml-1">{period}</span>
          </>
        ) : (
          <span className="text-3xl font-bold">{price}</span>
        )}
      </div>
      <p className="text-muted-foreground mb-6">{description}</p>
      <Button
        className={`w-full mb-6 ${highlighted ? "" : isFree ? "bg-green-600 hover:bg-green-700" : "variant-outline"}`}
        asChild
      >
        <Link to="/signup">{ctaText}</Link>
      </Button>
      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeatureRow = ({ feature }: { feature: PricingFeature }) => {
  return (
    <div className="grid grid-cols-4 py-4 border-b border-border/50 items-center">
      <div className="flex items-center gap-1">
        <span>{feature.name}</span>
        {feature.tooltip && (
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-muted-foreground" />
            </TooltipTrigger>
            <TooltipContent>{feature.tooltip}</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Starter */}
      <div className="text-center">
        {typeof feature.tiers.starter === "boolean" ? (
          feature.tiers.starter ? (
            <Check className="h-5 w-5 text-primary mx-auto" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground mx-auto" />
          )
        ) : (
          <span>{feature.tiers.starter}</span>
        )}
      </div>

      {/* Professional */}
      <div className="text-center">
        {typeof feature.tiers.professional === "boolean" ? (
          feature.tiers.professional ? (
            <Check className="h-5 w-5 text-primary mx-auto" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground mx-auto" />
          )
        ) : (
          <span>{feature.tiers.professional}</span>
        )}
      </div>

      {/* Enterprise */}
      <div className="text-center">
        {typeof feature.tiers.enterprise === "boolean" ? (
          feature.tiers.enterprise ? (
            <Check className="h-5 w-5 text-primary mx-auto" />
          ) : (
            <X className="h-5 w-5 text-muted-foreground mx-auto" />
          )
        ) : (
          <span>{feature.tiers.enterprise}</span>
        )}
      </div>
    </div>
  );
};

const Pricing = () => {
  const [annual, setAnnual] = useState(true);
  
  const plans = subscriptionData.plans;
  
  const freePlan = plans.find(plan => plan.id === "free");
  const starterPlan = plans.find(plan => plan.id === "basic");
  const proPlan = plans.find(plan => plan.id === "pro");
  const enterprisePlan = plans.find(plan => plan.id === "enterprise");

  return (
    <>
      <Helmet>
        <title>Pricing | ChatSaaS</title>
      </Helmet>

      <Header />

      <main className="pt-32 pb-20">
        <section className="container mx-auto px-4">
          <AnimatedTransition animation="fade-in">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Flexible Pricing for Every Business
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Choose the plan that fits your needs, from startups to
                enterprises
              </p>

              <div className="flex items-center justify-center gap-3 mb-8">
                <span
                  className={`${
                    !annual ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Monthly
                </span>
                <Switch
                  checked={annual}
                  onCheckedChange={setAnnual}
                  aria-label="Toggle annual billing"
                />
                <span
                  className={`${
                    annual ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  Annual{" "}
                  <Badge variant="outline" className="ml-1">
                    Save 20%
                  </Badge>
                </span>
              </div>
            </div>
          </AnimatedTransition>

          <AnimatedTransition animation="fade-in" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              {freePlan && (
                <PricingCard
                  name={freePlan.name}
                  price={freePlan.price}
                  period={freePlan.period}
                  description={freePlan.description}
                  features={freePlan.features}
                  badge={freePlan.badge}
                  isFree={true}
                  ctaText="Start Free Trial"
                />
              )}
              
              {starterPlan && (
                <PricingCard
                  name={starterPlan.name}
                  price={annual ? starterPlan.priceValue : starterPlan.priceMonthlyValue}
                  period={annual ? "/month, billed annually" : "/month"}
                  description={starterPlan.description}
                  features={starterPlan.features}
                  highlighted={starterPlan.highlighted}
                  badge={starterPlan.badge}
                />
              )}

              {proPlan && (
                <PricingCard
                  name={proPlan.name}
                  price={annual ? proPlan.priceValue : proPlan.priceMonthlyValue}
                  period={annual ? "/month, billed annually" : "/month"}
                  description={proPlan.description}
                  features={proPlan.features}
                  highlighted={proPlan.highlighted}
                  badge={proPlan.badge}
                />
              )}

              {enterprisePlan && (
                <PricingCard
                  name={enterprisePlan.name}
                  price={annual ? enterprisePlan.priceValue : enterprisePlan.priceMonthlyValue}
                  period={annual ? "/month, billed annually" : "/month"}
                  description={enterprisePlan.description}
                  features={enterprisePlan.features}
                  highlighted={enterprisePlan.highlighted}
                  badge={enterprisePlan.badge}
                  ctaText="Contact sales"
                />
              )}
            </div>
          </AnimatedTransition>

          <AnimatedTransition animation="fade-in" delay={200}>
            <div className="bg-secondary/20 rounded-xl p-8 mb-16">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Compare Plans
              </h2>

              <div className="overflow-x-auto">
                <div className="min-w-[768px]">
                  {/* Header */}
                  <div className="grid grid-cols-4 pb-4 border-b border-border items-center">
                    <div></div>
                    <div className="text-center font-medium">Starter</div>
                    <div className="text-center font-medium">Professional</div>
                    <div className="text-center font-medium">Enterprise</div>
                  </div>

                  {/* Features */}
                  <TooltipProvider>
                    {pricingFeatures.map((feature, index) => (
                      <FeatureRow key={index} feature={feature} />
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </AnimatedTransition>

          <AnimatedTransition animation="fade-in" delay={300}>
            <div className="max-w-3xl mx-auto bg-card border border-border p-8 rounded-xl text-center">
              <h2 className="text-2xl font-bold mb-4">
                Need a custom solution?
              </h2>
              <p className="text-muted-foreground mb-6">
                Contact our sales team for enterprise-grade solutions, custom
                integrations, or specific requirements for your business.
              </p>
              <Button asChild>
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </AnimatedTransition>
        </section>
      </main>

      <Footer />
    </>
  );
};

const pricingFeatures: PricingFeature[] = [
  {
    name: "Trial period",
    tiers: {
      starter: "None",
      professional: "None",
      enterprise: "None",
    },
  },
  {
    name: "Chatbots",
    tiers: {
      starter: "1",
      professional: "5",
      enterprise: "Unlimited",
    },
  },
  {
    name: "Monthly messages",
    tooltip: "The number of bot-user message exchanges per month",
    tiers: {
      starter: "5,000",
      professional: "25,000",
      enterprise: "100,000+",
    },
  },
  {
    name: "AI tokens per day",
    tooltip: "Tokens used by the AI model to generate responses",
    tiers: {
      starter: "1,000",
      professional: "10,000",
      enterprise: "Unlimited",
    },
  },
  {
    name: "Lead capture forms",
    tiers: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Custom branding",
    tiers: {
      starter: true,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Knowledge base upload",
    tiers: {
      starter: "5MB",
      professional: "50MB",
      enterprise: "Unlimited",
    },
  },
  {
    name: "Website integrations",
    tiers: {
      starter: "1",
      professional: "5",
      enterprise: "Unlimited",
    },
  },
  {
    name: "CRM/Email integrations",
    tiers: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Advanced analytics",
    tiers: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Team members",
    tiers: {
      starter: "1",
      professional: "5",
      enterprise: "Unlimited",
    },
  },
  {
    name: "Custom domain",
    tiers: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "API access",
    tiers: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Priority support",
    tiers: {
      starter: false,
      professional: true,
      enterprise: true,
    },
  },
  {
    name: "Dedicated account manager",
    tiers: {
      starter: false,
      professional: false,
      enterprise: true,
    },
  },
  {
    name: "Custom integrations",
    tiers: {
      starter: false,
      professional: false,
      enterprise: true,
    },
  },
  {
    name: "SLA",
    tooltip: "Service Level Agreement for uptime and support",
    tiers: {
      starter: false,
      professional: false,
      enterprise: true,
    },
  },
];

export default Pricing;
