import type { NextApiRequest, NextApiResponse } from 'next';

type Order = {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  date: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Order[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  // Mock data - replace with actual database query
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'Acme Corporation',
      total: 1250.00,
      date: '2024-03-20',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Globex Industries',
      total: 875.50,
      date: '2024-03-21',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Stark Enterprises',
      total: 2340.75,
      date: '2024-03-22',
    },
  ];

  res.status(200).json(orders);
} 