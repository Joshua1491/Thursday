import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface NavItem {
  key: string;
  label: string;
  path: string;
}

const mdNav: NavItem[] = [
  { key: 'sales',     label: 'Sales',       path: '/roles/managing-director/sales' },
  { key: 'returns',   label: 'Returns',     path: '/roles/managing-director/returns' },
  { key: 'purchases', label: 'Purchases',   path: '/roles/managing-director/purchases' },
  { key: 'inventory', label: 'Inventory',   path: '/roles/managing-director/inventory' },
  { key: 'ai',        label: 'AI Insights', path: '/roles/managing-director/ai-insights' }
];

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState<{ roles: string[] }>({ roles: [] });

  useEffect(() => {
    const json = localStorage.getItem('user');
    if (json) setUser(JSON.parse(json));
  }, []);

  const navItems: NavItem[] = [];
  if (user.roles.includes('IT Team Admin')) {
    navItems.push(
      { key: 'it-team-admin-dashboard', label: 'Dashboard', path: '/roles/it-team-admin/dashboard' },
      { key: 'it-team-admin-users',     label: 'Users',     path: '/roles/it-team-admin/users' },
      { key: 'it-team-admin-audit-logs',label: 'Audit Logs', path: '/roles/it-team-admin/audit-logs' },
      { key: 'it-team-admin-settings',  label: 'Settings',  path: '/roles/it-team-admin/settings' },
    );
  }
  if (user.roles.includes('Warehouse Manager')) {
    navItems.push({ key: 'warehouse-manager-inventory', label: 'Inventory', path: '/roles/warehouse-manager/inventory' });
  }
  if (user.roles.includes('Inventory Clerk')) {
    navItems.push({ key: 'inventory-clerk-scan', label: 'Scan', path: '/roles/inventory-clerk/scan' });
  }
  if (user.roles.includes('Quality Inspector')) {
    navItems.push({ key: 'quality-inspector-inspections', label: 'Inspections', path: '/roles/quality-inspector/inspections' });
  }

  return (
    <div className="flex min-h-screen">
      <aside className="flex flex-col w-64 bg-gray-800 text-white p-6 h-screen">
        {/* Push the menu down by ~1in (4rem) */}
        <div className="mt-16"></div>

        <ul className="space-y-1">
          {mdNav.map(item => (
            <li key={item.key}>
              <Link
                href={item.path}
                className="block px-4 py-2 rounded hover:bg-gray-700"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <button
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            onClick={() => {
              localStorage.clear();
              router.replace('/login');
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-6 bg-gray-50">{children}</main>
    </div>
  );
};

export default Layout; 