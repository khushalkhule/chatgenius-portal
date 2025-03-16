
import React from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { useChatbots } from "@/contexts/ChatbotContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KnowledgeBaseManager from "@/components/knowledge-base/KnowledgeBaseManager";
import KnowledgeBaseAnalytics from "@/components/knowledge-base/KnowledgeBaseAnalytics";

const KnowledgeBasePage = () => {
  const { id } = useParams<{ id: string }>();
  const { getChatbot } = useChatbots();
  
  const chatbot = getChatbot(id || "");
  
  if (!chatbot) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Chatbot not found</h1>
          <p>The chatbot you are looking for does not exist or you don't have access to it.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Knowledge Base | {chatbot.name}</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Knowledge Base Management</h1>
          <p className="text-muted-foreground">
            Manage the knowledge sources that power your chatbot {chatbot.name}
          </p>
        </div>
        
        <Tabs defaultValue="manage" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="manage">Manage Sources</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <KnowledgeBaseManager chatbotId={chatbot.id} />
          </TabsContent>
          
          <TabsContent value="analytics">
            <KnowledgeBaseAnalytics chatbotId={chatbot.id} />
          </TabsContent>
        </Tabs>
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
