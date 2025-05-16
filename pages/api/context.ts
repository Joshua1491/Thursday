import type { NextApiRequest, NextApiResponse } from 'next';
import type { DashboardSummary } from '../../services/alerts';

type RequestBody = {
  prompt: string;
  context: {
    userId: string;
    dashboardData: DashboardSummary;
  };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt, context } = req.body as RequestBody;

  if (!prompt || !context) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Set up streaming response
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  try {
    // TODO: Replace with actual OpenAI API call
    // This is a mock response for demonstration
    const mockResponse = `Based on your dashboard data:

1. Sales Performance:
   - Total Sales: ${context.dashboardData.sales.total}
   - Growth Rate: ${context.dashboardData.sales.growth}%

2. Returns Analysis:
   - Current Rate: ${context.dashboardData.returnsRate.value}%
   - Trend: ${context.dashboardData.returnsRate.trend}

3. Inventory Status:
   - Total Value: ${context.dashboardData.inventoryValue.total}
   - Change: ${context.dashboardData.inventoryValue.change}%

4. Cash Flow:
   - Current: ${context.dashboardData.cashFlow.current}
   - Previous: ${context.dashboardData.cashFlow.previous}

Would you like me to analyze any specific aspect of this data in more detail?`;

    // Simulate streaming by sending chunks
    const chunks = mockResponse.split('\n');
    for (const chunk of chunks) {
      res.write(chunk + '\n');
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
    }

    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 