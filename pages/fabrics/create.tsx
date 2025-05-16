import React from 'react';
import { useRouter } from 'next/router';
import { useCreateFabric } from '../../hooks/useFabrics';
import Scanner from '../../components/Scanner';
import FabricForm, { FabricPayload } from '../../components/FabricForm';

export default function CreateFabricPage() {
  const router = useRouter();
  const create = useCreateFabric();

  const handleSubmit = (data: FabricPayload) =>
    create.mutate(data, { onSuccess: () => router.push('/fabrics') });

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">New Fabric Roll</h1>

      {/* Scan EPC quickly */}
      <Scanner onScan={epc => create.mutate({ epc } as any)} />

      {/* Full detail form */}
      <FabricForm onSubmit={handleSubmit} />
    </div>
  );
} 