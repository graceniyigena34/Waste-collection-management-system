'use client'
import { useState } from 'react';
import { Tariff } from '@/lib/tariff-service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

interface TariffTableProps {
  plans: Tariff[];
  getRuleCount: (planId: number) => number;
  onView: (plan: Tariff) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function TariffTable({ plans, getRuleCount, onView, onEdit, onDelete }: TariffTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBillingFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'WEEKLY': return 'Weekly';
      case 'MONTHLY': return 'Monthly';
      case 'QUARTERLY': return 'Quarterly';
      case 'ANNUALLY': return 'Annually';
      default: return frequency;
    }
  };

  const formatDateRange = (from: string, to: string) => {
    if (!from || !to) return 'N/A';
    const fromDate = new Date(from);
    const toDate = new Date(to);
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) return 'Invalid Date';
    return `${fromDate.toLocaleDateString()} → ${toDate.toLocaleDateString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by plan name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {plans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">No tariff plans found</p>
          <p className="text-sm">Create your first tariff plan to get started.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Name</th>
                  <th className="text-left py-3 px-4 font-medium">Billing Frequency</th>
                  <th className="text-left py-3 px-4 font-medium">Active Period</th>
                  <th className="text-left py-3 px-4 font-medium"># Rules</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{plan.name}</td>
                    <td className="py-3 px-4">{getBillingFrequencyLabel(plan.billingFrequency)}</td>
                    <td className="py-3 px-4 text-sm">{formatDateRange(plan.effectiveFrom, plan.effectiveTo)}</td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {getRuleCount(plan.id)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView(plan)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit(plan.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDelete(plan.id)}
                          className="text-gray-400 cursor-not-allowed"
                          disabled
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPlans.length === 0 && searchTerm && (
            <div className="text-center py-8 text-gray-500">
              No tariff plans found matching "{searchTerm}".
            </div>
          )}
        </>
      )}
    </div>
  );
}