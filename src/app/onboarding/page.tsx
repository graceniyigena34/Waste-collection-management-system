'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, FileText, CheckCircle2, Truck, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { StepIndicator } from '@/components/onboarding/StepIndicator';
import { CompanyInfoStep, CompanyFormData } from '@/components/onboarding/CompanyInfoStep';
import { DocumentStep } from '@/components/onboarding/DocumentStep';
import { SuccessStep } from '@/components/onboarding/SuccessStep';
import RoleGuard from '@/components/auth/RoleGuard';
import onboardingService from '@/lib/onboarding-service';

const steps = [
  { number: 1, label: 'Company Info', icon: Building2 },
  { number: 2, label: 'Documents', icon: FileText },
  { number: 3, label: 'Complete', icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [companyData, setCompanyData] = useState<CompanyFormData | null>(null);
  const [kigaliContract, setKigaliContract] = useState<File | null>(null);
  const [remaDocument, setRemaDocument] = useState<File | null>(null);
  const [rdbDocument, setRdbDocument] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const handleCompanySubmit = (data: CompanyFormData) => {
    setCompanyData(data);
    setStep(2);
  };

  const handleFinalSubmit = async () => {
    // Validate all required fields
    if (!companyData) {
      toast.error('Company information is missing');
      return;
    }
    
    if (!kigaliContract || !remaDocument || !rdbDocument) {
      toast.error('All three documents are required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit all data in one request
      const result = await onboardingService.submitOnboarding({
        name: companyData.companyName,
        sectorCoverage: companyData.sectors.join(', '),
        cityOfKigaliDocument: kigaliContract,
        remaDocument: remaDocument,
        rdbDocument: rdbDocument,
      });

      console.log('Registration successful:', result);
      toast.success(result.message || 'Registration completed successfully!');
      setStep(3);
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(error.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (step === 3) {
      // Mark onboarding as completed
      localStorage.setItem('onboarding_completed', 'true');
      const timer = setTimeout(() => {
        router.push('/company-status');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, router]);

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Company Information';
      case 2: return 'Upload Documents';
      default: return 'Complete';
    }
  };

  return (
    <RoleGuard allowedRoles={['COMPANY_MANAGER']}>
      <div className="min-h-screen bg-light-bg dark:bg-gray-900 transition-colors duration-300 py-12 px-4">
      {/* Success Step - Full Screen */}
      {step === 3 ? (
        <SuccessStep
          companyData={companyData}
          onGoHome={() => router.push('/signin')}
        />
      ) : (
        /* Centered Modal Card */
        <div className="max-w-3xl mx-auto">
          {/* Modal Card */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="relative px-8 pt-8 pb-6 border-b border-gray-100 dark:border-gray-700">
              {/* Close Button */}
              <button
                onClick={() => router.push('/')}
                className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>

              {/* Title and Progress */}
              <div className="flex items-start justify-between pr-12">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    {getStepTitle()}
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Step {step} of 3
                  </p>
                </div>

                {/* Circular Progress */}
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="28"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                      strokeDasharray={`${(step / 3) * 175.93} 175.93`}
                      className="text-primary-green transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-base font-bold text-gray-900 dark:text-white">
                      {step}/3
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Indicator */}
              <div className="mt-8">
                <StepIndicator steps={steps} currentStep={step} />
              </div>
            </div>

            {/* Content */}
            <div className="px-8 pb-8">
              {step === 1 && (
                <CompanyInfoStep
                  onNext={handleCompanySubmit}
                  onBack={() => {}}
                />
              )}

              {step === 2 && (
                <DocumentStep
                  kigaliContract={kigaliContract}
                  setKigaliContract={setKigaliContract}
                  remaDocument={remaDocument}
                  setRemaDocument={setRemaDocument}
                  rdbDocument={rdbDocument}
                  setRdbDocument={setRdbDocument}
                  onBack={() => setStep(1)}
                  onSubmit={handleFinalSubmit}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </RoleGuard>
  );
}