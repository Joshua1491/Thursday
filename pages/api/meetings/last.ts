import type { NextApiRequest, NextApiResponse } from 'next';

type MeetingSummary = {
  id: string;
  date: string;
  summary: string;
  outstandingItems: {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeetingSummary>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  // Mock data - replace with actual database query
  const lastMeeting: MeetingSummary = {
    id: '1',
    date: '2024-03-15',
    summary: 'Quarterly review meeting focused on sales performance, inventory management, and upcoming initiatives. Key decisions were made regarding warehouse optimization and new supplier partnerships.',
    outstandingItems: [
      {
        id: '1',
        description: 'Implement new warehouse layout optimization',
        status: 'in-progress'
      },
      {
        id: '2',
        description: 'Finalize supplier contracts for Q2',
        status: 'pending'
      },
      {
        id: '3',
        description: 'Review and update inventory forecasting model',
        status: 'completed'
      },
      {
        id: '4',
        description: 'Schedule team training for new inventory system',
        status: 'pending'
      }
    ]
  };

  res.status(200).json(lastMeeting);
} 