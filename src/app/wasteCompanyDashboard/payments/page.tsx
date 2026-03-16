'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentTable } from '@/components/payments/PaymentTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import paymentService, { Payment } from '@/lib/payment-service';
import householdService, { Household } from '@/lib/household-service';

export default function PaymentsPage() {
  const router = useRouter();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsData, householdsData] = await Promise.all([
        paymentService.getAll(),
        householdService.getAll()
      ]);
      setPayments(paymentsData);
      setHouseholds(householdsData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDetails(true);
  };



  const handleMarkPaid = async (id: number) => {
    try {
      await paymentService.updateStatus(id, 'COMPLETED');
      await fetchData();
      toast.success('Payment marked as paid successfully!');
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const getHouseholdCode = (householdId: number) => {
    const household = households.find(h => h.id === householdId);
    return household?.householdName || 'Unknown';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <Button onClick={() => router.push('/wasteCompanyDashboard/payments/create')}>
            <Plus className="w-4 h-4 mr-2" />
            Create New Payment
          </Button>
        </div>

        <PaymentTable
          payments={payments as any}
          households={households as any}
          onView={handleView as any}
          onMarkPaid={handleMarkPaid as any}
        />

        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Payment Details</DialogTitle>
            </DialogHeader>
            {selectedPayment && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Household</label>
                  <p className="text-sm">{getHouseholdCode(selectedPayment.householdId)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="text-sm">{selectedPayment.amount.toLocaleString()} RWF</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <p className="text-sm capitalize">{selectedPayment.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Method</label>
                  <p className="text-sm capitalize">{selectedPayment.paymentMethod}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Reference</label>
                  <p className="text-sm">{selectedPayment.reference || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Payment Date</label>
                  <p className="text-sm">
                    {new Date(selectedPayment.paymentDate).toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowDetails(false)}>Close</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
    </div>
  );
}