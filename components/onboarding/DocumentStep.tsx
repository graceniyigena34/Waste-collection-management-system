'use client'
import { ArrowLeft, ArrowRight, FileCheck, FileText, Truck, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FileUpload } from './FileUpload';
import { toast } from 'react-toastify';

interface DocumentStepProps {
  kigaliContract: File | null;
  setKigaliContract: (file: File | null) => void;
  remaDocument: File | null;
  setRemaDocument: (file: File | null) => void;
  rdbDocument: File | null;
  setRdbDocument: (file: File | null) => void;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function DocumentStep({
  kigaliContract,
  setKigaliContract,
  remaDocument,
  setRemaDocument,
  rdbDocument,
  setRdbDocument,
  onBack,
  onSubmit,
  isSubmitting
}: DocumentStepProps) {
  const handleSubmit = () => {
    // Validate all required files
    if (!kigaliContract) {
      toast.error('City of Kigali contract is required');
      return;
    }
    if (!remaDocument) {
      toast.error('REMA document is required');
      return;
    }
    if (!rdbDocument) {
      toast.error('RDB document is required');
      return;
    }
    onSubmit();
  };

  return (
    <div className="w-full mt-10">
      <div className="space-y-6">
        <FileUpload
          label="City of Kigali Contract"
          description="Upload your City of Kigali contract (PDF, max 5MB)"
          file={kigaliContract}
          onFileChange={setKigaliContract}
          icon={<FileCheck className="w-5 h-5" />}
          required
        />

        <FileUpload
          label="REMA Document"
          description="Upload REMA environmental document (PDF, max 5MB)"
          file={remaDocument}
          onFileChange={setRemaDocument}
          icon={<Truck className="w-5 h-5" />}
          required
        />

        <FileUpload
          label="RDB Document"
          description="Upload RDB business document (PDF, max 5MB)"
          file={rdbDocument}
          onFileChange={setRdbDocument}
          icon={<FileText className="w-5 h-5" />}
          required
        />
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-10">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 px-6 py-3 text-base font-medium rounded-xl transition-all duration-300"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!kigaliContract || !remaDocument || !rdbDocument || isSubmitting}
          className="bg-gradient-to-r from-primary-green to-secondary-green hover:from-secondary-green hover:to-primary-green text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base font-semibold"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              Complete Registration
              <ArrowRight className="w-5 h-5" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}