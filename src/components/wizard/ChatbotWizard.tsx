
import { useState } from "react";
import { useChatbots } from "@/contexts/ChatbotContext";
import { useNavigate } from "react-router-dom";
import StepIndicator from "./StepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import KnowledgeBaseStep from "./steps/KnowledgeBaseStep";
import AIModelStep from "./steps/AIModelStep";
import DesignStep from "./steps/DesignStep";
import LeadFormStep from "./steps/LeadFormStep";
import SummaryStep from "./steps/SummaryStep";

export const ChatbotWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createChatbot } = useChatbots();
  const navigate = useNavigate();

  const [chatbotData, setChatbotData] = useState({
    name: "",
    description: "",
    status: "active" as const,
    knowledgeBase: {
      type: "text",
      content: "",
      urls: [],
      faqs: []
    },
    ai_model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000
    },
    design: {
      theme: "modern",
      primaryColor: "#007bff",
      position: "bottom-right"
    },
    lead_form: {
      enabled: false,
      fields: []
    }
  });

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const chatbot = await createChatbot({
        name: chatbotData.name,
        description: chatbotData.description || "",
        status: chatbotData.status,
        ai_model: chatbotData.ai_model,
        design: chatbotData.design,
        lead_form: chatbotData.lead_form
      });

      if (chatbot) {
        navigate(`/chatbot/${chatbot.id}`);
      }
    } catch (error) {
      console.error("Failed to create chatbot:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateChatbotData = (field: string, value: any) => {
    setChatbotData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const steps = [
    { number: 1, title: "Basic Info", completed: currentStep > 1 },
    { number: 2, title: "Knowledge Base", completed: currentStep > 2 },
    { number: 3, title: "AI Model", completed: currentStep > 3 },
    { number: 4, title: "Design", completed: currentStep > 4 },
    { number: 5, title: "Lead Form", completed: currentStep > 5 },
    { number: 6, title: "Summary", completed: false }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <StepIndicator steps={steps} currentStep={currentStep} />
      
      <div className="mt-8">
        {currentStep === 1 && (
          <BasicInfoStep
            data={chatbotData}
            onUpdate={updateChatbotData}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <KnowledgeBaseStep
            data={chatbotData.knowledgeBase}
            onUpdate={(value) => updateChatbotData("knowledgeBase", value)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 3 && (
          <AIModelStep
            data={chatbotData.ai_model}
            onUpdate={(value) => updateChatbotData("ai_model", value)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 4 && (
          <DesignStep
            data={chatbotData.design}
            onUpdate={(value) => updateChatbotData("design", value)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 5 && (
          <LeadFormStep
            data={chatbotData.lead_form}
            onUpdate={(value) => updateChatbotData("lead_form", value)}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
        {currentStep === 6 && (
          <SummaryStep
            data={chatbotData}
            onSubmit={handleSubmit}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
};

export default ChatbotWizard;
