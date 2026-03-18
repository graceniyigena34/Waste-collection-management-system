'use client'
import { Tariff } from '@/lib/tariff-service';
import { TariffRule } from '@/lib/tariff-rule-service';
import { Zone } from '@/lib/zone-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TariffDetailsModalProps {
  plan: Tariff | null;
  rules: TariffRule[];
  zones: Zone[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TariffDetailsModal({ plan, rules, zones, open, onOpenChange }: TariffDetailsModalProps) {
  if (!plan) return null;

  const getBillingFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
      case 'QUARTERLY': return 'Quarterly';
      case 'ANNUALLY': return 'Annually';
      default: return frequency;
    }
  };

  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? `${zone.sector} - ${zone.cell}` : 'Unknown Zone';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tariff Plan Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Plan Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Plan Name</label>
                <p className="text-lg font-semibold">{plan.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Billing Frequency</label>
                <p className="text-sm">{getBillingFrequencyLabel(plan.billingFrequency)}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Active From</label>
                <p className="text-sm">{formatDate(plan.effectiveFrom)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Active To</label>
                <p className="text-sm">{formatDate(plan.effectiveTo)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Rules</label>
                <p className="text-sm font-semibold">{rules.length}</p>
              </div>
            </div>
          </div>

          {/* Rules Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Tariff Rules</h3>
            {rules.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Zone</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">House Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Frequency/Week</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Amount (RWF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule) => (
                      <tr key={rule.id} className="border-t">
                        <td className="py-3 px-4">{getZoneName(rule.zoneId)}</td>
                        <td className="py-3 px-4">{rule.houseType}</td>
                        <td className="py-3 px-4">{Number(rule.pickupFrequencyPerWeek) || 0}</td>
                        <td className="py-3 px-4 font-medium">{Number(rule.amount || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No rules defined for this plan</p>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}