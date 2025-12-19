'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleRegister = async (data) => {
    setLoading(true);
    const result = await register(data.username, data.email, data.password);
    setLoading(false);

    if (result.success) {
      router.push('/chat');
    }

    return result;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <AuthForm mode="register" onSubmit={handleRegister} loading={loading} />
    </div>
  );
}

