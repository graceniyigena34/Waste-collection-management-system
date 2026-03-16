'use client';

import { useRouter } from 'next/navigation';
import { Truck, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function DriverDashboardHome() {
  const router = useRouter();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your collection sessions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card 
          onClick={() => router.push('/driverDashboard/sessions')}
          className="cursor-pointer hover:shadow-lg transition-shadow rounded-2xl border-green-100"
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Truck className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">My Sessions</p>
                <p className="text-2xl font-bold text-gray-900">View All</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <CheckCircle className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
