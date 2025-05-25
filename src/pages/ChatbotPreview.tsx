
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useChatbots } from "@/contexts/ChatbotContext";
import ChatInterface from "@/components/chat/ChatInterface";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

const ChatbotPreview = () => {
  const { id } = useParams<{ id: string }>();
  const { getChatbot } = useChatbots();
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const chatbot = getChatbot(id || "");
  
  // Load the API key from localStorage
  useEffect(() => {
    // Try to get admin API key from localStorage
    const storedKey = localStorage.getItem("adminOpenAIKey");
    
    // If no key in localStorage, use the default one
    const defaultKey = "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";
    
    setApiKey(storedKey || defaultKey);
  }, []);
  
  if (!chatbot) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Chatbot not found</h1>
        <Button asChild>
          <Link to="/dashboard/chatbots">Go back to chatbots</Link>
        </Button>
      </div>
    );
  }
  
  // Prepare initial messages if any
  let initialMessages = [];
  if (chatbot.design?.initialMessage) {
    initialMessages.push({
      id: "initial",
      content: chatbot.design.initialMessage,
      isBot: true,
      timestamp: new Date()
    });
  }
  
  // Extract suggested messages from chatbot design
  const suggestedMessages = chatbot.design?.suggestedMessages 
    ? chatbot.design.suggestedMessages.split('\n')
        .map(msg => msg.trim())
        .filter(msg => msg.length > 0)
    : [];
    
  // Determine if lead form should be shown
  const showLeadForm = chatbot.lead_form?.enabled === true;
  
  // Configure the OpenAI API with the correct model and settings
  const aiModelConfig = apiKey ? {
    model: chatbot.ai_model?.model || "gpt-4o-mini",
    temperature: chatbot.ai_model?.temperature || 0.7,
    apiKey: apiKey,
    systemPrompt: chatbot.ai_model?.systemPrompt || `You are an AI assistant representing ${chatbot.name}. Be helpful, concise, and friendly.`
  } : undefined;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Preview: {chatbot.name} | AI Chatbot Platform</title>
      </Helmet>
      
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to={`/chatbot/${chatbot.id}`} className="text-sm flex items-center hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to manager
          </Link>
          <h1 className="text-lg font-medium">{chatbot.name} - Preview</h1>
          <div></div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {!apiKey ? (
            <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-amber-800 mb-2">Loading API key...</p>
            </div>
          ) : (
            <ChatInterface 
              botName={chatbot.name}
              placeholder={chatbot.design?.placeholder || "Type your message..."}
              initialMessages={initialMessages}
              suggestedMessages={suggestedMessages}
              showLeadForm={showLeadForm}
              aiModelConfig={aiModelConfig}
              preserveFormatting={true}
              chatbotId={chatbot.id}
            />
          )}
        </div>
      </main>
      
      <footer className="border-t p-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          <p>This is a preview of how your chatbot will appear on your website.</p>
        </div>
      </footer>
    </div>
  );
};

export default ChatbotPreview;
