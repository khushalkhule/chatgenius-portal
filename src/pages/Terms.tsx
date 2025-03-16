
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Terms of Service | ChatSaaS</title>
      </Helmet>
      
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Breadcrumb className="mb-8">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Terms of Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <AnimatedTransition animation="fade-in">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
              <p className="text-muted-foreground mb-4">Last updated: June 1, 2025</p>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  Please read these Terms of Service ("Terms") carefully before using the ChatSaaS website and services.
                </p>
                
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.
                </p>
                
                <h2>2. Description of Service</h2>
                <p>
                  ChatSaaS provides an AI chatbot platform that allows businesses to create, customize, and deploy AI-powered chatbots on their websites for customer engagement and lead generation.
                </p>
                
                <h2>3. Account Registration</h2>
                <p>
                  To use certain features of the Service, you must register for an account. You agree to provide accurate information during the registration process and to keep your account information updated.
                </p>
                
                <h2>4. Subscription and Payment</h2>
                <p>
                  The Service offers subscription-based plans. Payment terms are specified during the purchase process. Subscription fees are non-refundable except as required by law or as explicitly stated in these Terms.
                </p>
                
                <h2>5. User Conduct</h2>
                <p>
                  You agree not to use the Service to:
                </p>
                <ul>
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Distribute malware or harmful code</li>
                  <li>Attempt to gain unauthorized access to any part of the Service</li>
                  <li>Use the Service for any illegal or unauthorized purpose</li>
                </ul>
                
                <h2>6. Data and Privacy</h2>
                <p>
                  Our Privacy Policy, which is incorporated into these Terms, explains how we collect, use, and protect your information. By using our Service, you consent to the collection and use of information as detailed in our Privacy Policy.
                </p>
                
                <h2>7. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by ChatSaaS and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                
                <h2>8. Termination</h2>
                <p>
                  We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including without limitation if you breach the Terms.
                </p>
                
                <h2>9. Limitation of Liability</h2>
                <p>
                  In no event shall ChatSaaS, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                
                <h2>10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>
                
                <h2>11. Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <p>
                  Email: legal@chatsaas.com<br />
                  Address: 123 AI Boulevard, Tech City, TC 12345
                </p>
              </div>
            </div>
          </AnimatedTransition>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default Terms;
