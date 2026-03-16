'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentForm } from '@/components/payments/PaymentForm';
import { dummyHouseholds } from '@/data/households';
import { toast } from 'react-toastify';
export default function CreatePaymentPage() {
  const router = useRouter();
  const [households] = useState(dummyHouseholds);

  const handleSubmit = (data: any) => {
    try {
      const newPayment = {
        id: `pay_${Date.now()}`,
        ...data,
      };

      const savedPayments = localStorage.getItem('payments');
      const payments = savedPayments ? JSON.parse(savedPayments) : [];
      const updatedPayments = [...payments, newPayment];
      localStorage.setItem('payments', JSON.stringify(updatedPayments));

      toast.success('Payment created successfully!');
      router.push('/wasteCompanyDashboard/payments');
    } catch (error) {
      toast.error('Failed to create payment. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/wasteCompanyDashboard/payments');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <PaymentForm
        households={households}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}