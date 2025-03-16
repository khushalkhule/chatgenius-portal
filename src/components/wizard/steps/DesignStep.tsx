
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Moon, 
  Palette, 
  Sun, 
  Image as ImageIcon, 
  MessageCircle, 
  MessageSquare, 
  Bot, 
  Circle,
  Square
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

const formSchema = z.object({
  theme: z.enum(["light", "dark", "custom"]),
  initialMessage: z.string().min(1, "Initial message is required"),
  suggestedMessages: z.string().optional(),
  placeholder: z.string().optional(),
  footerLinks: z.string().optional(),
  name: z.string().min(1, "Display name is required"),
  userMessageColor: z.string().optional(),
  autoOpenDelay: z.coerce.number().int().min(0).optional(),
  chatbotIconType: z.enum(["upload", "preset"]).default("preset"),
  chatbotIconPreset: z.string().optional(),
  chatbotIconUpload: z.string().optional(),
  widgetIconType: z.enum(["upload", "preset"]).default("preset"),
  widgetIconPreset: z.string().optional(),
  widgetIconUpload: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface DesignStepProps {
  onNext: (data: FormValues) => void;
  onBack: () => void;
  initialData?: FormValues;
}

const DesignStep = ({ onNext, onBack, initialData }: DesignStepProps) => {
  const [chatbotIconFile, setChatbotIconFile] = useState<File | null>(null);
  const [widgetIconFile, setWidgetIconFile] = useState<File | null>(null);
  
  const presetIcons = [
    { name: "message-circle", component: MessageCircle },
    { name: "message-square", component: MessageSquare },
    { name: "bot", component: Bot },
    { name: "circle", component: Circle },
    { name: "square", component: Square },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      theme: "light",
      initialMessage: "Hi there! How can I help you today?",
      suggestedMessages: "What services do you offer?\nHow does it work?\nPricing information",
      placeholder: "Type your message here...",
      footerLinks: '[{"text": "Privacy Policy", "url": "/privacy"}, {"text": "Terms", "url": "/terms"}]',
      name: "AI Assistant",
      userMessageColor: "#0284c7",
      autoOpenDelay: 5,
      chatbotIconType: "preset",
      chatbotIconPreset: "bot",
      widgetIconType: "preset",
      widgetIconPreset: "message-circle",
    },
  });

  const handleChatbotIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setChatbotIconFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue("chatbotIconUpload", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleWidgetIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWidgetIconFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        form.setValue("widgetIconUpload", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (data: FormValues) => {
    onNext(data);
  };
  
  // Watch for icon type changes
  const chatbotIconType = form.watch("chatbotIconType");
  const widgetIconType = form.watch("widgetIconType");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Customization</CardTitle>
        <CardDescription>
          Customize the appearance and behavior of your chatbot widget.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="icons">Icons</TabsTrigger>
              </TabsList>
              
              <TabsContent value="appearance" className="space-y-6">
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Theme</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-2"
                        >
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="light" className="sr-only" />
                            </FormControl>
                            <div className={`p-4 rounded-md border-2 ${field.value === "light" ? "border-primary" : "border-input"} flex flex-col items-center gap-2 cursor-pointer`} onClick={() => form.setValue("theme", "light")}>
                              <Sun className="h-8 w-8" />
                              <FormLabel className="cursor-pointer">Light</FormLabel>
                            </div>
                          </FormItem>
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="dark" className="sr-only" />
                            </FormControl>
                            <div className={`p-4 rounded-md border-2 ${field.value === "dark" ? "border-primary" : "border-input"} flex flex-col items-center gap-2 cursor-pointer`} onClick={() => form.setValue("theme", "dark")}>
                              <Moon className="h-8 w-8" />
                              <FormLabel className="cursor-pointer">Dark</FormLabel>
                            </div>
                          </FormItem>
                          <FormItem className="flex-1 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="custom" className="sr-only" />
                            </FormControl>
                            <div className={`p-4 rounded-md border-2 ${field.value === "custom" ? "border-primary" : "border-input"} flex flex-col items-center gap-2 cursor-pointer`} onClick={() => form.setValue("theme", "custom")}>
                              <Palette className="h-8 w-8" />
                              <FormLabel className="cursor-pointer">Custom</FormLabel>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="initialMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Welcome message shown when chat opens"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          First message users will see from the chatbot.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="suggestedMessages"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Suggested Messages</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Each message on a new line"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Quick reply options for users (one per line).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="AI Assistant" {...field} />
                        </FormControl>
                        <FormDescription>
                          Name shown in the chat header.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="placeholder"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Input Placeholder</FormLabel>
                        <FormControl>
                          <Input placeholder="Type your message here..." {...field} />
                        </FormControl>
                        <FormDescription>
                          Placeholder text for the chat input.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="footerLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Footer Links (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='[{"text": "Privacy", "url": "/privacy"}]'
                            className="font-mono text-sm min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Optional footer links in JSON format.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="userMessageColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Message Color</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input type="color" {...field} className="w-12 h-10 p-1" />
                            </FormControl>
                            <Input 
                              value={field.value} 
                              onChange={field.onChange}
                              className="flex-1"
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="autoOpenDelay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Auto-open Delay (seconds)</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormDescription>
                            0 = disabled
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="icons" className="space-y-6">
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="text-lg font-medium">Chatbot Icon</h3>
                  <p className="text-sm text-muted-foreground">This icon appears in the chat header.</p>
                  
                  <FormField
                    control={form.control}
                    name="chatbotIconType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Icon Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="preset" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Use preset icon
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="upload" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Upload custom icon
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {chatbotIconType === "preset" && (
                    <FormField
                      control={form.control}
                      name="chatbotIconPreset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preset Icon</FormLabel>
                          <div className="grid grid-cols-5 gap-3 py-2">
                            {presetIcons.map((icon) => {
                              const IconComponent = icon.component;
                              return (
                                <div 
                                  key={icon.name}
                                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-all ${field.value === icon.name ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}`}
                                  onClick={() => form.setValue("chatbotIconPreset", icon.name)}
                                >
                                  <IconComponent className="h-8 w-8 mb-1" />
                                  <span className="text-xs">{icon.name}</span>
                                </div>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {chatbotIconType === "upload" && (
                    <FormField
                      control={form.control}
                      name="chatbotIconUpload"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Icon</FormLabel>
                          <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-md p-6">
                            {field.value ? (
                              <div className="flex flex-col items-center">
                                <img 
                                  src={field.value} 
                                  alt="Uploaded icon" 
                                  className="w-20 h-20 object-contain mb-4" 
                                />
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={() => {
                                    form.setValue("chatbotIconUpload", "");
                                    setChatbotIconFile(null);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <>
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Recommended size: 512x512px (PNG or JPG)
                                </p>
                                <div className="flex gap-2">
                                  <label htmlFor="chatbot-icon-upload" className="cursor-pointer">
                                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                                      Upload Icon
                                    </div>
                                    <input
                                      id="chatbot-icon-upload"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleChatbotIconUpload}
                                    />
                                  </label>
                                </div>
                              </>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="text-lg font-medium">Widget Icon</h3>
                  <p className="text-sm text-muted-foreground">This icon appears on the chat widget button.</p>
                  
                  <FormField
                    control={form.control}
                    name="widgetIconType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Icon Type</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                          >
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="preset" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Use preset icon
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="upload" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Upload custom icon
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {widgetIconType === "preset" && (
                    <FormField
                      control={form.control}
                      name="widgetIconPreset"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Preset Icon</FormLabel>
                          <div className="grid grid-cols-5 gap-3 py-2">
                            {presetIcons.map((icon) => {
                              const IconComponent = icon.component;
                              return (
                                <div 
                                  key={icon.name}
                                  className={`flex flex-col items-center p-3 border rounded-md cursor-pointer transition-all ${field.value === icon.name ? 'border-primary bg-primary/5' : 'border-input hover:border-primary/50'}`}
                                  onClick={() => form.setValue("widgetIconPreset", icon.name)}
                                >
                                  <IconComponent className="h-8 w-8 mb-1" />
                                  <span className="text-xs">{icon.name}</span>
                                </div>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {widgetIconType === "upload" && (
                    <FormField
                      control={form.control}
                      name="widgetIconUpload"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Upload Icon</FormLabel>
                          <div className="flex flex-col items-center justify-center gap-4 border-2 border-dashed rounded-md p-6">
                            {field.value ? (
                              <div className="flex flex-col items-center">
                                <img 
                                  src={field.value} 
                                  alt="Uploaded icon" 
                                  className="w-20 h-20 object-contain mb-4" 
                                />
                                <Button 
                                  type="button" 
                                  variant="outline"
                                  onClick={() => {
                                    form.setValue("widgetIconUpload", "");
                                    setWidgetIconFile(null);
                                  }}
                                >
                                  Remove
                                </Button>
                              </div>
                            ) : (
                              <>
                                <ImageIcon className="h-10 w-10 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Recommended size: 512x512px (PNG or JPG)
                                </p>
                                <div className="flex gap-2">
                                  <label htmlFor="widget-icon-upload" className="cursor-pointer">
                                    <div className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm">
                                      Upload Icon
                                    </div>
                                    <input
                                      id="widget-icon-upload"
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      onChange={handleWidgetIconUpload}
                                    />
                                  </label>
                                </div>
                              </>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={onBack}>
                Back
              </Button>
              <Button type="submit">Next: Lead Form</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DesignStep;
