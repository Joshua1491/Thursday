import type { NextApiRequest, NextApiResponse } from 'next';

type FocusBlock = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
};

type AutoSlotResponse = {
  focusBlocks: FocusBlock[];
};

// Mock data for focus blocks
function generateFocusBlocks(date: Date): FocusBlock[] {
  const blocks: FocusBlock[] = [];
  const baseDate = new Date(date);
  baseDate.setHours(9, 0, 0, 0); // Start at 9 AM

  // Generate morning focus blocks
  blocks.push({
    id: '1',
    startTime: new Date(baseDate.getTime() - 3600000).toISOString(), // 8 AM
    endTime: new Date(baseDate.getTime()).toISOString(), // 9 AM
    date: date.toISOString(),
  });

  // Generate afternoon focus blocks
  baseDate.setHours(14, 0, 0, 0); // 2 PM
  blocks.push({
    id: '2',
    startTime: new Date(baseDate.getTime() - 3600000).toISOString(), // 1 PM
    endTime: new Date(baseDate.getTime()).toISOString(), // 2 PM
    date: date.toISOString(),
  });

  // Generate evening focus blocks
  baseDate.setHours(17, 0, 0, 0); // 5 PM
  blocks.push({
    id: '3',
    startTime: new Date(baseDate.getTime() - 3600000).toISOString(), // 4 PM
    endTime: new Date(baseDate.getTime()).toISOString(), // 5 PM
    date: date.toISOString(),
  });

  return blocks;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<AutoSlotResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  const { date } = req.body;
  if (!date) {
    return res.status(400).json({ message: 'Date is required' } as any);
  }

  const focusBlocks = generateFocusBlocks(new Date(date));
  res.status(200).json({ focusBlocks });
} 