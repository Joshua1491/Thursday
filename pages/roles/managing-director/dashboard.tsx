import React from 'react';
import { useRouter } from 'next/router';
import { RoleGuard } from '../../../components/RoleGuard';
import Layout from '../../../components/Layout';
// import { KpiSnapshot } from '../../../components/kpi/KpiSnapshot';

export default function ManagingDirectorDashboard() {
  // You may use router to determine which dashboard content to show if needed
  return (
    <RoleGuard allowedRoles={['Managing Director']}>
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-4">Managing Director Dashboard</h1>

          {/* Main dashboard content goes here. You can conditionally render content based on the route if needed. */}
          <div className="bg-white rounded-lg shadow p-6">
            {/* TEMP: Static content for debugging */}
            <div className="text-lg text-green-700">Welcome, David! The dashboard is working.</div>
          </div>
        </div>
      </Layout>
    </RoleGuard>
  );
} 