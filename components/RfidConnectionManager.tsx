import React, { useState, useEffect } from 'react';

type RfidConnectionManagerProps = {
  onScan: (epc: string) => void;
  isScanning: boolean;
  onScanningChange: (isScanning: boolean) => void;
};

export function RfidConnectionManager({
  onScan,
  isScanning,
  onScanningChange,
}: RfidConnectionManagerProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate RFID reader connection
  const connectReader = async () => {
    try {
      // In a real app, this would connect to the actual RFID reader
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setError('Failed to connect to RFID reader');
      setIsConnected(false);
    }
  };

  // Simulate RFID scanning
  useEffect(() => {
    if (!isConnected || !isScanning) return;

    const interval = setInterval(() => {
      // Simulate scanning a random EPC
      const randomEpc = `EPC${Math.floor(Math.random() * 1000)}`;
      onScan(randomEpc);
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected, isScanning, onScan]);

  return (
    <div className="space-y-4">
      {!isConnected ? (
        <button
          onClick={connectReader}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Connect RFID Reader
        </button>
      ) : (
        <button
          onClick={() => onScanningChange(!isScanning)}
          className={`w-full py-2 px-4 rounded transition-colors ${
            isScanning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isScanning ? 'Stop Scanning' : 'Start Scanning'}
        </button>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {isConnected && (
        <div className="text-sm text-gray-600">
          Status: {isScanning ? 'Scanning...' : 'Connected'}
        </div>
      )}
    </div>
  );
} 