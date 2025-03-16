
import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { MessageSquare, Plus, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useChatbots } from "@/contexts/ChatbotContext";

const Dashboard = () => {
  const { chatbots, isLoading, error } = useChatbots();
  
  // Calculate totals for statistics
  const totalConversations = chatbots.reduce((sum, bot) => sum + bot.conversations, 0);
  const totalLeads = chatbots.reduce((sum, bot) => sum + bot.leads, 0);

  return (
    <DashboardLayout>
      <AnimatedTransition animation="fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your chatbots.
            </p>
          </div>
          <Button asChild>
            <Link to="/create-chatbot">
              <Plus className="h-4 w-4 mr-2" /> Create Chatbot
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <AnimatedTransition animation="slide-up" delay={100}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Chatbots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isLoading ? "-" : chatbots.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isLoading ? "Loading..." : (chatbots.length > 0 ? "Manage your chatbots below" : "Create your first chatbot")}
                </p>
              </CardContent>
            </Card>
          </AnimatedTransition>

          <AnimatedTransition animation="slide-up" delay={200}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Conversations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isLoading ? "-" : totalConversations.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isLoading ? "Loading..." : "Across all chatbots"}
                </p>
              </CardContent>
            </Card>
          </AnimatedTransition>

          <AnimatedTransition animation="slide-up" delay={300}>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Leads Captured
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{isLoading ? "-" : totalLeads.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {isLoading ? "Loading..." : "Across all chatbots"}
                </p>
              </CardContent>
            </Card>
          </AnimatedTransition>
        </div>

        <AnimatedTransition animation="slide-up" delay={400}>
          <Tabs defaultValue="chatbots">
            <TabsList className="mb-4">
              <TabsTrigger value="chatbots">Your Chatbots</TabsTrigger>
              <TabsTrigger value="team">Team Members</TabsTrigger>
            </TabsList>

            <TabsContent value="chatbots">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-2">
                        <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="h-4 bg-muted rounded w-full mt-4 mb-4"></div>
                        <div className="h-8 bg-muted rounded w-full mt-4"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Failed to load chatbots. Please try again.</p>
                  <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                    Retry
                  </Button>
                </div>
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
                            <Link to={`/chatbot/${chatbot.id}`}>Manage</Link>
                          </Button>
                          <Button variant="ghost" size="sm">
                            Preview
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
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
            </TabsContent>

            <TabsContent value="team">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "John Doe",
                    email: "john.doe@example.com",
                    role: "Owner",
                    avatar: "JD",
                  },
                  {
                    name: "Jane Smith",
                    email: "jane.smith@example.com",
                    role: "Admin",
                    avatar: "JS",
                  },
                  {
                    name: "Bob Johnson",
                    email: "bob.johnson@example.com",
                    role: "Member",
                    avatar: "BJ",
                  },
                  {
                    isPlaceholder: true,
                  },
                ].map((member) =>
                  member.isPlaceholder ? (
                    <Card key="new" className="border-dashed">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[160px]">
                        <Button variant="ghost" asChild className="h-auto p-4">
                          <Link to="/team/invite" className="text-center">
                            <Plus className="h-10 w-10 mb-2 text-muted-foreground" />
                            <span className="block font-medium">Invite Team Member</span>
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card key={member.name}>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                            {member.avatar}
                          </div>
                          <div>
                            <h3 className="font-medium">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                            <div className="mt-1 inline-block px-2 py-1 text-xs rounded-full bg-secondary text-foreground">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </TabsContent>
          </Tabs>
        </AnimatedTransition>
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default Dashboard;
