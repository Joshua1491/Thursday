import type { NextApiRequest, NextApiResponse } from 'next';

type DashboardSummary = {
  sales: {
    total: number;
    growth: number;
  };
  returnsRate: {
    value: number;
    trend: 'up' | 'down' | 'stable';
  };
  inventoryValue: {
    total: number;
    change: number;
  };
  cashFlow: {
    current: number;
    previous: number;
  };
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DashboardSummary>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  // Mock data - in a real app, this would come from your database
  const summary: DashboardSummary = {
    sales: {
      total: 1250000,
      growth: 12.5,
    },
    returnsRate: {
      value: 2.8,
      trend: 'down',
    },
    inventoryValue: {
      total: 850000,
      change: -3.2,
    },
    cashFlow: {
      current: 450000,
      previous: 380000,
    },
  };

  res.status(200).json(summary);
} 