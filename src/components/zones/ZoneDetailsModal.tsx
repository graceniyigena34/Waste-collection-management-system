'use client'
import { Zone, getZoneDisplayInfo } from '@/data/zones';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ZoneDetailsModalProps {
  zone: Zone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ZoneDetailsModal({ zone, open, onOpenChange }: ZoneDetailsModalProps) {
  if (!zone) return null;

  const displayInfo = getZoneDisplayInfo(zone);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Zone Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">District</label>
            <p className="text-sm">{displayInfo.district}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Sector</label>
            <p className="text-sm">{displayInfo.sector}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Cell</label>
            <p className="text-sm">{displayInfo.cell}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Village</label>
            <p className="text-sm">{displayInfo.village}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Code</label>
            <p className="text-sm">{zone.code}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Description</label>
            <p className="text-sm">{zone.description}</p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}