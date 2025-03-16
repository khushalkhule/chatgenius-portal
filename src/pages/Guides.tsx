
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { 
  Book, 
  FileText, 
  Lightbulb, 
  ChevronRight,
  Search,
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const GuideCard = ({ 
  icon: Icon, 
  title, 
  description, 
  link 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  link: string 
}) => (
  <Card className="h-full group transition-all hover:shadow-md">
    <CardHeader>
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button variant="ghost" className="group-hover:text-primary p-0" asChild>
        <Link to={link}>
          Read guide <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </CardFooter>
  </Card>
);

const Guides = () => {
  return (
    <>
      <Helmet>
        <title>Guides | ChatSaaS</title>
      </Helmet>
      
      <Header />
      
      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Guides</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <AnimatedTransition animation="fade-in">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">ChatSaaS Guides</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive resources to help you get the most out of your AI chatbot
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search guides..." 
                  className="pl-10 py-6"
                />
              </div>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition animation="slide-up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <GuideCard 
                icon={Book}
                title="Getting Started" 
                description="Learn the basics of setting up your first AI chatbot with ChatSaaS."
                link="/guides/getting-started"
              />
              <GuideCard 
                icon={Lightbulb}
                title="Best Practices" 
                description="Tips and strategies to maximize your chatbot's effectiveness."
                link="/guides/best-practices"
              />
              <GuideCard 
                icon={FileText}
                title="Knowledge Base Setup" 
                description="Learn how to feed your chatbot with custom knowledge."
                link="/guides/knowledge-base"
              />
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition animation="slide-up" delay={200}>
            <section className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Popular Guides</h2>
              <div className="space-y-4">
                {popularGuides.map((guide, index) => (
                  <Card key={index}>
                    <CardContent className="p-0">
                      <Link 
                        to={guide.link}
                        className="flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary mr-4">
                            <BookOpen className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium">{guide.title}</h3>
                            <p className="text-sm text-muted-foreground">{guide.category}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </AnimatedTransition>
          
          <AnimatedTransition animation="slide-up" delay={300}>
            <div className="bg-primary/10 rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Need customized help?</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Our support team is ready to assist with any specific questions or challenges
                you're facing with your ChatSaaS implementation.
              </p>
              <Button asChild size="lg">
                <Link to="/contact">Contact Support</Link>
              </Button>
            </div>
          </AnimatedTransition>
        </section>
      </main>
      
      <Footer />
    </>
  );
};

// Sample data for popular guides
const popularGuides = [
  {
    title: "Training Your Chatbot with Custom Responses",
    category: "Customization",
    link: "/guides/custom-responses"
  },
  {
    title: "Integrating with CRM Systems",
    category: "Integration",
    link: "/guides/crm-integration"
  },
  {
    title: "Optimizing Lead Capture with Your Chatbot",
    category: "Lead Generation",
    link: "/guides/lead-optimization"
  },
  {
    title: "Understanding Analytics & Performance Metrics",
    category: "Analytics",
    link: "/guides/analytics-guide"
  },
  {
    title: "Managing Your Team's Access & Permissions",
    category: "Team Management",
    link: "/guides/team-access"
  }
];

export default Guides;
