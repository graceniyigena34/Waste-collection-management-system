'use client'
import { useRouter } from 'next/navigation';
import { ZoneForm } from '@/components/zones/ZoneForm';
import { toast } from 'react-toastify';
import zoneService from '@/lib/zone-service';

export default function CreateZonePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      // CreateZoneData interface: zoneName, district, sector, cell, description
      const zoneData = {
        sector: data.sectorName,
        cell: data.cellName,
        village: data.villageName,
        code: data.code,
        description: data.description,
      };

      console.log('Sending zone creation payload:', JSON.stringify(zoneData, null, 2));
      await zoneService.create(zoneData);

      toast.success('Zone created successfully!');
      router.push('/wasteCompanyDashboard/zones');
    } catch (error: any) {
      console.error('Failed to create zone - full error:', error.response?.data);
      console.error('Status:', error.response?.status);
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Server error creating zone (500). Please check backend logs.';
      toast.error(message);
    }
  };

  const handleCancel = () => {
    router.push('/wasteCompanyDashboard/zones');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ZoneForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}