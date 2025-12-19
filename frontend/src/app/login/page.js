'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import AuthForm from '@/components/AuthForm';
import ToastContainer from '@/components/ToastContainer';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const { toasts, success, error, removeToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleLogin = async (data) => {
    setLoading(true);
    const result = await login(data.email, data.password);
    setLoading(false);

    if (result.success) {
      success('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/chat');
      }, 500);
    } else {
      error(result.message || 'Login failed');
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
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
        <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />
      </div>
    </>
  );
}

