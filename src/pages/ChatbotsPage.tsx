
import { Link } from "react-router-dom";
import { Plus, MessageSquare, Users, Play, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { useChatbots } from "@/contexts/ChatbotContext";

const ChatbotsPage = () => {
  const { chatbots } = useChatbots();

  return (
    <DashboardLayout>
      <AnimatedTransition animation="fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Chatbots</h1>
            <p className="text-muted-foreground">
              Manage and monitor all your chatbots
            </p>
          </div>
          <Button asChild>
            <Link to="/create-chatbot">
              <Plus className="h-4 w-4 mr-2" /> Create Chatbot
            </Link>
          </Button>
        </div>

        {chatbots.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-12 text-center">
            <div className="rounded-full bg-primary/10 p-6 mb-4">
              <MessageSquare className="h-10 w-10 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No chatbots yet</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Create your first AI chatbot to start engaging with your visitors and capturing leads.
            </p>
            <Button asChild size="lg">
              <Link to="/create-chatbot">
                <Plus className="h-4 w-4 mr-2" /> Create Your First Chatbot
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot) => (
              <Card key={chatbot.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{chatbot.name}</CardTitle>
                      <CardDescription>{chatbot.description || "No description"}</CardDescription>
                    </div>
                    <div
                      className={`px-2 py-1 text-xs rounded-full ${
                        chatbot.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                      }`}
                    >
                      {chatbot.status === "active" ? "Active" : "Paused"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="grid grid-cols-2 gap-4 my-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">{chatbot.conversations} conversations</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div className="text-sm">{chatbot.leads} leads</div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/chatbot/${chatbot.id}`}>
                        <Settings className="h-4 w-4 mr-2" /> Manage
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/chatbot/${chatbot.id}/preview`}>
                        <Play className="h-4 w-4 mr-2" /> Preview
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
              
            {/* Add new chatbot card */}
            <Card key="new" className="border-dashed">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[200px]">
                <Button variant="ghost" asChild className="h-auto p-4">
                  <Link to="/create-chatbot" className="text-center">
                    <Plus className="h-10 w-10 mb-2 text-muted-foreground" />
                    <span className="block font-medium">Create New Chatbot</span>
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default ChatbotsPage;
