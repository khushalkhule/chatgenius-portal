
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InstagramIntegration } from "@/components/integrations/InstagramIntegration";
import { ZapierIntegration } from "@/components/integrations/ZapierIntegration";
import { HubspotIntegration } from "@/components/integrations/HubspotIntegration";

const IntegrationsPage = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Integrations | ChatSaaS</title>
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrations</h1>
          <p className="text-muted-foreground mt-2">
            Connect your ChatSaaS to external platforms and automate responses.
          </p>
        </div>

        <Tabs defaultValue="social" className="space-y-4">
          <TabsList>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="crm">CRM</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>
          <TabsContent value="social" className="space-y-4">
            <InstagramIntegration />
          </TabsContent>
          <TabsContent value="crm" className="space-y-6">
            <ZapierIntegration />
            <HubspotIntegration />
          </TabsContent>
          <TabsContent value="email">
            <div className="rounded-lg border p-8 text-center">
              <h3 className="text-lg font-medium mb-2">Email Integrations</h3>
              <p className="text-muted-foreground">
                Email integrations coming soon. Connect with Gmail, Outlook, and more.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default IntegrationsPage;
