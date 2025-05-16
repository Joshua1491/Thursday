import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

type Fabric = {
  epc: string;
  name: string;
  colour: string;
  weight: number;
  location: string;
  tagIssuedOn: string;
  rollType: string;
};

const fetchFabric = async (epc: string): Promise<Fabric> => {
  const response = await fetch(`/api/fabrics/${epc}`);
  if (!response.ok) {
    throw new Error('Failed to fetch fabric');
  }
  return response.json();
};

const updateFabric = async (fabric: Fabric): Promise<Fabric> => {
  const response = await fetch(`/api/fabrics/${fabric.epc}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(fabric),
  });
  if (!response.ok) {
    throw new Error('Failed to update fabric');
  }
  return response.json();
};

export default function FabricDetailPage() {
  const router = useRouter();
  const { epc } = router.query;
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [colour, setColour] = useState('');
  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('');
  const [tagIssuedOn, setTagIssuedOn] = useState('');
  const [rollType, setRollType] = useState('');

  // Fetch fabric data
  const { data: fabric, isLoading, error } = useQuery({
    queryKey: ['fabric', epc],
    queryFn: () => fetchFabric(epc as string),
    enabled: !!epc,
  });

  // Update mutation
  const mutation = useMutation({
    mutationFn: updateFabric,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fabrics'] });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
  });

  // Populate form when fabric data arrives
  useEffect(() => {
    if (fabric) {
      setName(fabric.name);
      setColour(fabric.colour);
      setWeight(fabric.weight.toString());
      setLocation(fabric.location);
      setTagIssuedOn(fabric.tagIssuedOn);
      setRollType(fabric.rollType);
    }
  }, [fabric]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fabric) return;

    mutation.mutate({
      ...fabric,
      name,
      colour,
      weight: parseFloat(weight),
      location,
      tagIssuedOn,
      rollType,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error instanceof Error ? error.message : 'Failed to load fabric'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Fabric</h1>
          <button
            onClick={() => router.push('/inventory')}
            className="text-blue-600 hover:text-blue-900"
          >
            ← Back to Inventory
          </button>
        </div>

        {showSuccess && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Changes saved successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              EPC
            </label>
            <input
              type="text"
              value={fabric?.epc}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-50"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Colour
            </label>
            <input
              type="text"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Weight
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tag Issued On
            </label>
            <input
              type="date"
              value={tagIssuedOn}
              onChange={(e) => setTagIssuedOn(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Roll Type
            </label>
            <input
              type="text"
              value={rollType}
              onChange={(e) => setRollType(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors ${
              mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {mutation.isPending ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
} 