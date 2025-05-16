import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import { RoleGuard } from '../../../components/RoleGuard';
// import { useChartData } from 'recharts'; // Placeholder for chart hooks if needed

interface DashboardSummary {
  totalRolls: number;
  totalWeight: number;
  locationsInUse: number;
  anomaliesCount: number;
  recentErrors: { timestamp: string; message: string }[];
  totalUsers: number;
  usersByRole: Record<string, number>;
}

async function fetchSummary() {
  const res = await fetch('/api/dashboard/summary');
  if (!res.ok) throw new Error('Failed to load dashboard');
  return res.json();
}

const overviewCards = [
  { key: 'totalRolls', label: 'Total Rolls' },
  { key: 'totalWeight', label: 'Total Weight (kg)' },
  { key: 'locationsInUse', label: 'Locations In Use' },
  { key: 'anomaliesCount', label: 'Anomalies' },
  { key: 'totalUsers', label: 'Total Users' },
];

const quickActions = [
  { label: 'Inventory', href: '/roles/it-team-admin/inventory' },
  { label: 'Users', href: '/roles/it-team-admin/users' },
  { label: 'Audit Logs', href: '/roles/it-team-admin/audit-logs' },
  { label: 'Settings', href: '/roles/it-team-admin/settings' },
];

const DashboardPage: React.FC = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchSummary,
  });
  const router = useRouter();

  return (
    <RoleGuard allowedRoles={['IT Team Admin']}>
      <Layout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">IT Team Admin Dashboard</h1>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {overviewCards.map(card => {
              let value: string | number = '-';
              if (!isLoading && !error && data) {
                const v = data[card.key as keyof DashboardSummary];
                value = typeof v === 'number' ? v : typeof v === 'string' ? v : '-';
              }
              return (
                <div key={card.key} className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
                  <div className="text-gray-500 text-sm mb-2">{card.label}</div>
                  <div className="text-3xl font-bold text-blue-700">
                    {isLoading ? '...' : error ? '-' : value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Users By Role */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="text-gray-500 text-sm mb-2">Users by Role</div>
            <div className="flex flex-wrap gap-4">
              {isLoading || error || !data?.usersByRole ? (
                <span className="text-gray-400">-</span>
              ) : (
                Object.entries(data.usersByRole).map(([role, count]) => (
                  <div key={role} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {role}: <span className="font-semibold">{String(count)}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Errors */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="text-gray-500 text-sm mb-2">Recent Errors</div>
            {isLoading ? (
              <div className="text-gray-400">Loading…</div>
            ) : error ? (
              <div className="text-red-500">Failed to load errors</div>
            ) : data?.recentErrors?.length ? (
              <ul className="divide-y divide-gray-200">
                {data.recentErrors.map((err, idx) => (
                  <li key={idx} className="py-2 flex flex-col">
                    <span className="text-xs text-gray-400">{err.timestamp}</span>
                    <span className="text-sm text-gray-700">{err.message}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-gray-400">No recent errors</div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="text-gray-500 text-sm mb-2">Quick Actions</div>
            <div className="flex flex-wrap gap-4">
              {quickActions.map(action => (
                <a
                  key={action.href}
                  href={action.href}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  {action.label}
                </a>
              ))}
            </div>
          </div>

          {/* Chart Placeholders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-64 text-gray-400">
              [Chart Placeholder 1]
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center justify-center h-64 text-gray-400">
              [Chart Placeholder 2]
            </div>
          </div>
        </div>
      </Layout>
    </RoleGuard>
  );
};

export default DashboardPage; 