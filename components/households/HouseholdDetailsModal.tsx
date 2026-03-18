'use client'
import { Household } from '@/data/households';
import { Zone } from '@/data/zones';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface HouseholdDetailsModalProps {
  household: Household | null;
  zones: Zone[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HouseholdDetailsModal({ household, zones, open, onOpenChange }: HouseholdDetailsModalProps) {
  if (!household) return null;

  const zone = zones.find(z => z.id === household.zone_id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Household Details</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Code</label>
              <p className="text-sm font-semibold">{household.code}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">House Type</label>
              <p className="text-sm capitalize">
                {household.houseType === 'other' && household.otherHouseType 
                  ? household.otherHouseType 
                  : household.houseType}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <p className="text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  household.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {household.status}
                </span>
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Zone</label>
              <p className="text-sm">{zone ? `${zone.sectorName || zone.sector} - ${zone.cellName || zone.cell}` : 'Unknown Zone'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Address</label>
              <p className="text-sm">{household.address}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}