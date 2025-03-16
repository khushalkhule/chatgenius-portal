
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useChatbots } from "@/contexts/ChatbotContext";
import { Chatbot } from "@/contexts/ChatbotContext";
import StepIndicator from "./StepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import KnowledgeBaseStep from "./steps/KnowledgeBaseStep";
import AIModelStep from "./steps/AIModelStep";
import DesignStep from "./steps/DesignStep";
import LeadFormStep from "./steps/LeadFormStep";
import SummaryStep from "./steps/SummaryStep";

const STEPS = ["Basic Info", "Knowledge Base", "AI Model", "Design", "Lead Form", "Summary"];

interface ChatbotEditorWizardProps {
  chatbot: Chatbot;
}

const ChatbotEditorWizard = ({ chatbot }: ChatbotEditorWizardProps) => {
  const navigate = useNavigate();
  const { updateChatbot } = useChatbots();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({
    basicInfo: chatbot.basicInfo || {},
    knowledgeBase: chatbot.knowledgeBase || {},
    aiModel: chatbot.aiModel || {},
    design: chatbot.design || {},
    leadForm: chatbot.leadForm || {},
  });
  
  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBasicInfoSubmit = (data: any) => {
    setFormData({ ...formData, basicInfo: data });
    nextStep();
  };
  
  const handleKnowledgeBaseSubmit = (data: any) => {
    setFormData({ ...formData, knowledgeBase: data });
    nextStep();
  };
  
  const handleAIModelSubmit = (data: any) => {
    setFormData({ ...formData, aiModel: data });
    nextStep();
  };
  
  const handleDesignSubmit = (data: any) => {
    setFormData({ ...formData, design: data });
    nextStep();
  };
  
  const handleLeadFormSubmit = (data: any) => {
    setFormData({ ...formData, leadForm: data });
    nextStep();
  };
  
  const handleComplete = () => {
    // Update the chatbot in our context
    const { basicInfo } = formData;
    
    updateChatbot(chatbot.id, {
      name: basicInfo?.name || chatbot.name,
      description: basicInfo?.description || chatbot.description,
      // Include all form data
      basicInfo: formData.basicInfo,
      knowledgeBase: formData.knowledgeBase,
      aiModel: formData.aiModel,
      design: formData.design,
      leadForm: formData.leadForm,
    });
    
    toast.success("Chatbot updated successfully!");
    
    // After successful update, redirect to chatbot manager
    setTimeout(() => {
      navigate(`/chatbot/${chatbot.id}`);
    }, 1500);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <StepIndicator currentStep={currentStep} totalSteps={STEPS.length} labels={STEPS} />
      
      {currentStep === 1 && (
        <BasicInfoStep
          onNext={handleBasicInfoSubmit}
          initialData={formData.basicInfo}
        />
      )}
      
      {currentStep === 2 && (
        <KnowledgeBaseStep
          onNext={handleKnowledgeBaseSubmit}
          onBack={prevStep}
          initialData={formData.knowledgeBase}
        />
      )}
      
      {currentStep === 3 && (
        <AIModelStep
          onNext={handleAIModelSubmit}
          onBack={prevStep}
          initialData={formData.aiModel}
        />
      )}
      
      {currentStep === 4 && (
        <DesignStep
          onNext={handleDesignSubmit}
          onBack={prevStep}
          initialData={formData.design}
        />
      )}
      
      {currentStep === 5 && (
        <LeadFormStep
          onNext={handleLeadFormSubmit}
          onBack={prevStep}
          initialData={formData.leadForm}
        />
      )}
      
      {currentStep === 6 && (
        <SummaryStep
          formData={formData}
          onBack={prevStep}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
};

export default ChatbotEditorWizard;
