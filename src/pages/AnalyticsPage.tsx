
import { Helmet } from "react-helmet";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AnimatedTransition from "@/components/ui-custom/AnimatedTransition";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useChatbots } from "@/contexts/ChatbotContext";

const AnalyticsPage = () => {
  const { chatbots } = useChatbots();
  
  // Sample data for charts
  const conversationData = [
    { name: "Mon", count: 34 },
    { name: "Tue", count: 42 },
    { name: "Wed", count: 57 },
    { name: "Thu", count: 63 },
    { name: "Fri", count: 51 },
    { name: "Sat", count: 27 },
    { name: "Sun", count: 23 },
  ];
  
  const leadData = [
    { name: "Mon", count: 5 },
    { name: "Tue", count: 8 },
    { name: "Wed", count: 12 },
    { name: "Thu", count: 15 },
    { name: "Fri", count: 11 },
    { name: "Sat", count: 4 },
    { name: "Sun", count: 2 },
  ];
  
  const chatbotUsageData = chatbots.map(chatbot => ({
    name: chatbot.name,
    value: chatbot.conversations
  }));
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Total counts
  const totalConversations = chatbots.reduce((sum, chatbot) => sum + chatbot.conversations, 0);
  const totalLeads = chatbots.reduce((sum, chatbot) => sum + chatbot.leads, 0);
  
  return (
    <DashboardLayout>
      <Helmet>
        <title>Analytics | AI Chatbot Platform</title>
      </Helmet>
      
      <AnimatedTransition animation="fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">
            Monitor your chatbots' performance and lead generation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
              <CardDescription>Overall engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalConversations.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <CardDescription>Converted contacts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalLeads.toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <CardDescription>Leads / Conversations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {totalConversations > 0 
                  ? `${((totalLeads / totalConversations) * 100).toFixed(1)}%` 
                  : '0%'}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="conversations">
          <TabsList className="mb-4">
            <TabsTrigger value="conversations">Conversations</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
          </TabsList>
          
          <TabsContent value="conversations">
            <Card>
              <CardHeader>
                <CardTitle>Conversation Trends</CardTitle>
                <CardDescription>Daily conversation count over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={conversationData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" name="Conversations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Lead Generation</CardTitle>
                <CardDescription>Daily leads collected over the last week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={leadData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#10b981" name="Leads" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="chatbots">
            <Card>
              <CardHeader>
                <CardTitle>Chatbot Usage Distribution</CardTitle>
                <CardDescription>Proportion of conversations by chatbot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {chatbots.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chatbotUsageData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          nameKey="name"
                          label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {chatbotUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground">No chatbot data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </AnimatedTransition>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
