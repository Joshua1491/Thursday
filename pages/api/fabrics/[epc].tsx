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
  const { epc } = req.query;

  if (!epc || typeof epc !== 'string') {
    return res.status(400).json({ error: 'EPC is required' });
  }

  switch (req.method) {
    case 'GET':
      const fabric = mockFabrics[epc];
      if (!fabric) {
        return res.status(404).json({ error: 'Fabric not found' });
      }
      return res.status(200).json(fabric);

    case 'PUT':
      const updatedFabric = req.body as Fabric;
      if (!updatedFabric) {
        return res.status(400).json({ error: 'Invalid fabric data' });
      }
      mockFabrics[epc] = updatedFabric;
      return res.status(200).json(updatedFabric);

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 