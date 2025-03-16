
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

const Privacy = () => {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | ChatSaaS</title>
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
                <BreadcrumbPage>Privacy Policy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <AnimatedTransition animation="fade-in">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
              <p className="text-muted-foreground mb-4">Last updated: June 1, 2025</p>
              
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <p>
                  This Privacy Policy describes how ChatSaaS ("we", "our", or "us") collects, uses, and shares your personal information when you use our website and services.
                </p>
                
                <h2>1. Information We Collect</h2>
                
                <h3>1.1 Information You Provide to Us</h3>
                <p>
                  We collect information you provide directly to us when you:
                </p>
                <ul>
                  <li>Create an account or register for our service</li>
                  <li>Configure your chatbot</li>
                  <li>Upload knowledge base documents or content</li>
                  <li>Communicate with us via email or our support channels</li>
                  <li>Complete forms or surveys</li>
                  <li>Make payments or subscribe to our service</li>
                </ul>
                
                <h3>1.2 Information We Collect Automatically</h3>
                <p>
                  When you use our Service, we automatically collect certain information, including:
                </p>
                <ul>
                  <li>Log information (IP address, browser type, pages visited, etc.)</li>
                  <li>Device information (device identifier, operating system, etc.)</li>
                  <li>Usage data (features used, interactions, etc.)</li>
                  <li>Cookie data as described in our Cookie Policy</li>
                </ul>
                
                <h2>2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to:
                </p>
                <ul>
                  <li>Provide, maintain, and improve our services</li>
                  <li>Process transactions and manage your account</li>
                  <li>Send you technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Personalize your experience</li>
                  <li>Monitor and analyze trends and usage</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Protect against harmful or unlawful activity</li>
                </ul>
                
                <h2>3. Sharing of Information</h2>
                <p>
                  We may share your information in the following circumstances:
                </p>
                <ul>
                  <li>With third-party service providers who perform services on our behalf</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights, privacy, safety, or property</li>
                  <li>In connection with a business transfer or transaction</li>
                  <li>With your consent or at your direction</li>
                </ul>
                
                <h2>4. Data Retention</h2>
                <p>
                  We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
                </p>
                
                <h2>5. Your Rights and Choices</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information, including:
                </p>
                <ul>
                  <li>Accessing, correcting, or deleting your personal information</li>
                  <li>Objecting to or restricting certain processing activities</li>
                  <li>Requesting portability of your information</li>
                  <li>Withdrawing consent where processing is based on consent</li>
                </ul>
                
                <h2>6. Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission or storage is 100% secure, and we cannot guarantee absolute security.
                </p>
                
                <h2>7. International Data Transfers</h2>
                <p>
                  Your information may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that differ from those in your country.
                </p>
                
                <h2>8. Children's Privacy</h2>
                <p>
                  Our Service is not directed to children under 16, and we do not knowingly collect personal information from children under 16. If we learn we have collected personal information from a child under 16, we will delete this information.
                </p>
                
                <h2>9. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                
                <h2>10. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at:
                </p>
                <p>
                  Email: privacy@chatsaas.com<br />
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

export default Privacy;
