import type { NextApiRequest, NextApiResponse } from 'next';

type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
};

// Mock data for reminders
const mockReminders: Reminder[] = [
  {
    id: '1',
    title: 'Board Meeting',
    date: new Date().toISOString(),
    time: '10:00 AM',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Review Q2 Reports',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    time: '2:00 PM',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Team Briefing',
    date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    time: '11:00 AM',
    priority: 'low',
  },
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Reminder[]>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  res.status(200).json(mockReminders);
} 