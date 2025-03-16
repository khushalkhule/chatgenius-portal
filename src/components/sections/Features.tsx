
import { Cpu, Database, FileJson, Globe, MessageSquare, Shield, Users } from "lucide-react";
import AnimatedTransition from "../ui-custom/AnimatedTransition";
import GlassPanel from "../ui-custom/GlassPanel";

const features = [
  {
    icon: MessageSquare,
    title: "Conversational AI",
    description:
      "Powered by OpenAI's state-of-the-art language models to provide natural, helpful responses to your visitors.",
  },
  {
    icon: Database,
    title: "Knowledge Base",
    description:
      "Train your chatbot with your website content, documents, and FAQs to answer specific questions about your business.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Multi-user access with role-based permissions allows your whole team to manage chatbots together.",
  },
  {
    icon: FileJson,
    title: "Lead Generation",
    description:
      "Capture visitor information with customizable lead forms integrated directly into the chat flow.",
  },
  {
    icon: Globe,
    title: "Multi-Website Support",
    description:
      "Deploy different chatbots across multiple websites from a single dashboard with team management.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "End-to-end encryption, SOC 2 compliance, and role-based access control keep your data secure.",
  },
  {
    icon: Cpu,
    title: "AI Model Selection",
    description:
      "Choose from different AI models or customize parameters to balance cost and performance.",
  },
];

const Features = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedTransition animation="slide-up">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for Your AI Chatbot
            </h2>
          </AnimatedTransition>
          <AnimatedTransition animation="slide-up" delay={200}>
            <p className="text-xl text-muted-foreground">
              Everything you need to create, customize, and deploy intelligent AI chatbots
              that engage your website visitors and drive conversions.
            </p>
          </AnimatedTransition>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <AnimatedTransition
              key={feature.title}
              animation="scale-up"
              delay={100 * index}
            >
              <GlassPanel
                className="h-full p-6 transition-all duration-300 hover:translate-y-[-4px]"
                bordered
                elevated
              >
                <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </GlassPanel>
            </AnimatedTransition>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
