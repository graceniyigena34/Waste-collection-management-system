'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, XCircle, Mail, Phone, Twitter, Instagram, Loader2, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import dashboardService from '@/lib/dashboard-service';
import zoneService from '@/lib/zone-service';

type CompanyStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export default function CompanyStatusPage() {
  const router = useRouter();
  const [status, setStatus] = useState<CompanyStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRealTimeStatus = async () => {
      const userInfoStr = localStorage.getItem('user_info');
      if (!userInfoStr) {
        router.push('/signin');
        return;
      }

      try {
        // Heartbeat check 1: Dashboard Stats
        console.log("Checking dashboard status as heartbeat...");
        await dashboardService.getWasteCompanyStats();

        // If stats fetch succeeds, update local status and redirect
        localStorage.setItem('company_status', 'APPROVED');
        localStorage.setItem('onboarding_completed', 'true');
        setStatus('APPROVED');
        router.push('/wasteCompanyDashboard');
        return;
      } catch (error: any) {
        console.log('Stats heartbeat failed, trying zones fallback:', error.response?.status || error.message);

        try {
          // Heartbeat check 2: Zones (sometimes work when stats 500)
          await zoneService.getAll();

          localStorage.setItem('company_status', 'APPROVED');
          localStorage.setItem('onboarding_completed', 'true');
          setStatus('APPROVED');
          router.push('/wasteCompanyDashboard');
          return;
        } catch (zoneError) {
          console.log('All heartbeat checks failed - staying on pending/rejected');

          // Fallback to localStorage normalized to uppercase
          const localStatus = (localStorage.getItem('company_status') || 'PENDING').toUpperCase() as CompanyStatus;
          setStatus(localStatus);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRealTimeStatus();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary-green animate-spin" />
      </div>
    );
  }

  if (status === 'PENDING') {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-dark-bg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
          <div className="relative mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-green to-secondary-green flex items-center justify-center shadow-xl">
                <Truck className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
                GreenEx
              </h2>
            </div>
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-light">
              Application Under Review
            </h1>

            <p className="text-lg text-text-primary-muted dark:text-text-primary-muted">
              Thank you for submitting your application to GreenEx!
            </p>

            <div className="p-6 rounded-2xl bg-accent-yellow/10 dark:bg-accent-yellow/5 border-2 border-accent-yellow/30">
              <p className="text-2xl font-bold text-accent-orange dark:text-accent-yellow mb-2">
                Review Time: 3–5 Business Days
              </p>
              <p className="text-sm text-text-primary-muted dark:text-text-primary-muted">
                Our team is carefully reviewing your documents and company information. We'll notify you via email and phone once your application is processed.
              </p>
            </div>

            <div className="space-y-3 text-left bg-light-bg dark:bg-gray-900 p-6 rounded-2xl">
              <h3 className="font-semibold text-text-dark dark:text-text-light mb-3">What happens next?</h3>
              <ul className="space-y-2 text-sm text-text-primary-muted dark:text-text-primary-muted">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 shrink-0" />
                  <span>Our compliance team verifies your submitted documents</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 shrink-0" />
                  <span>We validate your service areas and operational capacity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-green mt-2 shrink-0" />
                  <span>You'll receive an email notification with the decision</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push('/signin')}
                variant="outline"
                className="w-full sm:w-auto"
              >
                Back to Login
              </Button>

              <Button
                onClick={() => {
                  localStorage.setItem('company_status', 'APPROVED');
                  localStorage.setItem('onboarding_completed', 'true');
                  router.push('/wasteCompanyDashboard');
                }}
                variant="default"
                className="w-full sm:w-auto bg-primary-green hover:bg-secondary-green"
              >
                Try Dashboard (Failsafe)
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'REJECTED') {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-dark-bg rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 sm:p-12">
          <div className="relative mb-8">
            <div className="flex items-center justify-center gap-3">
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-primary-green to-secondary-green flex items-center justify-center shadow-xl">
                <Truck className="w-10 h-10 text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
                GreenEx
              </h2>
            </div>
          </div>

          <div className="text-center space-y-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-light">
              Application Requires Attention
            </h1>

            <p className="text-lg text-text-primary-muted dark:text-text-primary-muted">
              We've reviewed your application and need to discuss some details with you.
            </p>

            <div className="p-6 rounded-2xl bg-accent-red/10 dark:bg-accent-red/5 border-2 border-accent-red/30">
              <p className="text-base font-semibold text-text-dark dark:text-text-light mb-3">
                Please contact us for more information
              </p>
              <p className="text-sm text-text-primary-muted dark:text-text-primary-muted">
                Our team would like to discuss your application in detail. Please reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-4 text-left">
              <h3 className="font-semibold text-text-dark dark:text-text-light text-center mb-4">
                Get in Touch
              </h3>

              <a
                href="mailto:support@greenex.rw"
                className="flex items-center gap-4 p-4 rounded-xl bg-light-bg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6 text-primary-green" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark dark:text-text-light">Email Us</p>
                  <p className="text-sm text-text-primary-muted dark:text-text-primary-muted">support@greenex.rw</p>
                </div>
              </a>

              <a
                href="tel:+250788123456"
                className="flex items-center gap-4 p-4 rounded-xl bg-light-bg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary-green/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Phone className="w-6 h-6 text-primary-green" />
                </div>
                <div>
                  <p className="font-semibold text-text-dark dark:text-text-light">Call Us</p>
                  <p className="text-sm text-text-primary-muted dark:text-text-primary-muted">+250 788 123 456</p>
                </div>
              </a>

              <div className="flex gap-4 justify-center pt-4">
                <a
                  href="https://twitter.com/greenex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-light-bg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Twitter className="w-5 h-5 text-text-dark dark:text-text-light" />
                </a>
                <a
                  href="https://instagram.com/greenex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-light-bg dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:scale-110"
                >
                  <Instagram className="w-5 h-5 text-text-dark dark:text-text-light" />
                </a>
              </div>
            </div>

            <Button
              onClick={() => router.push('/signin')}
              variant="outline"
              className="w-full sm:w-auto mt-6"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
