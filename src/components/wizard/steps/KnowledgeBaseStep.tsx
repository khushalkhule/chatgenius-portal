
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Globe, List, MessageSquare, Plus, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z.discriminatedUnion("sourceType", [
  websiteSchema,
  fileSchema,
  textSchema,
  faqSchema,
]);

type FormValues = z.infer<typeof formSchema>;

interface KnowledgeBaseStepProps {
  onNext: (data: FormValues) => void;
  onBack: () => void;
  initialData?: FormValues;
}

const KnowledgeBaseStep = ({ onNext, onBack, initialData }: KnowledgeBaseStepProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      sourceType: "website",
      url: "",
    },
  });

  const sourceType = form.watch("sourceType");

  const handleSubmit = (data: FormValues) => {
    onNext(data);
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
              defaultValue="website" 
              value={sourceType}
              onValueChange={(value) => form.setValue("sourceType", value as any)}
            >
              <TabsList className="grid grid-cols-4 mb-6">
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
