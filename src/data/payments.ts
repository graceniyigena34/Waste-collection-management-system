export interface Payment {
  id: string;
  household_id: string;
  tariff_rule_id: string;
  period_month: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  transaction_ref?: string;
  paid_at?: string;
  channel?: 'mobile_money' | 'bank_transfer' | 'cash' | 'card';
}

export const dummyPayments: Payment[] = [
  {
    id: "pay_001",
    household_id: "1",
    tariff_rule_id: "tariff_001",
    period_month: "2024-01",
    amount: 5000,
    status: "paid",
    transaction_ref: "TXN123456789",
    paid_at: "2024-01-15T10:30:00Z",
    channel: "mobile_money"
  },
  {
    id: "pay_002",
    household_id: "2",
    tariff_rule_id: "tariff_002",
    period_month: "2024-01",
    amount: 7500,
    status: "pending",
    transaction_ref: undefined,
    paid_at: undefined,
    channel: undefined
  },
  {
    id: "pay_003",
    household_id: "3",
    tariff_rule_id: "tariff_001",
    period_month: "2024-01",
    amount: 5000,
    status: "overdue",
    transaction_ref: undefined,
    paid_at: undefined,
    channel: undefined
  }
];

export const paymentChannels = [
  { value: 'mobile_money', label: 'Mobile Money' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' }
];

export const paymentStatuses = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'cancelled', label: 'Cancelled' }
];