import type { NextApiRequest, NextApiResponse } from 'next';

type OverdueInvoice = {
  id: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  dueDate: string;
  daysOverdue: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<OverdueInvoice[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  // Mock data - replace with actual database query
  const overdueInvoices: OverdueInvoice[] = [
    {
      id: '1',
      invoiceNumber: 'INV-2024-001',
      customerName: 'Acme Corporation',
      amount: 2500.00,
      dueDate: '2024-02-15',
      daysOverdue: 35,
    },
    {
      id: '2',
      invoiceNumber: 'INV-2024-002',
      customerName: 'Globex Industries',
      amount: 1750.50,
      dueDate: '2024-02-20',
      daysOverdue: 30,
    },
    {
      id: '3',
      invoiceNumber: 'INV-2024-003',
      customerName: 'Stark Enterprises',
      amount: 4680.75,
      dueDate: '2024-02-10',
      daysOverdue: 40,
    },
  ];

  res.status(200).json(overdueInvoices);
} 