"use client";

import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const isProtectedRoute = protectedRoutes.includes(pathname);
      const isPublicRoute = publicRoutes.includes(pathname);

      if (isProtectedRoute && !user) {
        router.push('/');
      }

      if (isPublicRoute && user) {
        router.push('/dashboard');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div>로딩중...</div>; // Or a spinner component
  }

  return <>{children}</>;
}
