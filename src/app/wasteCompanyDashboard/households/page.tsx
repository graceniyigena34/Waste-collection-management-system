'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HouseholdTable } from '@/components/households/HouseholdTable';
import { HouseholdDetailsModal } from '@/components/households/HouseholdDetailsModal';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import householdService from '@/lib/household-service';
import zoneService from '@/lib/zone-service';
import { Household as UIHousehold } from '@/data/households';
import { Zone as UIZone } from '@/data/zones';

export default function HouseholdsPage() {
  const router = useRouter();
  const [households, setHouseholds] = useState<UIHousehold[]>([]);
  const [zones, setZones] = useState<UIZone[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<UIHousehold | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteHouseholdId, setDeleteHouseholdId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [householdsData, zonesData] = await Promise.all([
        householdService.getAll(),
        zoneService.getAll()
      ]);

      // Map API Households to UI Households
      const mappedHouseholds: UIHousehold[] = householdsData.map(h => ({
        id: String(h.id),
        waste_company_id: 'comp_001', // Fallback as API doesn't provide this in the current interface
        zone_id: String(h.zoneId),
        code: h.householdName, // Mapping name to code as fallback
        address: h.address,
        houseType: 'resident', // Defaulting since API doesn't have this field yet
        status: h.status.toLowerCase() as 'active' | 'inactive'
      }));

      // Map API Zones to UI Zones
      const mappedZones: UIZone[] = zonesData.map(z => ({
        id: String(z.id),
        district: z.sector,
        districtName: z.sector,
        sector: z.sector,
        sectorName: z.sector,
        cell: z.cell || '',
        cellName: z.cell || '',
        village: z.village || '',
        villageName: z.village || '',
        code: z.code,
        description: z.description || ''
      }));

      setHouseholds(mappedHouseholds);
      setZones(mappedZones);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (household: UIHousehold) => {
    setSelectedHousehold(household);
    setShowDetails(true);
  };

  const handleEdit = (id: string) => {
    router.push(`/wasteCompanyDashboard/households/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setDeleteHouseholdId(id);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const household = households.find(h => h.id === id);
      if (!household) return;

      const newStatus = household.status === 'active' ? 'INACTIVE' : 'ACTIVE';
      // We need to find the original API object or reconstruct it
      // For now, updating with what we have
      await householdService.update(Number(id), {
        status: newStatus
      } as any);
      await fetchData();
      toast.success(`Household ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully!`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const confirmDelete = async () => {
    if (deleteHouseholdId) {
      try {
        await householdService.delete(Number(deleteHouseholdId));
        await fetchData();
        setDeleteHouseholdId(null);
        toast.success('Household deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete household');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Household Management</h1>
        <Button onClick={() => router.push('/wasteCompanyDashboard/households/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Register New Household
        </Button>
      </div>

      <HouseholdTable
        households={households}
        zones={zones}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
      />

      <HouseholdDetailsModal
        household={selectedHousehold}
        zones={zones}
        open={showDetails}
        onOpenChange={setShowDetails}
      />

      <Dialog open={!!deleteHouseholdId} onOpenChange={() => setDeleteHouseholdId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this household? This action cannot be undone.</p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDeleteHouseholdId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}