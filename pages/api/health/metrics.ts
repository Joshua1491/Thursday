import type { NextApiRequest, NextApiResponse } from 'next';

type HealthMetrics = {
  stepCount: number;
  sleepHours: number;
  heartRate: number;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthMetrics>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  // Mock data - replace with actual health metrics data
  const mockMetrics: HealthMetrics = {
    stepCount: 8432,
    sleepHours: 7.5,
    heartRate: 72,
  };

  res.status(200).json(mockMetrics);
} 