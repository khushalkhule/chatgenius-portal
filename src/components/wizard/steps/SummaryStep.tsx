
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/chat/ChatInterface";
import { Globe, Bot, Paintbrush, MessageSquare, Check } from "lucide-react";

interface SummaryStepProps {
  data: {
    name: string;
    description?: string;
    status?: "active" | "paused";
    knowledgeBase?: {
      type: string;
      content?: string;
      urls?: any[];
      faqs?: any[];
    };
    ai_model?: {
      provider?: string;
      model?: string;
      temperature?: number;
      max_tokens?: number;
    };
    design?: {
      theme?: string;
      primaryColor?: string;
      position?: string;
      initialMessage?: string;
      placeholder?: string;
      name?: string;
    };
    lead_form?: {
      enabled: boolean;
      title?: string;
      description?: string;
      fields?: Array<{
        id: string;
        name: string;
        label: string;
        type: string;
        required: boolean;
      }>;
      buttonText?: string;
      successMessage?: string;
    };
  };
  onPrev: () => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const SummaryStep = ({ data, onPrev, onSubmit, isSubmitting = false }: SummaryStepProps) => {
  const { name, description, knowledgeBase, ai_model, design, lead_form } = data;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Chatbot Summary</CardTitle>
        <CardDescription>
          Review your chatbot configuration before creating it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Bot className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="text-sm mt-2 space-y-1">
                    <p><span className="font-medium">Name:</span> {name}</p>
                    {description && (
                      <p><span className="font-medium">Description:</span> {description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">Knowledge Base</h3>
                  <div className="text-sm mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Source Type:</span>{" "}
                      {knowledgeBase?.type === "website"
                        ? "Website"
                        : knowledgeBase?.type === "file"
                        ? "File Upload"
                        : knowledgeBase?.type === "text"
                        ? "Direct Text"
                        : "FAQ"}
                    </p>
                    {knowledgeBase?.content && (
                      <p>
                        <span className="font-medium">Content:</span>{" "}
                        {knowledgeBase.content.length > 100
                          ? `${knowledgeBase.content.substring(0, 100)}...`
                          : knowledgeBase.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Paintbrush className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">AI Model</h3>
                  <div className="text-sm mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Model:</span>{" "}
                      {ai_model?.model === "gpt-4o-mini" ? "GPT-4o Mini" : "GPT-4o"}
                    </p>
                    <p>
                      <span className="font-medium">Temperature:</span>{" "}
                      {ai_model?.temperature}
                    </p>
                    <p>
                      <span className="font-medium">Max Tokens:</span>{" "}
                      {ai_model?.max_tokens}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="text-lg font-semibold">Lead Form</h3>
                  <div className="text-sm mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Enabled:</span>{" "}
                      {lead_form?.enabled ? "Yes" : "No"}
                    </p>
                    {lead_form?.enabled && (
                      <>
                        <p>
                          <span className="font-medium">Title:</span> {lead_form.title}
                        </p>
                        <p>
                          <span className="font-medium">Fields:</span>{" "}
                          {lead_form.fields?.map((field) => field.label).join(", ")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>
            <ChatInterface
              className="w-full max-w-sm h-[500px] shadow-lg"
              botName={design?.name || "AI Assistant"}
              placeholder={design?.placeholder || "Type your message..."}
              initialMessages={[
                {
                  id: "welcome",
                  content: design?.initialMessage || "Hi there! How can I help you today?",
                  isBot: true,
                  timestamp: new Date(),
                },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-between mt-10">
          <Button type="button" variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button onClick={onSubmit} className="gap-2" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Check className="h-4 w-4" /> Create Chatbot
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryStep;
