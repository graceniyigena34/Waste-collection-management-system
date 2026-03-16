'use client'
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {steps.map((stepItem, index) => {
        const Icon = stepItem.icon;
        const isActive = currentStep === stepItem.number;
        const isCompleted = currentStep > stepItem.number;

        return (
          <div key={stepItem.number} className="flex items-center gap-2 sm:gap-3">
            {/* Step Circle with Animation */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className={cn(
                "relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-500 shrink-0",
                isCompleted && "bg-primary-green/10 dark:bg-primary-green/20 scale-100",
                isActive && "bg-primary-green/10 dark:bg-primary-green/20 scale-110 animate-pulse",
                !isActive && !isCompleted && "bg-gray-100 dark:bg-gray-800 scale-100"
              )}>
                {/* Glow effect for active step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-primary-green/20 dark:bg-primary-green/30 blur-md animate-pulse" />
                )}

                {/* Icon or Check */}
                <div className="relative z-10">
                  {isCompleted ? (
                    <div className={cn(
                      "w-7 h-7 rounded-full bg-primary-green flex items-center justify-center",
                      "transform transition-all duration-300 animate-scale-in"
                    )}>
                      <Check className="w-4.5 h-4.5 text-white" strokeWidth={3} />
                    </div>
                  ) : (
                    <Icon className={cn(
                      "w-5.5 h-5.5 sm:w-6 sm:h-6 transition-all duration-300",
                      isActive && "text-primary-green scale-110",
                      !isActive && "text-gray-400 dark:text-gray-600"
                    )} />
                  )}
                </div>
              </div>

              {/* Step Label - Hidden on mobile */}
              <span className={cn(
                "font-semibold text-sm sm:text-base transition-all duration-300 hidden sm:block",
                isActive && "text-gray-900 dark:text-white scale-105",
                isCompleted && "text-gray-700 dark:text-gray-300",
                !isActive && !isCompleted && "text-gray-400 dark:text-gray-600"
              )}>
                {stepItem.label}
              </span>
            </div>

            {/* Connector Line with Gradient */}
            {index < steps.length - 1 && (
              <div className="relative w-10 sm:w-16 h-1 rounded-full overflow-hidden">
                <div className={cn(
                  "absolute inset-0 transition-all duration-500 rounded-full",
                  currentStep > stepItem.number
                    ? "bg-gradient-to-r from-primary-green to-secondary-green"
                    : "bg-gray-200 dark:bg-gray-700"
                )} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}