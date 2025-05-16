import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout';
import RoleGuard from '../components/RoleGuard';

interface DashboardSummary {
  totalRolls: number;
  totalWeight: number;
  locationsInUse: number;
  anomaliesCount: number;
}

async function fetchSummary(): Promise<DashboardSummary> {
  const res = await fetch('/api/dashboard/summary');
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardSummary>({
    queryKey: ['dashboard'],
    queryFn: fetchSummary,
  });

  if (isLoading) return (
    <Layout>
      <p>Loading…</p>
    </Layout>
  );
  if (error) return (
    <Layout>
      <p className="text-red-600">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
    </Layout>
  );

  const { totalRolls = '-', totalWeight = '-', locationsInUse = '-', anomaliesCount = '-' } = data || {};

  return (
    <RoleGuard allowedRoles={['IT Team Admin']}>
      <Layout>
        <h1 className="text-2xl font-bold mb-6">IT Team Admin Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Total Rolls</p>
            <p className="text-3xl font-semibold">{totalRolls}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Total Weight</p>
            <p className="text-3xl font-semibold">{totalWeight} kg</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Locations In Use</p>
            <p className="text-3xl font-semibold">{locationsInUse}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p>Anomalies</p>
            <p className="text-3xl font-semibold">{anomaliesCount}</p>
          </div>
        </div>
        {/* Navigation is now handled by the sidebar */}
      </Layout>
    </RoleGuard>
  );
} 