'use client'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Payment, paymentChannels } from '@/data/payments';
import { Household } from '@/data/households';

const paymentSchema = z.object({
  household_id: z.string().min(1, 'Household is required'),
  tariff_rule_id: z.string().min(1, 'Tariff rule is required'),
  period_month: z.string().min(1, 'Period month is required'),
  amount: z.number().min(1, 'Amount must be greater than 0'),
  status: z.enum(['pending', 'paid', 'overdue', 'cancelled']),
  transaction_ref: z.string().optional(),
  channel: z.enum(['mobile_money', 'bank_transfer', 'cash', 'card']).optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  payment?: Payment;
  households: Household[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function PaymentForm({ payment, households, onSubmit, onCancel, isEditing = false }: PaymentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: payment ? {
      household_id: payment.household_id,
      tariff_rule_id: payment.tariff_rule_id,
      period_month: payment.period_month,
      amount: payment.amount,
      status: payment.status,
      transaction_ref: payment.transaction_ref,
      channel: payment.channel,
    } : {
      status: 'pending',
    },
  });

  const handleFormSubmit = (data: PaymentFormData) => {
    const submissionData = {
      ...data,
      paid_at: data.status === 'paid' ? new Date().toISOString() : undefined,
    };
    onSubmit(submissionData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Payment' : 'Create New Payment'}
      </h1>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Household *</label>
            <Controller
              name="household_id"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.household_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Household</option>
                  {households.map((household) => (
                    <option key={household.id} value={household.id}>
                      {household.code}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.household_id && (
              <p className="text-red-500 text-sm mt-1">{errors.household_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tariff Rule ID *</label>
            <Input
              {...register('tariff_rule_id')}
              placeholder="Enter tariff rule ID"
              className={errors.tariff_rule_id ? 'border-red-500' : ''}
            />
            {errors.tariff_rule_id && (
              <p className="text-red-500 text-sm mt-1">{errors.tariff_rule_id.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Period Month *</label>
            <Input
              type="month"
              {...register('period_month')}
              className={errors.period_month ? 'border-red-500' : ''}
            />
            {errors.period_month && (
              <p className="text-red-500 text-sm mt-1">{errors.period_month.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (RWF) *</label>
            <Input
              type="number"
              {...register('amount', { valueAsNumber: true })}
              placeholder="Enter amount"
              className={errors.amount ? 'border-red-500' : ''}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Status *</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.status ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              )}
            />
            {errors.status && (
              <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Payment Channel</label>
            <Controller
              name="channel"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Channel</option>
                  {paymentChannels.map((channel) => (
                    <option key={channel.value} value={channel.value}>
                      {channel.label}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Transaction Reference</label>
            <Input
              {...register('transaction_ref')}
              placeholder="Enter transaction reference"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Payment'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}