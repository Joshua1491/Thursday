import React from 'react';
import {
  useFabrics,
  useDeleteFabric
} from '../../hooks/useFabrics';

export default function FabricListPage() {
  const { data: fabrics = [], isLoading } = useFabrics();
  const del = useDeleteFabric();

  if (isLoading) return <p className="p-6">Loading…</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Fabric Inventory</h1>
        <a
          href="/fabrics/create"
          className="bg-blue-600 text-white rounded px-3 py-1"
        >
          + Add
        </a>
      </div>

      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">EPC</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Location</th>
            <th className="p-2 w-24"></th>
          </tr>
        </thead>
        <tbody>
          {fabrics.map((f: any) => (
            <tr key={f.epc} className="border-t hover:bg-gray-50">
              <td className="p-2">{f.epc}</td>
              <td className="p-2">{f.name}</td>
              <td className="p-2">{f.location}</td>
              <td className="p-2">
                <button
                  className="text-red-600 hover:underline"
                  onClick={() => del.mutate(f.epc)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 