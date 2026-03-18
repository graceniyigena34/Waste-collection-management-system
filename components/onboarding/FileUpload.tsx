'use client'
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check, X, Upload } from 'lucide-react';
import { toast } from 'react-toastify';

interface FileUploadProps {
  label: string;
  description: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  icon: React.ReactNode;
  required?: boolean;
}

export function FileUpload({ label, description, file, onFileChange, icon, required = false }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      toast.success(`${selectedFile.name} uploaded successfully`);
    }
    onFileChange(selectedFile || null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      if (droppedFile.type !== 'application/pdf') {
        toast.error('Only PDF files are allowed');
        return;
      }
      toast.success(`${droppedFile.name} uploaded successfully`);
      onFileChange(droppedFile);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div
      className={cn(
        "relative group border-2 border-dashed rounded-2xl p-5 transition-all duration-300 cursor-pointer",
        file
          ? "border-primary-green bg-primary-green/5 dark:bg-primary-green/10 shadow-md shadow-primary-green/10"
          : isDragging
            ? "border-primary-green bg-primary-green/10 dark:bg-primary-green/20 scale-[1.02]"
            : "border-gray-300 dark:border-gray-600 hover:border-primary-green hover:bg-primary-green/5 dark:hover:bg-primary-green/10 hover:shadow-lg"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex items-center gap-4 relative z-0">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300",
          file
            ? "bg-primary-green shadow-lg shadow-primary-green/30 scale-110"
            : "bg-primary-green/10 dark:bg-primary-green/20 group-hover:bg-primary-green/20 dark:group-hover:bg-primary-green/30 group-hover:scale-110"
        )}>
          {file ? (
            <Check className="w-6 h-6 text-white animate-scale-in" strokeWidth={3} />
          ) : isDragging ? (
            <Upload className="w-6 h-6 text-primary-green animate-bounce" />
          ) : (
            <div className="text-primary-green transition-transform duration-300 group-hover:scale-110">
              {icon}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-0.5">
            {label}
            {required && !file && (
              <span className="ml-2 text-xs text-red-500 font-medium">*Required</span>
            )}
          </h3>
          {file ? (
            <div className="space-y-0.5">
              <p className="text-sm text-primary-green font-medium truncate">{file.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isDragging ? 'Drop file here' : description}
            </p>
          )}
        </div>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onFileChange(null);
              toast.info('File removed');
            }}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition-all duration-200 hover:scale-110 z-20"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
}