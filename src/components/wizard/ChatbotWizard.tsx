
import { useState } from "react";
import StepIndicator from "./StepIndicator";
import BasicInfoStep from "./steps/BasicInfoStep";
import KnowledgeBaseStep from "./steps/KnowledgeBaseStep";
import AIModelStep from "./steps/AIModelStep";
import DesignStep from "./steps/DesignStep";
import LeadFormStep from "./steps/LeadFormStep";
import SummaryStep from "./steps/SummaryStep";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useChatbots } from "@/contexts/ChatbotContext";

const STEPS = ["Basic Info", "Knowledge Base", "AI Model", "Design", "Lead Form", "Summary"];

const ChatbotWizard = () => {
  const navigate = useNavigate();
  const { addChatbot } = useChatbots();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  
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
  
  const handleComplete = async () => {
    // Add the chatbot using our context which now calls the API
    const { basicInfo, design } = formData;
    
    setIsCreating(true);
    
    try {
      await addChatbot({
        name: basicInfo?.name || "Unnamed Chatbot",
        description: basicInfo?.description || "",
        // Include all form data
        basicInfo,
        knowledgeBase: formData.knowledgeBase,
        aiModel: formData.aiModel,
        design,
        leadForm: formData.leadForm,
      });
      
      toast.success("Chatbot created successfully!");
      
      // After successful creation, redirect to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Error creating chatbot:", error);
      toast.error("Failed to create chatbot. Please try again.");
    } finally {
      setIsCreating(false);
    }
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
          isSubmitting={isCreating}
        />
      )}
    </div>
  );
};

export default ChatbotWizard;
