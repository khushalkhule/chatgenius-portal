
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Globe } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().max(500, "Description must be less than 500 characters").optional(),
  team: z.string().optional(),
  websiteUrl: z.string().url("Please enter a valid URL").or(z.string().length(0)).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface BasicInfoStepProps {
  data: {
    name: string;
    description?: string;
    team?: string;
    websiteUrl?: string;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

const BasicInfoStep = ({ data, onUpdate, onNext }: BasicInfoStepProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name || "",
      description: data.description || "",
      team: data.team || "",
      websiteUrl: data.websiteUrl || "",
    },
  });

  const handleSubmit = (formData: FormValues) => {
    // Update the wizard data
    onUpdate("name", formData.name);
    if (formData.description) onUpdate("description", formData.description);
    if (formData.team) onUpdate("team", formData.team);
    if (formData.websiteUrl) onUpdate("websiteUrl", formData.websiteUrl);
    
    onNext();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Let's start with the basic details of your chatbot.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chatbot Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Support Assistant" {...field} />
                  </FormControl>
                  <FormDescription>
                    This name will be displayed to users interacting with your chatbot.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what your chatbot will do..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This is for your reference only and won't be displayed to users.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input 
                        placeholder="https://your-website.com" 
                        className="pl-10"
                        {...field} 
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    The website where this chatbot will be embedded and allowed to run.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="team"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Support Team" {...field} />
                  </FormControl>
                  <FormDescription>
                    Assign this chatbot to a team (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Next: Knowledge Base</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BasicInfoStep;
