import { NextApiRequest, NextApiResponse } from 'next';

type Fabric = {
  epc: string;
  name: string;
  colour: string;
  weight: number;
  location: string;
  tagIssuedOn: string;
  rollType: string;
};

// Mock data for demonstration
const mockFabrics: Record<string, Fabric> = {
  'EPC123': {
    epc: 'EPC123',
    name: 'Cotton Blend',
    colour: 'Blue',
    weight: 150,
    location: 'Warehouse A',
    tagIssuedOn: '2024-03-20',
    rollType: 'Standard'
  },
  'EPC456': {
    epc: 'EPC456',
    name: 'Polyester',
    colour: 'Red',
    weight: 200,
    location: 'Warehouse B',
    tagIssuedOn: '2024-03-21',
    rollType: 'Premium'
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const fabrics = Object.values(mockFabrics);
  return res.status(200).json(fabrics);
} 