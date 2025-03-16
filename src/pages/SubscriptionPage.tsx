
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ClientSubscriptionDetails } from "@/components/dashboard/SubscriptionDetails";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentMethods from "@/components/payments/PaymentMethods";

const SubscriptionPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Subscription | AI Chatbot Platform</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription and view usage details
        </p>
      </div>
      
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Subscription Details</TabsTrigger>
          <TabsTrigger value="payment">Payment Methods</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details">
          <ClientSubscriptionDetails />
        </TabsContent>
        
        <TabsContent value="payment">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default SubscriptionPage;
