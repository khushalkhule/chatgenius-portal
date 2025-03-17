import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Globe, List, MessageSquare, Plus, Upload, Check, RefreshCw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { knowledgeBaseService } from "@/services/knowledgeBaseService";
import { useChatbots } from "@/contexts/ChatbotContext";

interface KnowledgeBaseUrlLocal {
  id?: string;
  knowledgeBaseId?: string;
  url: string;
  status?: 'pending' | 'crawled' | 'error';
  lastCrawled?: string;
  errorMessage?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface KnowledgeBaseFaqLocal {
  id?: string;
  knowledgeBaseId?: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

const websiteSchema = z.object({
  sourceType: z.literal("website"),
  url: z.string().url("Please enter a valid URL"),
});

const fileSchema = z.object({
  sourceType: z.literal("file"),
  file: z.string().min(1, "Please select a file"),
});

const textSchema = z.object({
  sourceType: z.literal("text"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

const faqSchema = z.object({
  sourceType: z.literal("faq"),
  faqs: z.string().min(10, "FAQs must be at least 10 characters"),
});

const existingSchema = z.object({
  sourceType: z.literal("existing"),
  knowledgeBaseId: z.string().min(1, "Please select a knowledge base"),
});

const formSchema = z.discriminatedUnion("sourceType", [
  websiteSchema,
  fileSchema,
  textSchema,
  faqSchema,
  existingSchema,
]);

type FormValues = z.infer<typeof formSchema>;

interface KnowledgeBaseStepProps {
  onNext: (data: FormValues) => void;
  onBack: () => void;
  initialData?: FormValues;
  chatbotId?: string;
}

const KnowledgeBaseStep = ({ onNext, onBack, initialData, chatbotId }: KnowledgeBaseStepProps) => {
  const [existingKnowledgeBases, setExistingKnowledgeBases] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { getChatbot } = useChatbots();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      sourceType: "website",
      url: "",
    },
  });

  const sourceType = form.watch("sourceType");

  useEffect(() => {
    if (chatbotId) {
      fetchExistingKnowledgeBases();
    }
  }, [chatbotId]);

  const fetchExistingKnowledgeBases = async () => {
    if (!chatbotId) return;
    
    setLoading(true);
    try {
      const data = await knowledgeBaseService.getKnowledgeBasesByChatbotId(chatbotId);
      setExistingKnowledgeBases(data);
    } catch (error) {
      console.error("Error fetching knowledge bases:", error);
      toast.error("Failed to load existing knowledge bases");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: FormValues) => {
    if (data.sourceType === "existing") {
      onNext(data);
      return;
    }
    
    try {
      if (chatbotId) {
        let newKnowledgeBase;
        
        if (data.sourceType === "website") {
          newKnowledgeBase = await knowledgeBaseService.createKnowledgeBase({
            chatbotId,
            name: `Website KB - ${new URL(data.url).hostname}`,
            type: "website",
            status: "active",
            urls: [{
              url: data.url,
            }]
          });
        } else if (data.sourceType === "file") {
          newKnowledgeBase = await knowledgeBaseService.createKnowledgeBase({
            chatbotId,
            name: `File KB - ${data.file}`,
            type: "file",
            status: "active",
            filePath: data.file
          });
        } else if (data.sourceType === "text") {
          newKnowledgeBase = await knowledgeBaseService.createKnowledgeBase({
            chatbotId,
            name: `Text KB - ${new Date().toLocaleDateString()}`,
            type: "text",
            status: "active",
            content: data.content
          });
        } else if (data.sourceType === "faq") {
          let faqsData = [];
          try {
            const parsedFaqs = JSON.parse(data.faqs);
            
            faqsData = parsedFaqs.map((faq: any) => ({
              question: faq.question,
              answer: faq.answer
            }));
          } catch (e) {
            toast.error("Invalid FAQ format. Please use valid JSON.");
            return;
          }
          
          newKnowledgeBase = await knowledgeBaseService.createKnowledgeBase({
            chatbotId,
            name: `FAQ KB - ${new Date().toLocaleDateString()}`,
            type: "faq",
            status: "active",
            faqs: faqsData
          });
        }
        
        if (newKnowledgeBase) {
          toast.success("Knowledge base created successfully");
          onNext({
            sourceType: "existing",
            knowledgeBaseId: newKnowledgeBase.id
          });
        }
      } else {
        onNext(data);
      }
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      toast.error("Failed to create knowledge base");
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Knowledge Base Setup</CardTitle>
        <CardDescription>
          Add content sources to power your chatbot's knowledge.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs 
              defaultValue={sourceType} 
              value={sourceType}
              onValueChange={(value) => form.setValue("sourceType", value as any)}
            >
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="website" className="flex gap-2 items-center">
                  <Globe className="h-4 w-4" /> Website
                </TabsTrigger>
                <TabsTrigger value="file" className="flex gap-2 items-center">
                  <FileText className="h-4 w-4" /> File
                </TabsTrigger>
                <TabsTrigger value="text" className="flex gap-2 items-center">
                  <MessageSquare className="h-4 w-4" /> Text
                </TabsTrigger>
                <TabsTrigger value="faq" className="flex gap-2 items-center">
                  <List className="h-4 w-4" /> FAQ
                </TabsTrigger>
                {chatbotId && (
                  <TabsTrigger value="existing" className="flex gap-2 items-center">
                    <Check className="h-4 w-4" /> Existing
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="website">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        We'll crawl this website to extract content for your chatbot.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="file">
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload File</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your file here or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Supports PDF, DOCX, CSV (Max 10MB)
                          </p>
                          <Input
                            type="file"
                            className="hidden"
                            onChange={(e) => field.onChange(e.target.files?.[0]?.name || "")}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="text">
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Direct Text Input</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter knowledge base content here..."
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Directly enter text that your chatbot should know about.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              <TabsContent value="faq">
                <FormField
                  control={form.control}
                  name="faqs"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>FAQ Pairs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder='[{"question": "What is your return policy?", "answer": "Our return policy allows returns within 30 days of purchase."}]'
                          className="min-h-[200px] font-mono text-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter FAQ pairs in JSON format as shown in the example.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {chatbotId && (
                <TabsContent value="existing">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Select Existing Knowledge Base</FormLabel>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={fetchExistingKnowledgeBases}
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                      </Button>
                    </div>
                    
                    {loading ? (
                      <div className="flex justify-center p-8">
                        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
                      </div>
                    ) : existingKnowledgeBases.length === 0 ? (
                      <div className="text-center p-8 border rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">No knowledge bases found. Create a new one using the other tabs.</p>
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="knowledgeBaseId"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="space-y-4"
                              >
                                {existingKnowledgeBases.map((kb) => (
                                  <div key={kb.id} className="flex items-center space-x-2 border p-4 rounded-lg hover:bg-muted/50 cursor-pointer">
                                    <RadioGroupItem value={kb.id} id={kb.id} />
                                    <div className="grid gap-1">
                                      <label
                                        htmlFor={kb.id}
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-2"
                                      >
                                        {kb.name}
                                        <span className="text-xs px-2 py-1 rounded-full bg-muted">
                                          {kb.type}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                          kb.status === "active" ? "bg-green-100 text-green-800" :
                                          kb.status === "processing" ? "bg-yellow-100 text-yellow-800" :
                                          kb.status === "error" ? "bg-red-100 text-red-800" :
                                          "bg-gray-100 text-gray-800"
                                        }`}>
                                          {kb.status}
                                        </span>
                                      </label>
                                      <p className="text-sm text-muted-foreground">
                                        {kb.type === "website" && kb.urls && kb.urls.length > 0 && 
                                          `${kb.urls.length} URL${kb.urls.length !== 1 ? 's' : ''}`}
                                        {kb.type === "faq" && kb.faqs && kb.faqs.length > 0 && 
                                          `${kb.faqs.length} FAQ${kb.faqs.length !== 1 ? 's' : ''}`}
                                        {kb.type === "text" && 
                                          `Text content: ${kb.content?.substring(0, 50)}${kb.content?.length > 50 ? '...' : ''}`}
                                        {kb.type === "file" && `File: ${kb.filePath}`}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Next: AI Model</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default KnowledgeBaseStep;
