'use client'
import { useState } from 'react';
import { Payment } from '@/data/payments';
import { Household } from '@/data/households';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Search, CreditCard } from 'lucide-react';

interface PaymentTableProps {
  payments: Payment[];
  households: Household[];
  onView: (payment: Payment) => void;
  onMarkPaid: (id: string) => void;
}

export function PaymentTable({ payments, households, onView, onMarkPaid }: PaymentTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPayments = payments.filter(payment => {
    const household = households.find(h => h.id === payment.household_id);
    return (payment.transaction_ref || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (household?.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.period_month.includes(searchTerm);
  });

  const getHouseholdCode = (householdId: string) => {
    const household = households.find(h => h.id === householdId);
    return household?.code || 'Unknown';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by household code, transaction ref, or period..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Household</th>
              <th className="text-left py-3 px-4 font-medium">Period</th>
              <th className="text-left py-3 px-4 font-medium">Amount</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Channel</th>
              <th className="text-left py-3 px-4 font-medium">Paid At</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.map((payment) => (
              <tr key={payment.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{getHouseholdCode(payment.household_id)}</td>
                <td className="py-3 px-4">{payment.period_month}</td>
                <td className="py-3 px-4">{payment.amount.toLocaleString()} RWF</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status}
                  </span>
                </td>
                <td className="py-3 px-4 capitalize">{payment.channel || '-'}</td>
                <td className="py-3 px-4">
                  {payment.paid_at ? new Date(payment.paid_at).toLocaleDateString() : '-'}
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onView(payment)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    {payment.status === 'pending' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => onMarkPaid(payment.id)}
                        className="text-green-600 hover:text-green-700"
                        title="Mark as Paid"
                      >
                        <CreditCard className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No payments found matching your search.
        </div>
      )}
    </div>
  );
}