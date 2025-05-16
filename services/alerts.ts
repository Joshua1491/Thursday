import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export type DashboardSummary = {
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

const THRESHOLDS = {
  salesGrowth: {
    warning: 5,
    critical: -5,
  },
  returnsRate: {
    warning: 3,
    critical: 5,
  },
  inventoryValue: {
    warning: -5,
    critical: -10,
  },
  cashFlow: {
    warning: -10,
    critical: -20,
  },
};

const fetchDashboardSummary = async (): Promise<DashboardSummary> => {
  const response = await fetch('/api/dashboard/summary');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard summary');
  }
  return response.json();
};

// Keep track of which alerts we've shown to avoid duplicates
const shownAlerts = new Set<string>();

const checkThresholds = (data: DashboardSummary) => {
  const alertKey = JSON.stringify(data);
  if (shownAlerts.has(alertKey)) return;
  shownAlerts.add(alertKey);

  // Check sales growth
  if (data.sales.growth <= THRESHOLDS.salesGrowth.critical) {
    toast.error(`Critical: Sales growth is down ${Math.abs(data.sales.growth)}%`);
  } else if (data.sales.growth <= THRESHOLDS.salesGrowth.warning) {
    toast.error(`Warning: Sales growth is down ${Math.abs(data.sales.growth)}%`);
  }

  // Check returns rate
  if (data.returnsRate.value >= THRESHOLDS.returnsRate.critical) {
    toast.error(`Critical: Returns rate is ${data.returnsRate.value}%`);
  } else if (data.returnsRate.value >= THRESHOLDS.returnsRate.warning) {
    toast.error(`Warning: Returns rate is ${data.returnsRate.value}%`);
  }

  // Check inventory value
  if (data.inventoryValue.change <= THRESHOLDS.inventoryValue.critical) {
    toast.error(`Critical: Inventory value decreased by ${Math.abs(data.inventoryValue.change)}%`);
  } else if (data.inventoryValue.change <= THRESHOLDS.inventoryValue.warning) {
    toast.error(`Warning: Inventory value decreased by ${Math.abs(data.inventoryValue.change)}%`);
  }

  // Check cash flow
  const cashFlowGrowth = ((data.cashFlow.current - data.cashFlow.previous) / data.cashFlow.previous) * 100;
  if (cashFlowGrowth <= THRESHOLDS.cashFlow.critical) {
    toast.error(`Critical: Cash flow decreased by ${Math.abs(cashFlowGrowth)}%`);
  } else if (cashFlowGrowth <= THRESHOLDS.cashFlow.warning) {
    toast.error(`Warning: Cash flow decreased by ${Math.abs(cashFlowGrowth)}%`);
  }
};

export function useAlerts() {
  return useQuery({
    queryKey: ['dashboardSummary'],
    queryFn: fetchDashboardSummary,
    refetchInterval: 60000, // Poll every minute
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 0,
  });
} 