'use client'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoneSelect } from './ZoneSelect';

const ruleSchema = z.object({
  zone_id: z.string().min(1, 'Zone is required'),
  house_type: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'APARTMENT', 'VILLA', 'COMPOUND'], {
    message: 'House type is required'
  }),
  pickup_frequency_per_week: z.number().min(0, 'Frequency must be 0 or greater'),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
});

type RuleFormData = z.infer<typeof ruleSchema>;

interface RuleFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule?: any;
  zones: any[];
  onSubmit: (data: RuleFormData) => void;
}

export function RuleFormModal({ open, onOpenChange, rule, zones, onSubmit }: RuleFormModalProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RuleFormData>({
    resolver: zodResolver(ruleSchema),
    defaultValues: rule ? {
      zone_id: rule.zoneId || rule.zone_id || '',
      house_type: rule.houseType || rule.house_type || 'RESIDENTIAL',
      pickup_frequency_per_week: Number(rule.pickupFrequencyPerWeek || rule.pickup_frequency_per_week) || 1,
      amount: Number(rule.amount) || 0,
    } : {
      zone_id: '',
      house_type: 'RESIDENTIAL',
      pickup_frequency_per_week: 1,
      amount: 0,
    },
  });

  const watchedZoneId = watch('zone_id');

  const handleFormSubmit = (data: RuleFormData) => {
    onSubmit(data);
    reset();
    onOpenChange(false);
  };

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{rule ? 'Edit Rule' : 'Add New Rule'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
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
            <label className="block text-sm font-medium mb-2">House Type *</label>
            <select
              {...register('house_type')}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.house_type ? 'border-red-500' : ''}`}
            >
              <option value="">Select house type</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
              <option value="APARTMENT">Apartment</option>
              <option value="VILLA">Villa</option>
              <option value="COMPOUND">Compound</option>
            </select>
            {errors.house_type && (
              <p className="text-red-500 text-sm mt-1">{errors.house_type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pickup Frequency Per Week *</label>
            <Input
              type="number"
              min="0"
              {...register('pickup_frequency_per_week', { valueAsNumber: true })}
              className={errors.pickup_frequency_per_week ? 'border-red-500' : ''}
            />
            {errors.pickup_frequency_per_week && (
              <p className="text-red-500 text-sm mt-1">{errors.pickup_frequency_per_week.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Amount (RWF) *</label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {rule ? 'Update Rule' : 'Add Rule'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}