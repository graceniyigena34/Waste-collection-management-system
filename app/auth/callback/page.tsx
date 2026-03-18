'use client'
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const email = searchParams.get('email');
    const fullName = searchParams.get('fullName');
    const userId = searchParams.get('userId');

    if (token && role) {
      // Store auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_info', JSON.stringify({
        userId,
        email,
        fullName,
        role
      }));

      toast.success('Login successful!');

      // Role-based routing
      if (role === 'ADMIN') {
        router.push('/Supper-dashboard');
      } else if (role === 'COMPANY_MANAGER') {
        // Check for status in params
        const status = searchParams.get('status');
        if (status) {
          localStorage.setItem('company_status', status);
        }

        const onboardingDone = localStorage.getItem('onboarding_completed');
        if (!onboardingDone) {
          router.push('/onboarding');
        } else {
          router.push('/company-status');
        }
      } else if (role === 'CITIZEN') {
        router.push('/User-Dashboard');
      } else {
        router.push('/');
      }
    } else {
      toast.error('Authentication failed');
      router.push('/signin');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
        <p className="text-text-dark dark:text-text-light">Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-green animate-spin mx-auto mb-4" />
          <p className="text-text-dark dark:text-text-light">Loading...</p>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}
