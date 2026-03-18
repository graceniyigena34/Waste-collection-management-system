"use client";

import { useState, useEffect } from "react";
import { Download, Eye, FileText } from "lucide-react";
import { toast } from "react-toastify";
import invoiceService, { Invoice } from "@/lib/invoice-service";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(data);
    } catch (error) {
      toast.error('Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-700";
      case "PENDING": return "bg-yellow-100 text-yellow-700";
      case "OVERDUE": return "bg-red-100 text-red-700";
      case "CANCELLED": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setViewingInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    const invoiceContent = `
INVOICE

Invoice Number: ${invoice.invoiceNumber}
Issue Date: ${invoice.issueDate}
Due Date: ${invoice.dueDate}
Amount: ${invoice.amount} RWF
Status: ${invoice.status}

Thank you for your business!
Greenex Waste Management
    `;
    
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-dark-bg mb-6">Invoices</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-dark-bg">Invoice Number</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-bg">Issue Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-bg">Due Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-bg">Amount</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-bg">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-dark-bg">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-dark-bg">{invoice.invoiceNumber}</td>
                    <td className="py-3 px-4 text-gray-700">{new Date(invoice.issueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-gray-700">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4 font-semibold text-dark-bg">{invoice.amount} RWF</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewInvoice(invoice)}
                          className="p-2 text-primary-green hover:bg-primary-green/10 rounded"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDownloadInvoice(invoice)}
                          className="p-2 text-primary-green hover:bg-primary-green/10 rounded"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      {viewingInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewingInvoice(null)}>
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary-green" />
                  <h3 className="text-2xl font-bold text-dark-bg">Invoice Details</h3>
                </div>
                <button 
                  onClick={() => setViewingInvoice(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4 border-t border-b border-gray-200 py-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Invoice Number:</span>
                  <span className="font-semibold text-dark-bg">{viewingInvoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Issue Date:</span>
                  <span className="font-semibold text-dark-bg">{new Date(viewingInvoice.issueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Due Date:</span>
                  <span className="font-semibold text-dark-bg">{new Date(viewingInvoice.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-dark-bg text-xl">{viewingInvoice.amount} RWF</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(viewingInvoice.status)}`}>
                    {viewingInvoice.status}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button 
                  onClick={() => handleDownloadInvoice(viewingInvoice)}
                  className="flex-1 bg-primary-green text-white px-4 py-3 rounded-lg hover:bg-secondary-green flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Invoice
                </button>
                <button 
                  onClick={() => setViewingInvoice(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
