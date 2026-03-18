'use client'
import { cn } from '@/lib/utils';
import { Truck, Layers, Route, Sparkles } from 'lucide-react';

interface OnboardingVisualProps {
  step: 1 | 2 | 3;
}

export function OnboardingVisual({ step }: OnboardingVisualProps) {
  const isStep1 = step === 1;
  const isStep2 = step === 2;

  return (
    <div className="hidden lg:block w-full p-8 relative">
      <div className={cn(
        "w-full h-[600px] bg-primary/10 rounded-3xl p-10 flex flex-col justify-center items-center relative overflow-hidden transition-all duration-700",
        isStep1 ? 'shadow-2xl shadow-primary/20' : 'shadow-2xl shadow-secondary-green/20'
      )}>
        <div className="absolute top-8 left-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-8 right-8 w-48 h-48 bg-secondary-green/5 rounded-3xl transform rotate-45 blur-3xl" />
        
        <div className="relative z-10 text-center">
          <div className={cn(
            "w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-500 mb-8",
            isStep1 ? "bg-gradient-to-br from-primary to-secondary-green" : "bg-gradient-to-br from-primary-green to-primary/80"
          )}>
            {isStep1 ? (
              <Truck className="w-12 h-12 text-white animate-pulse" />
            ) : (
              <Layers className="w-12 h-12 text-white animate-bounce" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-foreground mb-6">
            {isStep1 ? "Ready to Join the Green Network?" : "Compliance is Key"}
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            {isStep1 
              ? "Complete this step-by-step registration to start providing essential waste management services."
              : "Securely upload your contracts and licenses. We handle the rest to ensure full regulatory compliance."
            }
          </p>
          
          <div className="flex items-center justify-center gap-3 text-primary font-semibold text-lg">
            <Route className="w-6 h-6" />
            <span>Step {step} of 3</span>
          </div>

          {/* Progress indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300",
                  i <= step ? "bg-primary" : "bg-primary/20"
                )}
              />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}