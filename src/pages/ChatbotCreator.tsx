
import { Helmet } from "react-helmet";
import { ChatbotWizard } from "@/components/wizard/ChatbotWizard";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";

const ChatbotCreator = () => {
  return (
    <DashboardLayout>
      <Helmet>
        <title>Create New Chatbot | AI Chatbot Platform</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create New Chatbot</h1>
          <p className="text-muted-foreground">
            Follow the steps below to configure and launch your AI chatbot.
          </p>
        </div>
        
        <ChatbotWizard />
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default ChatbotCreator;
