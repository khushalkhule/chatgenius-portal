
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <Helmet>
        <title>Contact Us | AI Chatbot Platform</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <Button 
          variant="ghost" 
          asChild 
          className="mb-6"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our AI chatbot platform? Get in touch with our team and we'll be happy to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <AnimatedTransition animation="slide-right" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Our Office</h2>
              <p className="text-muted-foreground">
                123 AI Boulevard<br />
                San Francisco, CA 94107<br />
                United States
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">Email Us</h2>
              <p className="text-muted-foreground">
                info@aichatbot.example<br />
                support@aichatbot.example
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">Call Us</h2>
              <p className="text-muted-foreground">
                +1 (555) 123-4567<br />
                Monday to Friday, 9am - 6pm PST
              </p>
            </div>
          </AnimatedTransition>
          
          <AnimatedTransition animation="slide-left" delay={200}>
            <ContactForm />
          </AnimatedTransition>
        </div>
      </AnimatedTransition>
    </div>
  );
};

export default Contact;
