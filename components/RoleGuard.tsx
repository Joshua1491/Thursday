import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkRoles = () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) throw new Error('No user');
        const user = JSON.parse(userStr);
        const userRoles: string[] = user?.roles || [];
        const hasRole = userRoles.some(role => allowedRoles.includes(role));
        setAuthorized(hasRole);
        if (!hasRole) {
          router.replace('/login');
        }
      } catch {
        setAuthorized(false);
        router.replace('/login');
      } finally {
        setChecking(false);
      }
    };
    checkRoles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg font-semibold text-gray-700 animate-pulse">Loading…</div>
      </div>
    );
  }

  if (!authorized) return null;
  return <>{children}</>;
} 