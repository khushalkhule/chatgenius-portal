
import { Helmet } from "react-helmet";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useChatbots } from "@/contexts/ChatbotContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import ChatInterface from "@/components/chat/ChatInterface";
import { ChevronLeft, Code, Globe, MessageSquare, Pencil, Settings, Trash } from "lucide-react";

const ChatbotManager = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getChatbot, updateChatbot, deleteChatbot } = useChatbots();
  
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
  
  const toggleStatus = () => {
    const newStatus = chatbot.status === "active" ? "paused" : "active";
    updateChatbot(chatbot.id, { status: newStatus });
    toast.success(`Chatbot ${newStatus === "active" ? "activated" : "paused"} successfully`);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this chatbot? This action cannot be undone.")) {
      deleteChatbot(chatbot.id);
      toast.success("Chatbot deleted successfully");
      navigate("/dashboard/chatbots");
    }
  };
  
  const getEmbedCode = () => {
    if (!chatbot.basicInfo?.websiteUrl) {
      toast.error("Website URL is not configured. Please update your chatbot.");
      return;
    }
    
    const embedCode = `<script>
  window.chatbotConfig = {
    id: "${chatbot.id}",
    name: "${chatbot.name}",
    position: "right"
  };
</script>
<script src="https://your-chatbot-service.com/embed.js" async></script>`;
    
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied to clipboard");
  };
  
  // Prepare initial messages if any
  let initialMessages = [];
  if (chatbot.design?.initialMessage) {
    initialMessages.push({
      id: "initial",
      content: chatbot.design.initialMessage || "Hi there! How can I help you today?",
      isBot: true,
      timestamp: new Date()
    });
  }
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Manage: {chatbot.name} | AI Chatbot Platform</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <div className="mb-6">
          <Link to="/dashboard/chatbots" className="text-sm text-muted-foreground flex items-center mb-4 hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to chatbots
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                {chatbot.name}
                <Link to={`/chatbot/${chatbot.id}/edit`} className="ml-2 text-muted-foreground hover:text-primary transition-colors">
                  <Pencil className="h-4 w-4" />
                </Link>
              </h1>
              <p className="text-muted-foreground">
                {chatbot.description || "No description"}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="chatbot-status"
                  checked={chatbot.status === "active"}
                  onCheckedChange={toggleStatus}
                />
                <label htmlFor="chatbot-status" className="text-sm">
                  {chatbot.status === "active" ? "Active" : "Paused"}
                </label>
              </div>
              
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="embed">Embed Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preview" className="flex justify-center">
            <div className="w-full max-w-md">
              <ChatInterface 
                botName={chatbot.name}
                placeholder={chatbot.design?.placeholder || "Type your message..."}
                initialMessages={initialMessages}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Settings</CardTitle>
                <CardDescription>
                  Manage your chatbot's configuration and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Name</h4>
                      <p className="text-sm text-muted-foreground">{chatbot.basicInfo?.name || chatbot.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Team</h4>
                      <p className="text-sm text-muted-foreground">{chatbot.basicInfo?.team || "Not specified"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Website URL</h4>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Globe className="h-3 w-3 mr-1" /> 
                        {chatbot.basicInfo?.websiteUrl || "Not specified"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Created On</h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(chatbot.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">AI Model</h3>
                  <div>
                    <h4 className="text-sm font-medium mb-1">Selected Model</h4>
                    <p className="text-sm text-muted-foreground">
                      {chatbot.aiModel?.model || "Default AI model"}
                    </p>
                  </div>
                </div>
                
                <Button asChild>
                  <Link to={`/chatbot/${chatbot.id}/edit`}>
                    <Settings className="h-4 w-4 mr-2" /> Edit Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="embed">
            <Card>
              <CardHeader>
                <CardTitle>Embed on Your Website</CardTitle>
                <CardDescription>
                  Add this chatbot to your website by copying and pasting the code below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-md font-mono text-xs mb-4 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
{`<script>
  window.chatbotConfig = {
    id: "${chatbot.id}",
    name: "${chatbot.name}",
    position: "right"
  };
</script>
<script src="https://your-chatbot-service.com/embed.js" async></script>`}
                  </pre>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <Button onClick={getEmbedCode} className="flex-1">
                    <Code className="h-4 w-4 mr-2" /> Copy Embed Code
                  </Button>
                  
                  <Button variant="outline" asChild className="flex-1">
                    <Link to={`/chatbot/${chatbot.id}/preview`} target="_blank" rel="noopener noreferrer">
                      <MessageSquare className="h-4 w-4 mr-2" /> Open Test Page
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default ChatbotManager;
