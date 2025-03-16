
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Brain, Cpu, Sparkles, Zap } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  model: z.enum(["gpt-4o-mini", "gpt-4o", "gpt-3.5-turbo", "claude-3-opus", "claude-3-sonnet"]),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().min(100).max(4000),
  apiKey: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AIModelStepProps {
  onNext: (data: FormValues) => void;
  onBack: () => void;
  initialData?: FormValues;
}

const AIModelStep = ({ onNext, onBack, initialData }: AIModelStepProps) => {
  const [adminApiKey, setAdminApiKey] = useState<string | null>(null);

  useEffect(() => {
    // Try to get admin API key from localStorage (set by admin dashboard)
    const storedKey = localStorage.getItem("adminOpenAIKey");
    
    // If no key in localStorage, use the default one
    const defaultKey = "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";
    
    setAdminApiKey(storedKey || defaultKey);
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 2000,
      apiKey: "", // This will be set by the admin API key
    },
  });

  const handleSubmit = (data: FormValues) => {
    // Always use the admin API key, not exposing it to the client
    data.apiKey = adminApiKey || "";
    onNext(data);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Model Selection</CardTitle>
        <CardDescription>
          Choose and configure the AI model that will power your chatbot.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Model</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-3"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gpt-4o-mini" />
                        </FormControl>
                        <div className="flex flex-1 items-center justify-between p-4 border rounded-md">
                          <div>
                            <FormLabel className="text-base font-medium">GPT-4o Mini</FormLabel>
                            <FormDescription>
                              Fast and cost-effective model for most chatbot use cases.
                            </FormDescription>
                          </div>
                          <Cpu className="h-8 w-8 text-muted-foreground" />
                        </div>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gpt-4o" />
                        </FormControl>
                        <div className="flex flex-1 items-center justify-between p-4 border rounded-md">
                          <div>
                            <FormLabel className="text-base font-medium">GPT-4o</FormLabel>
                            <FormDescription>
                              More powerful model for complex conversations and reasoning.
                            </FormDescription>
                          </div>
                          <Sparkles className="h-8 w-8 text-yellow-500" />
                        </div>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="gpt-3.5-turbo" />
                        </FormControl>
                        <div className="flex flex-1 items-center justify-between p-4 border rounded-md">
                          <div>
                            <FormLabel className="text-base font-medium">GPT-3.5 Turbo</FormLabel>
                            <FormDescription>
                              Balanced performance and efficiency for general chatbot tasks.
                            </FormDescription>
                          </div>
                          <Zap className="h-8 w-8 text-blue-500" />
                        </div>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="claude-3-opus" />
                        </FormControl>
                        <div className="flex flex-1 items-center justify-between p-4 border rounded-md">
                          <div>
                            <FormLabel className="text-base font-medium">Claude 3 Opus</FormLabel>
                            <FormDescription>
                              Anthropic's most capable model for complex tasks and reasoning.
                            </FormDescription>
                          </div>
                          <Brain className="h-8 w-8 text-purple-500" />
                        </div>
                      </FormItem>
                      
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="claude-3-sonnet" />
                        </FormControl>
                        <div className="flex flex-1 items-center justify-between p-4 border rounded-md">
                          <div>
                            <FormLabel className="text-base font-medium">Claude 3 Sonnet</FormLabel>
                            <FormDescription>
                              Fast and effective model from Anthropic for most use cases.
                            </FormDescription>
                          </div>
                          <Brain className="h-8 w-8 text-indigo-500" />
                        </div>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature: {field.value.toFixed(1)}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>More predictable</span>
                    <span>More creative</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxTokens"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Response Length: {field.value} tokens</FormLabel>
                  <FormControl>
                    <Slider
                      min={100}
                      max={4000}
                      step={100}
                      value={[field.value]}
                      onValueChange={(values) => field.onChange(values[0])}
                    />
                  </FormControl>
                  <FormDescription className="flex justify-between">
                    <span>Shorter responses</span>
                    <span>Longer responses</span>
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Next: Design</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AIModelStep;
