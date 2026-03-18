'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ZoneForm } from '@/components/zones/ZoneForm';
import { toast } from 'react-toastify';
import zoneService from '@/lib/zone-service';
import { getDistrictBySectorId } from '@/data/rwanda-admin';

export default function EditZonePage() {
  const router = useRouter();
  const params = useParams();
  const zoneId = params.id as string;

  const [zone, setZone] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadZone = () => {
      try {
        setLoading(true);

        // First try loading from localStorage (set by zones list on Edit click)
        const cached = localStorage.getItem('editing_zone');
        if (cached) {
          const parsed = JSON.parse(cached);
          // Only use if the ID matches
          if (String(parsed.id) === String(zoneId)) {
            console.log('Loaded zone from cache:', parsed);
            setZone(parsed);
            localStorage.removeItem('editing_zone');
            setLoading(false);
            return;
          }
        }

        // Fallback: try getById (may fail if backend has issues)
        zoneService.getById(zoneId).then(data => {
          const district = getDistrictBySectorId(data.sector);
          const sector = district?.sectors.find(s => s.name === data.sector || s.id === data.sector);
          const cell = sector?.cells.find(c => c.name === data.cell || c.id === data.cell);
          const village = cell?.villages.find(v => v.name === data.village || v.id === data.village);

          setZone({
            id: String(data.id),
            district: district?.id || '',
            sector: sector?.id || data.sector,
            cell: cell?.id || data.cell,
            village: village?.id || (data as any).village,
            code: data.code,
            description: data.description || ''
          });
        }).catch(error => {
          console.error('Failed to fetch zone:', error);
          toast.error('Failed to load zone data');
        }).finally(() => {
          setLoading(false);
        });
      } catch (error) {
        console.error('Error loading zone:', error);
        toast.error('Failed to load zone data');
        setLoading(false);
      }
    };

    if (zoneId) {
      loadZone();
    }
  }, [zoneId]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!zone) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center border border-gray-200">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">Zone Not Found</h1>
          <p className="text-gray-600 mb-6">The zone you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/wasteCompanyDashboard/zones')}
            className="bg-primary-green text-white px-6 py-2 rounded-lg hover:bg-secondary-green transition-colors"
          >
            Back to Zones
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (data: any) => {
    try {
      const zoneData = {
        sector: data.sectorName || data.sector,
        cell: data.cellName || data.cell,
        village: data.villageName || data.village,
        code: data.code,
        description: data.description,
      };

      await zoneService.update(zoneId, zoneData);

      toast.success('Zone updated successfully!');
      router.push('/wasteCompanyDashboard/zones');
    } catch (error: any) {
      console.error('Failed to update zone:', error);
      const message = error.response?.data?.message || 'Failed to update zone. Please try again.';
      toast.error(message);
    }
  };

  const handleCancel = () => {
    router.push('/wasteCompanyDashboard/zones');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <ZoneForm
        zone={zone}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />
    </div>
  );
}