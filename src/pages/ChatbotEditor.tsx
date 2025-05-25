
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useChatbots } from "@/contexts/ChatbotContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { ChatbotEditorWizard } from "@/components/wizard/ChatbotEditorWizard";

const ChatbotEditor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChatbot } = useChatbots();
  
  const chatbot = getChatbot(id || "");
  
  if (!chatbot) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <h1 className="text-2xl font-bold mb-4">Chatbot not found</h1>
          <Button asChild>
            <Link to="/dashboard/chatbots">Go back to chatbots</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Edit: {chatbot.name} | AI Chatbot Platform</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <div className="mb-6">
          <Link to={`/chatbot/${chatbot.id}`} className="text-sm text-muted-foreground flex items-center mb-4 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to chatbot manager
          </Link>
          
          <h1 className="text-2xl font-bold">Edit Chatbot: {chatbot.name}</h1>
          <p className="text-muted-foreground">
            Update your chatbot settings and configuration.
          </p>
        </div>
        
        <ChatbotEditorWizard chatbot={chatbot} onClose={() => navigate(`/chatbot/${chatbot.id}`)} />
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default ChatbotEditor;
