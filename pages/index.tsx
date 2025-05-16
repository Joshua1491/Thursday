import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

const IndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userStr = localStorage.getItem('user');
    let redirectTo = '/login';
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.roles.includes('Managing Director')) {
          redirectTo = '/roles/managing-director/personal-assistant';
        } else if (user.roles.includes('IT Team Admin')) {
          redirectTo = '/roles/it-team-admin/dashboard';
        } else if (user.roles.includes('System Admin')) {
          redirectTo = '/roles/system-admin/settings';
        } else if (user.roles.includes('Warehouse Manager')) {
          redirectTo = '/roles/warehouse-manager/inventory';
        } else if (user.roles.includes('Inventory Clerk')) {
          redirectTo = '/roles/inventory-clerk/scan';
        } else if (user.roles.includes('Quality Inspector')) {
          redirectTo = '/roles/quality-inspector/inspections';
        } else {
          redirectTo = '/login';
        }
      } catch {
        redirectTo = '/login';
      }
    }
    router.replace(redirectTo);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <p className="text-lg">Redirecting...</p>
    </div>
  );
};

export default IndexPage; 