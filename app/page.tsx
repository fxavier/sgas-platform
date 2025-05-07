'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/auth-context';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.institution) {
      router.push(`/${user.institution}/dashboard`);
    } else {
      router.push('/dashboard');
    }
  }, [user, router]);

  return null;
}