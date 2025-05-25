
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
  completed: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.completed;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center relative"
              style={{ width: `${100 / steps.length}%` }}
            >
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isCompleted && "border-primary bg-primary text-primary-foreground",
                  !isActive && !isCompleted && "border-muted-foreground text-muted-foreground"
                )}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              
              <span 
                className={cn(
                  "text-sm text-center",
                  isActive && "text-primary font-medium",
                  isCompleted && "text-primary",
                  !isActive && !isCompleted && "text-muted-foreground"
                )}
              >
                {step.title}
              </span>
              
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "absolute top-5 h-0.5 transition-all",
                    isCompleted ? "bg-primary" : "bg-muted",
                    "w-full left-1/2"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
