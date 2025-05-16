import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  date: string;
};

type OverdueInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
};

type InvoiceDraftResponse = {
  pdfUrl: string;
  previewUrl: string;
};

async function fetchOrders(): Promise<Order[]> {
  const response = await fetch('/api/orders');
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return response.json();
}

async function fetchOverdueInvoices(): Promise<OverdueInvoice[]> {
  const response = await fetch('/api/billing/overdue');
  if (!response.ok) {
    throw new Error('Failed to fetch overdue invoices');
  }
  return response.json();
}

async function generateInvoiceDraft(orderId: string): Promise<InvoiceDraftResponse> {
  const response = await fetch('/api/billing/invoice-draft', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate invoice');
  }
  return response.json();
}

export function InvoiceAssistant() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
  });

  const { data: overdueInvoices, isLoading: isLoadingOverdue } = useQuery({
    queryKey: ['overdueInvoices'],
    queryFn: fetchOverdueInvoices,
    enabled: false, // Only fetch when explicitly requested
  });

  const { mutate: generateInvoice, data: invoiceData, isPending: isGeneratingInvoice } = useMutation({
    mutationFn: generateInvoiceDraft,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOrderId) {
      generateInvoice(selectedOrderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Generate Invoice Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Invoice</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
              Select Order
            </label>
            <select
              id="order"
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an order...</option>
              {orders?.map((order) => (
                <option key={order.id} value={order.id}>
                  {order.orderNumber} - {order.customerName} (${order.total.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={isGeneratingInvoice || !selectedOrderId}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isGeneratingInvoice ? 'Generating...' : 'Generate Invoice'}
          </button>
        </form>

        {/* Invoice Preview */}
        {invoiceData && (
          <div className="mt-6">
            <h4 className="font-medium mb-2">Invoice Preview</h4>
            <div className="border rounded-lg p-4">
              <iframe
                src={invoiceData.previewUrl}
                className="w-full h-96"
                title="Invoice Preview"
              />
              <div className="mt-4 flex justify-end">
                <a
                  href={invoiceData.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overdue Invoices */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Overdue Invoices</h3>
          <button
            onClick={() => fetchOverdueInvoices()}
            disabled={isLoadingOverdue}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            Check Overdues
          </button>
        </div>

        {overdueInvoices && overdueInvoices.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Overdue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {overdueInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {invoice.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${invoice.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      {invoice.daysOverdue} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            {isLoadingOverdue ? (
              'Loading overdue invoices...'
            ) : (
              'No overdue invoices found'
            )}
          </div>
        )}
      </div>
    </div>
  );
} 