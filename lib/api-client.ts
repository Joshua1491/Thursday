import { toast } from 'react-hot-toast';

type Fabric = {
  epc: string;
  name: string;
  colour: string;
  weight: number;
  location: string;
  tagIssuedOn: string;
  rollType: string;
};

export const saveFabric = async (fabric: Fabric): Promise<void> => {
  try {
    const response = await fetch(`/api/fabrics/${fabric.epc}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(fabric),
    });

    if (!response.ok) {
      throw new Error('Failed to save fabric');
    }

    toast.success('Fabric saved successfully!');
  } catch (error) {
    toast.error('Failed to save fabric');
    throw error;
  }
}; 