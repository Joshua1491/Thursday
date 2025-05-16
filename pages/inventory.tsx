import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';

type Fabric = {
  epc: string;
  name: string;
  colour: string;
  weight: number;
  location: string;
};

const fetchFabrics = async (): Promise<Fabric[]> => {
  const response = await fetch('/api/fabrics');
  if (!response.ok) {
    throw new Error('Failed to fetch fabrics');
  }
  return response.json();
};

const Inventory = () => {
  const router = useRouter();
  const [filter, setFilter] = useState('');

  const { data, isLoading, error } = useQuery<Fabric[]>({
    queryKey: ['fabrics'],
    queryFn: fetchFabrics,
  });

  const filteredFabrics = data?.filter((fabric) => {
    const searchTerm = filter.toLowerCase();
    return (
      fabric.epc.toLowerCase().includes(searchTerm) ||
      fabric.name.toLowerCase().includes(searchTerm) ||
      fabric.location.toLowerCase().includes(searchTerm)
    );
  });

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
          Error: {error instanceof Error ? error.message : 'Failed to load fabrics'}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Inventory</h1>
        <input
          type="text"
          placeholder="Search by EPC, name, or location..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EPC
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Weight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredFabrics?.map((fabric) => (
              <tr key={fabric.epc} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {fabric.epc}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {fabric.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {fabric.colour}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {fabric.weight}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {fabric.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <button
                    onClick={() => router.push(`/fabrics/${fabric.epc}`)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory; 