
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ChatInterface from "@/components/chat/ChatInterface";
import { Globe, Bot, Paintbrush, MessageSquare, Check } from "lucide-react";

interface SummaryStepProps {
  formData: {
    basicInfo?: {
      name: string;
      description?: string;
      team?: string;
    };
    knowledgeBase?: {
      sourceType: string;
      url?: string;
      file?: string;
      content?: string;
      faqs?: string;
    };
    aiModel?: {
      model: string;
      temperature: number;
      maxTokens: number;
    };
    design?: {
      theme: string;
      initialMessage: string;
      suggestedMessages?: string;
      placeholder?: string;
      footerLinks?: string;
      name: string;
      userMessageColor?: string;
      autoOpenDelay?: number;
    };
    leadForm?: {
      enabled: boolean;
      title: string;
      description?: string;
      fields: Array<{
        id: string;
        name: string;
        label: string;
        type: string;
        required: boolean;
      }>;
      buttonText: string;
      successMessage: string;
    };
  };
  onBack: () => void;
  onComplete: () => void;
  isSubmitting?: boolean; // Added this prop
}

const SummaryStep = ({ formData, onBack, onComplete, isSubmitting = false }: SummaryStepProps) => {
  const { basicInfo, knowledgeBase, aiModel, design, leadForm } = formData;

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
                    <p><span className="font-medium">Name:</span> {basicInfo?.name}</p>
                    {basicInfo?.description && (
                      <p><span className="font-medium">Description:</span> {basicInfo.description}</p>
                    )}
                    {basicInfo?.team && (
                      <p><span className="font-medium">Team:</span> {basicInfo.team}</p>
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
                      {knowledgeBase?.sourceType === "website"
                        ? "Website"
                        : knowledgeBase?.sourceType === "file"
                        ? "File Upload"
                        : knowledgeBase?.sourceType === "text"
                        ? "Direct Text"
                        : "FAQ"}
                    </p>
                    {knowledgeBase?.url && (
                      <p><span className="font-medium">URL:</span> {knowledgeBase.url}</p>
                    )}
                    {knowledgeBase?.file && (
                      <p><span className="font-medium">File:</span> {knowledgeBase.file}</p>
                    )}
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
                      {aiModel?.model === "gpt-4o-mini" ? "GPT-4o Mini" : "GPT-4o"}
                    </p>
                    <p>
                      <span className="font-medium">Temperature:</span>{" "}
                      {aiModel?.temperature}
                    </p>
                    <p>
                      <span className="font-medium">Max Tokens:</span>{" "}
                      {aiModel?.maxTokens}
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
                      {leadForm?.enabled ? "Yes" : "No"}
                    </p>
                    {leadForm?.enabled && (
                      <>
                        <p>
                          <span className="font-medium">Title:</span> {leadForm.title}
                        </p>
                        <p>
                          <span className="font-medium">Fields:</span>{" "}
                          {leadForm.fields.map((field) => field.label).join(", ")}
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
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onComplete} className="gap-2" disabled={isSubmitting}>
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
