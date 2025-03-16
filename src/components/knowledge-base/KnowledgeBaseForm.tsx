
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FileText, Globe, List, MessageSquare, Plus, Trash, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

const baseSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  type: z.enum(["website", "file", "text", "faq"]),
  status: z.enum(["active", "processing", "error", "inactive"]).default("active"),
});

const websiteSchema = baseSchema.extend({
  type: z.literal("website"),
  urls: z.array(
    z.object({
      url: z.string().url("Please enter a valid URL"),
    })
  ).min(1, "At least one URL is required"),
});

const fileSchema = baseSchema.extend({
  type: z.literal("file"),
  filePath: z.string().min(1, "File path is required"),
});

const textSchema = baseSchema.extend({
  type: z.literal("text"),
  content: z.string().min(10, "Content must be at least 10 characters"),
});

const faqSchema = baseSchema.extend({
  type: z.literal("faq"),
  faqs: z.array(
    z.object({
      question: z.string().min(3, "Question must be at least 3 characters"),
      answer: z.string().min(3, "Answer must be at least 3 characters"),
    })
  ).min(1, "At least one FAQ is required"),
});

const formSchema = z.discriminatedUnion("type", [
  websiteSchema,
  fileSchema,
  textSchema,
  faqSchema,
]);

type FormValues = z.infer<typeof formSchema>;

interface KnowledgeBaseFormProps {
  initialData?: any;
  onSubmit: (data: FormValues) => void;
  onCancel: () => void;
}

const KnowledgeBaseForm: React.FC<KnowledgeBaseFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? {
      ...initialData,
      // Convert urls and faqs arrays to the expected format
      urls: initialData.urls?.map((u: any) => ({ url: u.url })) || [],
      faqs: initialData.faqs?.map((f: any) => ({ question: f.question, answer: f.answer })) || [],
    } : {
      name: "",
      type: "website",
      status: "active",
      urls: [{ url: "" }],
    },
  });

  const type = form.watch("type");

  // Add a new URL input
  const addUrl = () => {
    const currentUrls = form.getValues("urls") || [];
    form.setValue("urls", [...currentUrls, { url: "" }], { shouldValidate: true });
  };

  // Remove a URL input
  const removeUrl = (index: number) => {
    const currentUrls = form.getValues("urls") || [];
    if (currentUrls.length > 1) {
      form.setValue(
        "urls",
        currentUrls.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    }
  };

  // Add a new FAQ input
  const addFaq = () => {
    const currentFaqs = form.getValues("faqs") || [];
    form.setValue("faqs", [...currentFaqs, { question: "", answer: "" }], { shouldValidate: true });
  };

  // Remove a FAQ input
  const removeFaq = (index: number) => {
    const currentFaqs = form.getValues("faqs") || [];
    if (currentFaqs.length > 1) {
      form.setValue(
        "faqs",
        currentFaqs.filter((_, i) => i !== index),
        { shouldValidate: true }
      );
    }
  };

  // Handle type change
  const handleTypeChange = (newType: string) => {
    if (newType === "website") {
      form.setValue("urls", [{ url: "" }]);
    } else if (newType === "faq") {
      form.setValue("faqs", [{ question: "", answer: "" }]);
    } else if (newType === "text") {
      form.setValue("content", "");
    } else if (newType === "file") {
      form.setValue("filePath", "");
    }
    form.setValue("type", newType as any);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Knowledge Base Name" {...field} />
              </FormControl>
              <FormDescription>
                A descriptive name for your knowledge base
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Tabs 
          defaultValue={type} 
          value={type}
          onValueChange={handleTypeChange}
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
            <div className="space-y-4">
              {form.watch("urls")?.map((_, index) => (
                <FormField
                  key={index}
                  control={form.control}
                  name={`urls.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeUrl(index)}
                          disabled={form.watch("urls")?.length <= 1}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addUrl}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add URL
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="file">
            <FormField
              control={form.control}
              name="filePath"
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
            <div className="space-y-4">
              {form.watch("faqs")?.map((_, index) => (
                <div key={index} className="border p-4 rounded-md relative">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFaq(index)}
                    disabled={form.watch("faqs")?.length <= 1}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                  
                  <FormField
                    control={form.control}
                    name={`faqs.${index}.question`}
                    render={({ field }) => (
                      <FormItem className="mb-4">
                        <FormLabel>Question {index + 1}</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter question" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`faqs.${index}.answer`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Answer {index + 1}</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter answer"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={addFaq}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" /> Add FAQ
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  {...field}
                >
                  <option value="active">Active</option>
                  <option value="processing">Processing</option>
                  <option value="error">Error</option>
                  <option value="inactive">Inactive</option>
                </select>
              </FormControl>
              <FormDescription>
                The current status of this knowledge base
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Knowledge Base</Button>
        </div>
      </form>
    </Form>
  );
};

export default KnowledgeBaseForm;
