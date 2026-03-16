'use client'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { BillingFrequency } from '@/lib/tariff-service';

const tariffSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  billingFrequency: z.enum(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUALLY'], {
    message: 'Billing frequency is required'
  }),
  effectiveFrom: z.string().min(1, 'Effective from date is required'),
  effectiveTo: z.string().min(1, 'Effective to date is required'),
}).refine((data) => {
  return new Date(data.effectiveTo) >= new Date(data.effectiveFrom);
}, {
  message: 'Effective to date must be after effective from date',
  path: ['effectiveTo']
});

type TariffFormData = z.infer<typeof tariffSchema>;

interface TariffFormProps {
  plan?: any;
  onSubmit: (data: TariffFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function TariffForm({ plan, onSubmit, onCancel, isEditing = false }: TariffFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TariffFormData>({
    resolver: zodResolver(tariffSchema),
    defaultValues: plan ? {
      name: plan.name,
      description: plan.description,
      billingFrequency: plan.billingFrequency,
      effectiveFrom: plan.effectiveFrom,
      effectiveTo: plan.effectiveTo,
    } : undefined,
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Tariff Plan' : 'Create New Tariff Plan'}
      </h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <Input
            {...register('name')}
            placeholder="Enter tariff plan name"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description *</label>
          <Textarea
            {...register('description')}
            placeholder="Enter description"
            className={errors.description ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Billing Frequency *</label>
          <Controller
            name="billingFrequency"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.billingFrequency ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select billing frequency</option>
                <option value="WEEKLY">Weekly</option>
                <option value="MONTHLY">Monthly</option>
                <option value="QUARTERLY">Quarterly</option>
                <option value="ANNUALLY">Annually</option>
              </select>
            )}
          />
          {errors.billingFrequency && (
            <p className="text-red-500 text-sm mt-1">{errors.billingFrequency.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Effective From *</label>
            <Input
              type="date"
              {...register('effectiveFrom')}
              className={errors.effectiveFrom ? 'border-red-500' : ''}
            />
            {errors.effectiveFrom && (
              <p className="text-red-500 text-sm mt-1">{errors.effectiveFrom.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Effective To *</label>
            <Input
              type="date"
              {...register('effectiveTo')}
              className={errors.effectiveTo ? 'border-red-500' : ''}
            />
            {errors.effectiveTo && (
              <p className="text-red-500 text-sm mt-1">{errors.effectiveTo.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Tariff Plan'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
