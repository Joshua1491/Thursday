import React, { useState } from 'react';

type Props = { onScan: (epc: string) => void };

export default function Scanner({ onScan }: Props) {
  const [value, setValue] = useState('');

  return (
    <div className="flex gap-2">
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder="Paste or scan EPC"
        className="border rounded px-2 py-1 flex-1 text-sm"
      />
      <button
        className="bg-blue-600 text-white px-3 py-1 rounded"
        onClick={() => {
          if (value.trim()) {
            onScan(value.trim());
            setValue('');
          }
        }}
      >
        Add EPC
      </button>
    </div>
  );
} 