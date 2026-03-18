'use client'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Household, houseTypes } from '@/data/households';
import { Zone } from '@/data/zones';
import { ZoneSelect } from './ZoneSelect';

const householdSchema = z.object({
  zone_id: z.string().min(1, 'Zone is required'),
  code: z.string().min(1, 'Code is required'),
  address: z.string().min(1, 'Address is required'),
  houseType: z.enum(['resident', 'restaurant', 'vila', 'hotel', 'school', 'company', 'industry', 'other'], {
    message: 'House type is required'
  }),
  otherHouseType: z.string().optional(),
}).refine((data) => {
  if (data.houseType === 'other' && !data.otherHouseType) {
    return false;
  }
  return true;
}, {
  message: 'Please specify the house type',
  path: ['otherHouseType']
});

type HouseholdFormData = z.infer<typeof householdSchema>;

interface HouseholdFormProps {
  household?: Household;
  zones: Zone[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function HouseholdForm({ household, zones, onSubmit, onCancel, isEditing = false }: HouseholdFormProps) {
  const [showOtherInput, setShowOtherInput] = useState(household?.houseType === 'other');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<HouseholdFormData>({
    resolver: zodResolver(householdSchema),
    defaultValues: household ? {
      zone_id: household.zone_id,
      code: household.code,
      address: household.address,
      houseType: household.houseType,
      otherHouseType: household.otherHouseType,
    } : undefined,
  });

  const watchedZoneId = watch('zone_id');
  const watchedHouseType = watch('houseType');

  const handleFormSubmit = (data: HouseholdFormData) => {
    const submissionData = {
      ...data,
      waste_company_id: 'comp_001',
      status: 'active' as const
    };
    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Household' : 'Register New Household'}
      </h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Zone *</label>
            <ZoneSelect
              zones={zones}
              value={watchedZoneId || ''}
              onChange={(value) => setValue('zone_id', value)}
              className={errors.zone_id ? 'border-red-500' : ''}
            />
            {errors.zone_id && (
              <p className="text-red-500 text-sm mt-1">{errors.zone_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Code *</label>
            <Input
              {...register('code')}
              placeholder="e.g., HH-KIC-001"
              className={errors.code ? 'border-red-500' : ''}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">House Type *</label>
            <Controller
              name="houseType"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    setShowOtherInput(e.target.value === 'other');
                    if (e.target.value !== 'other') {
                      setValue('otherHouseType', '');
                    }
                  }}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.houseType ? 'border-red-500' : ''}`}
                >
                  <option value="">Select house type</option>
                  {houseTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.houseType && (
              <p className="text-red-500 text-sm mt-1">{errors.houseType.message}</p>
            )}
          </div>

          {showOtherInput && (
            <div>
              <label className="block text-sm font-medium mb-2">Specify House Type *</label>
              <Input
                {...register('otherHouseType')}
                placeholder="Please specify"
                className={errors.otherHouseType ? 'border-red-500' : ''}
              />
              {errors.otherHouseType && (
                <p className="text-red-500 text-sm mt-1">{errors.otherHouseType.message}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Address *</label>
          <Textarea
            {...register('address')}
            placeholder="Detailed address or landmarks"
            rows={3}
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Save Household'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}