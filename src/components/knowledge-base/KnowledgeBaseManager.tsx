
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PlusCircle, Edit, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { knowledgeBaseService } from "@/services/knowledgeBaseService";
import KnowledgeBaseForm from "./KnowledgeBaseForm";

interface KnowledgeBaseManagerProps {
  chatbotId: string;
  onKnowledgeBaseChange?: () => void;
}

const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({ 
  chatbotId,
  onKnowledgeBaseChange
}) => {
  const [knowledgeBases, setKnowledgeBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingKnowledgeBase, setEditingKnowledgeBase] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");

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
      toast.error("Failed to load knowledge bases");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (formData: any) => {
    try {
      await knowledgeBaseService.createKnowledgeBase({
        ...formData,
        chatbotId
      });
      toast.success("Knowledge base created successfully");
      setShowForm(false);
      fetchKnowledgeBases();
      if (onKnowledgeBaseChange) onKnowledgeBaseChange();
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      toast.error("Failed to create knowledge base");
    }
  };

  const handleUpdate = async (id: string, formData: any) => {
    try {
      await knowledgeBaseService.updateKnowledgeBase(id, formData);
      toast.success("Knowledge base updated successfully");
      setEditingKnowledgeBase(null);
      fetchKnowledgeBases();
      if (onKnowledgeBaseChange) onKnowledgeBaseChange();
    } catch (error) {
      console.error("Error updating knowledge base:", error);
      toast.error("Failed to update knowledge base");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this knowledge base?")) return;
    
    try {
      await knowledgeBaseService.deleteKnowledgeBase(id);
      toast.success("Knowledge base deleted successfully");
      fetchKnowledgeBases();
      if (onKnowledgeBaseChange) onKnowledgeBaseChange();
    } catch (error) {
      console.error("Error deleting knowledge base:", error);
      toast.error("Failed to delete knowledge base");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "processing": return "bg-yellow-500";
      case "error": return "bg-red-500";
      case "inactive": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "website": return "🌐";
      case "file": return "📄";
      case "text": return "📝";
      case "faq": return "❓";
      default: return "📚";
    }
  };

  const filteredKnowledgeBases = activeTab === "all" 
    ? knowledgeBases 
    : knowledgeBases.filter(kb => kb.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Knowledge Bases</h2>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchKnowledgeBases}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => {
              setEditingKnowledgeBase(null);
              setShowForm(true);
            }}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Knowledge Base
          </Button>
        </div>
      </div>

      {showForm && !editingKnowledgeBase && (
        <Card>
          <CardHeader>
            <CardTitle>Add Knowledge Base</CardTitle>
            <CardDescription>
              Create a new knowledge source for your chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeBaseForm 
              onSubmit={handleCreate} 
              onCancel={() => setShowForm(false)} 
            />
          </CardContent>
        </Card>
      )}

      {editingKnowledgeBase && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Knowledge Base</CardTitle>
            <CardDescription>
              Update this knowledge source
            </CardDescription>
          </CardHeader>
          <CardContent>
            <KnowledgeBaseForm 
              initialData={editingKnowledgeBase}
              onSubmit={(data) => handleUpdate(editingKnowledgeBase.id, data)}
              onCancel={() => setEditingKnowledgeBase(null)}
            />
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="website">Website</TabsTrigger>
          <TabsTrigger value="file">File</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {loading ? (
            <div className="flex justify-center p-8">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredKnowledgeBases.length === 0 ? (
            <div className="text-center p-8 border rounded-lg bg-muted/50">
              <p className="text-muted-foreground">No knowledge bases found. Add one to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredKnowledgeBases.map((kb) => (
                <Card key={kb.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <span>{getTypeIcon(kb.type)}</span>
                          {kb.name}
                        </CardTitle>
                        <CardDescription>{kb.type.charAt(0).toUpperCase() + kb.type.slice(1)}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(kb.status)}>
                        {kb.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {kb.type === "website" && kb.urls && kb.urls.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">URLs ({kb.urls.length}):</p>
                        <ul className="list-disc pl-5 text-muted-foreground text-xs overflow-hidden max-h-16">
                          {kb.urls.map((url: any) => (
                            <li key={url.id} className="truncate">
                              {url.url}
                              <span className="ml-2 text-xs">
                                ({url.status})
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {kb.type === "faq" && kb.faqs && kb.faqs.length > 0 && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">FAQs ({kb.faqs.length}):</p>
                        <ul className="list-disc pl-5 text-muted-foreground text-xs overflow-hidden max-h-16">
                          {kb.faqs.map((faq: any) => (
                            <li key={faq.id} className="truncate">
                              {faq.question}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {kb.type === "text" && kb.content && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">Content:</p>
                        <p className="text-muted-foreground text-xs line-clamp-2">
                          {kb.content}
                        </p>
                      </div>
                    )}
                    {kb.type === "file" && kb.filePath && (
                      <div className="text-sm">
                        <p className="font-medium mb-1">File:</p>
                        <p className="text-muted-foreground text-xs truncate">
                          {kb.filePath}
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2 border-t">
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(kb.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setEditingKnowledgeBase(kb)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(kb.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KnowledgeBaseManager;
