/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Building2, MapPin, ArrowRight, ChevronDown, Check, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const kigaliSectors = [
  "Bumbogo", "Gatsata", "Gikomero", "Gisozi", "Jabana", "Jali", "Kacyiru",
  "Kimihurura", "Kimironko", "Kinyinya", "Ndera", "Nduba", "Remera", "Rusororo", "Rutunga",
  "Gahanga", "Gatenga", "Gikondo", "Kagarama", "Kanombe", "Kicukiro", "Kigarama",
  "Masaka", "Niboye", "Nyarugunga",
  "Gitega", "Kanyinya", "Kigali", "Kimisagara", "Mageragere", "Muhima",
  "Nyakabanda", "Nyamirambo", "Nyarugenge", "Rwezamenyo"
].sort();

const companySchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  sectors: z.array(z.string()).min(1, "Please select at least one sector"),
});

export type CompanyFormData = z.infer<typeof companySchema>;

interface CompanyInfoStepProps {
  onNext: (data: CompanyFormData) => void;
  onBack: () => void;
}

export function CompanyInfoStep({ onNext, onBack }: CompanyInfoStepProps) {
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [sectorsOpen, setSectorsOpen] = useState(false);
  const [sectorSearch, setSectorSearch] = useState('');

  const { register, handleSubmit, setValue, formState: { isValid } } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    mode: 'onChange',
    defaultValues: { sectors: [] },
  });

  const toggleSector = (sector: string) => {
    const newSectors = selectedSectors.includes(sector)
      ? selectedSectors.filter(s => s !== sector)
      : [...selectedSectors, sector];

    setSelectedSectors(newSectors);
    setValue('sectors', newSectors, { shouldValidate: true });
  };

  const filteredSectors = kigaliSectors.filter(sector =>
    sector.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const onSubmit = (data: CompanyFormData) => {
    // Just pass data to parent, no API call here
    onNext(data);
  };

  return (
    <div className="w-full mt-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Company Name */}
        <div className="space-y-3 group">
          <Label className="text-base font-semibold flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-green/5 dark:from-primary-green/20 dark:to-primary-green/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-green/20">
              <Building2 className="w-5 h-5 text-primary-green transition-transform duration-300 group-hover:scale-110" />
            </div>
            Company Name
          </Label>
          <Input
            {...register('companyName')}
            placeholder="Enter your company name"
            className="h-14 text-base rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-primary-green focus:ring-4 focus:ring-primary-green/10 bg-white dark:bg-gray-900 transition-all duration-300 shadow-sm hover:shadow-md hover:border-primary-green/50"
          />
        </div>

        {/* Sector Coverage */}
        <div className="space-y-3 group">
          <Label className="text-base font-semibold flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-green/10 to-primary-green/5 dark:from-primary-green/20 dark:to-primary-green/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-green/20">
              <MapPin className="w-5 h-5 text-primary-green transition-transform duration-300 group-hover:scale-110" />
            </div>
            Service Areas
          </Label>

          <div className="relative">
            <Button
              type="button"
              variant="outline"
              onClick={() => setSectorsOpen(!sectorsOpen)}
              className="w-full h-14 justify-between text-left rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-primary-green/50 text-base transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <span className={selectedSectors.length === 0 ? "text-gray-400 dark:text-gray-500" : "font-medium"}>
                {selectedSectors.length === 0
                  ? "Select sectors you serve"
                  : `${selectedSectors.length} sector${selectedSectors.length > 1 ? 's' : ''} selected`
                }
              </span>
              <ChevronDown className={cn("w-5 h-5 transition-transform duration-300", sectorsOpen && "rotate-180")} />
            </Button>

            {sectorsOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 max-h-80 overflow-hidden animate-scale-in">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search sectors..."
                      value={sectorSearch}
                      onChange={(e) => setSectorSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                    />
                  </div>
                </div>

                {/* Sectors List */}
                <div className="overflow-y-auto max-h-64">
                  {filteredSectors.length > 0 ? (
                    filteredSectors.map((sector) => (
                      <div
                        key={sector}
                        onClick={() => toggleSector(sector)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-primary-green/5 dark:hover:bg-primary-green/10 cursor-pointer transition-all duration-200 border-b border-gray-100 dark:border-gray-700/50 last:border-0"
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
                          selectedSectors.includes(sector)
                            ? "bg-primary-green border-primary-green scale-110"
                            : "border-gray-300 dark:border-gray-600 hover:border-primary-green"
                        )}>
                          {selectedSectors.includes(sector) && (
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{sector}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No sectors found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {selectedSectors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 animate-fade-in-up">
              {selectedSectors.map((sector) => (
                <span
                  key={sector}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-primary-green/10 to-primary-green/5 dark:from-primary-green/20 dark:to-primary-green/10 text-primary-green rounded-lg text-sm font-semibold border border-primary-green/20 hover:border-primary-green/40 transition-all duration-200 animate-scale-in"
                >
                  {sector}
                  <button
                    type="button"
                    onClick={() => toggleSector(sector)}
                    className="hover:bg-primary-green/20 dark:hover:bg-primary-green/30 rounded-md p-0.5 transition-all duration-200 hover:scale-110"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Button */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={!isValid}
            className="bg-gradient-to-r from-primary-green to-secondary-green hover:from-secondary-green hover:to-primary-green text-white px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-base font-semibold"
          >
            <span className="flex items-center gap-2">
              Continue
              <ArrowRight className="w-5 h-5" />
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}