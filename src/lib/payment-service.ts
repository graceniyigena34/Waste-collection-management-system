export interface Payment {
  id: number;
  householdId: number;
  householdName?: string;
  amount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER';
  paymentDate: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  reference?: string;
  createdAt: string;
}

export interface CreatePaymentData {
  householdId: number;
  amount: number;
  paymentMethod: 'CASH' | 'MOBILE_MONEY' | 'BANK_TRANSFER';
  reference?: string;
}

const mockPayments: Payment[] = [
  {
    id: 1,
    householdId: 1,
    householdName: 'Smith Family',
    amount: 5000,
    paymentMethod: 'MOBILE_MONEY',
    paymentDate: '2024-01-15',
    status: 'COMPLETED',
    reference: 'MM123456',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    householdId: 2,
    householdName: 'Johnson Family',
    amount: 7500,
    paymentMethod: 'CASH',
    paymentDate: '2024-01-10',
    status: 'PENDING',
    createdAt: '2024-01-10T14:30:00Z'
  }
];

class PaymentService {
  async getAll(): Promise<Payment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockPayments];
  }

  async getById(id: number): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const payment = mockPayments.find(p => p.id === id);
    if (!payment) throw new Error('Payment not found');
    return payment;
  }

  async create(data: CreatePaymentData): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newPayment: Payment = {
      ...data,
      id: Date.now(),
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    mockPayments.push(newPayment);
    return newPayment;
  }

  async updateStatus(id: number, status: 'COMPLETED' | 'FAILED'): Promise<Payment> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockPayments.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Payment not found');
    mockPayments[index].status = status;
    return mockPayments[index];
  }
}

export default new PaymentService();
