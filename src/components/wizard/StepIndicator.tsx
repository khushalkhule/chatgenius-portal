
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          
          return (
            <div 
              key={index} 
              className="flex flex-col items-center relative"
              style={{ width: `${100 / totalSteps}%` }}
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
                  <span>{stepNumber}</span>
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
                {labels[index]}
              </span>
              
              {/* Connecting line */}
              {index < totalSteps - 1 && (
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
