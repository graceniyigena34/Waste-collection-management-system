'use client'
import { CheckCircle2, Sparkles, Truck, Building2, MapPin, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CompanyFormData } from './CompanyInfoStep';
import { useEffect, useState } from 'react';

interface SuccessStepProps {
  companyData: CompanyFormData | null;
  onGoHome: () => void;
}

export function SuccessStep({ companyData, onGoHome }: SuccessStepProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4">
      {/* Animated Success Icon */}
      <div className="relative mb-8 animate-scale-in">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-primary-green/20 dark:bg-primary-green/30 animate-ping" />
        </div>
        <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary-green to-secondary-green flex items-center justify-center shadow-2xl shadow-primary-green/40">
          <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
        </div>
        <div className="absolute -top-2 -right-2 animate-bounce">
          <Sparkles className="w-8 h-8 text-secondary-green" />
        </div>
      </div>

      {/* Success Card */}
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 p-8 sm:p-10 space-y-6 animate-fade-in-up">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent mb-3">
            Application Submitted Successfully!
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Thank you for joining GreenEx. You&#39;re one step closer to powering Rwanda&#39;s sustainable future.
          </p>
        </div>

        {/* Review Timeline */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-green/5 to-secondary-green/5 dark:from-primary-green/10 dark:to-secondary-green/10 border-2 border-primary-green/20 dark:border-primary-green/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-green/10 dark:bg-primary-green/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-primary-green" />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                Our team is reviewing your documents
              </p>
              <p className="text-2xl font-bold text-primary-green mb-2">
                Review Time: 3–5 Business Days
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We&apos;ll notify you via email and phone once your application is approved.
              </p>
            </div>
          </div>
        </div>

        {/* Company Summary */}
        {companyData && (
          <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
              Registration Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-lg bg-primary-green/10 dark:bg-primary-green/20 flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5 text-primary-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Company Name</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {companyData.companyName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="w-10 h-10 rounded-lg bg-primary-green/10 dark:bg-primary-green/20 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Service Areas</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {companyData.sectors.length} Sector{companyData.sectors.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-4 pt-4">
          <Button
            onClick={onGoHome}
            className="w-full bg-gradient-to-r from-primary-green to-secondary-green hover:from-secondary-green hover:to-primary-green text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 text-base font-semibold"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Continue
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-green animate-pulse" />
            Redirecting automatically in {countdown} seconds...
          </p>
        </div>
      </div>

     
 
    </div>
  );
}