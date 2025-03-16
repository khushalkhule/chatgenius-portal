
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { knowledgeBaseService } from "@/services/knowledgeBaseService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface KnowledgeBaseAnalyticsProps {
  chatbotId: string;
}

const KnowledgeBaseAnalytics: React.FC<KnowledgeBaseAnalyticsProps> = ({ chatbotId }) => {
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeBases();
  }, [chatbotId]);

  const fetchKnowledgeBases = async () => {
    setLoading(true);
    try {
      const data = await knowledgeBaseService.getKnowledgeBasesByChatbotId(chatbotId);
      setKnowledgeBases(data);
    } catch (error) {
      console.error("Error fetching knowledge bases:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for the charts
  const typeData = [
    { name: "Website", value: knowledgeBases.filter(kb => kb.type === "website").length },
    { name: "File", value: knowledgeBases.filter(kb => kb.type === "file").length },
    { name: "Text", value: knowledgeBases.filter(kb => kb.type === "text").length },
    { name: "FAQ", value: knowledgeBases.filter(kb => kb.type === "faq").length },
  ].filter(item => item.value > 0);

  const statusData = [
    { name: "Active", value: knowledgeBases.filter(kb => kb.status === "active").length },
    { name: "Processing", value: knowledgeBases.filter(kb => kb.status === "processing").length },
    { name: "Error", value: knowledgeBases.filter(kb => kb.status === "error").length },
    { name: "Inactive", value: knowledgeBases.filter(kb => kb.status === "inactive").length },
  ].filter(item => item.value > 0);

  // Count URLs per knowledge base for website type
  const urlsData = knowledgeBases
    .filter(kb => kb.type === "website" && kb.urls && kb.urls.length > 0)
    .map(kb => ({
      name: kb.name.length > 15 ? kb.name.substring(0, 15) + "..." : kb.name,
      urlCount: kb.urls.length,
    }))
    .sort((a, b) => b.urlCount - a.urlCount)
    .slice(0, 10);

  // Count FAQs per knowledge base for FAQ type
  const faqsData = knowledgeBases
    .filter(kb => kb.type === "faq" && kb.faqs && kb.faqs.length > 0)
    .map(kb => ({
      name: kb.name.length > 15 ? kb.name.substring(0, 15) + "..." : kb.name,
      faqCount: kb.faqs.length,
    }))
    .sort((a, b) => b.faqCount - a.faqCount)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Base Analytics</CardTitle>
          <CardDescription>
            Insights about your chatbot's knowledge sources
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading analytics...</p>
            </div>
          ) : knowledgeBases.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <p>No knowledge bases found. Add some to see analytics.</p>
            </div>
          ) : (
            <Tabs defaultValue="overview">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="urls">URLs</TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid md:grid-cols-2 gap-8 my-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">Knowledge Base Types</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={typeData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {typeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-center">Knowledge Base Status</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Summary</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Total Knowledge Bases: <span className="font-semibold">{knowledgeBases.length}</span></li>
                    <li>
                      Types: {typeData.map(t => `${t.name}: ${t.value}`).join(", ")}
                    </li>
                    <li>
                      Status: {statusData.map(s => `${s.name}: ${s.value}`).join(", ")}
                    </li>
                    <li>Total URLs: <span className="font-semibold">
                      {knowledgeBases.reduce((sum, kb) => sum + (kb.urls?.length || 0), 0)}
                    </span></li>
                    <li>Total FAQs: <span className="font-semibold">
                      {knowledgeBases.reduce((sum, kb) => sum + (kb.faqs?.length || 0), 0)}
                    </span></li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="urls">
                <div className="h-96">
                  {urlsData.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p>No URL data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={urlsData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="urlCount" name="URL Count" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="faqs">
                <div className="h-96">
                  {faqsData.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <p>No FAQ data available</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={faqsData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="faqCount" name="FAQ Count" fill="#00C49F" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KnowledgeBaseAnalytics;
