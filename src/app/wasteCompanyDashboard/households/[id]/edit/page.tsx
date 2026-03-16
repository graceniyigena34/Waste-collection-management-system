/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useState, useEffect, useMemo } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { HouseholdForm } from '@/components/households/HouseholdForm';
import { dummyHouseholds } from '@/data/households';
import { dummyZones } from '@/data/zones';
import { toast } from 'react-toastify';
export default function EditHouseholdPage() {
  const router = useRouter();
  const params = useParams();
  const householdId = params.id as string;
  const [zones] = useState(dummyZones);

  const household = useMemo(() => {
    const savedHouseholds = localStorage.getItem('households');
    const households = savedHouseholds ? JSON.parse(savedHouseholds) : dummyHouseholds;
    return households.find((h: any) => h.id === householdId);
  }, [householdId]);

  if (!household) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Household Not Found</h1>
          <p className="text-gray-600 mb-6">The household you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/wasteCompanyDashboard/households')}
            className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green transition-colors"
          >
            Back to Households
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (data: any) => {
    try {
      const savedHouseholds = localStorage.getItem('households');
      const households = savedHouseholds ? JSON.parse(savedHouseholds) : dummyHouseholds;
      const updatedHouseholds = households.map((h: any) =>
        h.id === householdId ? { ...h, ...data } : h
      );
      localStorage.setItem('households', JSON.stringify(updatedHouseholds));

      toast.success('Household updated successfully!');
      router.push('/wasteCompanyDashboard/households');
    } catch (error) {
      toast.error('Failed to update household. Please try again.');
    }
  };

  const handleCancel = () => {
    router.push('/wasteCompanyDashboard/households');
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <HouseholdForm
        household={household}
        zones={zones}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
}