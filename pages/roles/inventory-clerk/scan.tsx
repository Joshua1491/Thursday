/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { RoleGuard } from '../../../components/RoleGuard';
import { RfidConnectionManager } from '../../../components/RfidConnectionManager';
import { saveFabric } from '../../../lib/api-client';
import { Toaster } from 'react-hot-toast';

type Fabric = {
  epc: string;
  name: string;
  colour: string;
  weight: number;
  location: string;
  tagIssuedOn: string;
  rollType: string;
};

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedEpc, setLastScannedEpc] = useState<string | null>(null);

  const handleScan = async (epc: string) => {
    try {
      setLastScannedEpc(epc);
      
      // Create a new fabric entry with default values
      const newFabric: Fabric = {
        epc,
        name: 'New Fabric',
        colour: 'Unknown',
        weight: 0,
        location: 'Pending',
        tagIssuedOn: new Date().toISOString().split('T')[0],
        rollType: 'Standard'
      };

      await saveFabric(newFabric);
    } catch (error) {
      console.error('Error saving fabric:', error);
    }
  };

  return (
    <RoleGuard allowedRoles={['Inventory Clerk']}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Toaster position="top-right" />
          
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Scan Fabric Rolls
            </h1>

            <div className="mb-8">
              <RfidConnectionManager
                onScan={handleScan}
                isScanning={isScanning}
                onScanningChange={setIsScanning}
              />
            </div>

            {lastScannedEpc && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Last Scanned EPC
                </h2>
                <p className="text-blue-700 font-mono">{lastScannedEpc}</p>
              </div>
            )}

            <div className="mt-8 text-sm text-gray-600">
              <p className="mb-2">Instructions:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Connect your RFID reader</li>
                <li>Click "Start Scanning" to begin</li>
                <li>Scan fabric rolls to automatically save them</li>
                <li>Click "Stop Scanning" when finished</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
} 