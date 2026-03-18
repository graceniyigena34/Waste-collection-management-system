import { apiRequest } from './api-services';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  createdAt: string;
  householdId: string;
}

class InvoiceService {
  async getInvoices(): Promise<Invoice[]> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/invoices');

      // Mock data for now
      return [
        {
          id: '1',
          invoiceNumber: 'INV-2024-001',
          customerName: 'John Doe',
          amount: 25000,
          status: 'Paid',
          dueDate: '2024-03-15',
          createdAt: '2024-03-01',
          householdId: 'h1'
        },
        {
          id: '2',
          invoiceNumber: 'INV-2024-002',
          customerName: 'Jane Smith',
          amount: 30000,
          status: 'Pending',
          dueDate: '2024-03-20',
          createdAt: '2024-03-05',
          householdId: 'h2'
        }
      ];
    } catch (error) {
      console.error('Error fetching invoices:', error);
      throw error;
    }
  }

  async getInvoiceById(id: string): Promise<Invoice | null> {
    try {
      const invoices = await this.getInvoices();
      return invoices.find(inv => inv.id === id) || null;
    } catch (error) {
      console.error('Error fetching invoice:', error);
      throw error;
    }
  }

  async createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt'>): Promise<Invoice> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/invoices', 'POST', invoice);

      const newInvoice: Invoice = {
        ...invoice,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      return newInvoice;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/invoices/${id}/status`, 'PATCH', { status });
      console.log(`Updated invoice ${id} status to ${status}`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      throw error;
    }
  }
}

const invoiceService = new InvoiceService();
export default invoiceService;