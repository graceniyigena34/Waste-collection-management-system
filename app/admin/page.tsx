'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Truck, 
  DollarSign, 
  AlertTriangle, 
  TrendingUp,
  BarChart3,
  Settings,
  FileText,
  Calendar,
  MapPin,
  CreditCard,
  MessageSquare,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface DashboardStats {
  households: number;
  collections: number;
  revenue: number;
  complaints: number;
  drivers: number;
  trucks: number;
}

interface RecentActivity {
  id: string;
  type: 'collection' | 'complaint' | 'payment' | 'driver';
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats] = useState<DashboardStats>({
    households: 2847,
    collections: 156,
    revenue: 85000,
    complaints: 12,
    drivers: 24,
    trucks: 18
  });

  const [recentActivities] = useState<RecentActivity[]>([
    {
      id: '1',
      type: 'collection',
      title: 'Collection Completed',
      description: 'Kicukiro Zone - 95 households served',
      time: '10 minutes ago',
      icon: <Truck className="text-green-600" size={16} />
    },
    {
      id: '2',
      type: 'complaint',
      title: 'New Complaint',
      description: 'Missed pickup reported in Gasabo',
      time: '2 hours ago',
      icon: <MessageSquare className="text-red-600" size={16} />
    },
    {
      id: '3',
      type: 'payment',
      title: 'Payment Received',
      description: 'Monthly payment from 45 households',
      time: '5 hours ago',
      icon: <DollarSign className="text-green-600" size={16} />
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your waste management operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/settings')}>
            <Settings size={20} className="mr-2" />
            Settings
          </Button>
          <Button onClick={() => router.push('/admin/reports')}>
            <FileText size={20} className="mr-2" />
            Reports
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Households</p>
                <p className="text-2xl font-bold text-blue-600">{stats.households.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% this month</p>
              </div>
              <Users className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today's Collections</p>
                <p className="text-2xl font-bold text-green-600">{stats.collections}</p>
                <p className="text-xs text-gray-500">85% completion rate</p>
              </div>
              <Truck className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold text-purple-600">{(stats.revenue / 1000).toFixed(0)}K RWF</p>
                <p className="text-xs text-green-600">+8% vs last month</p>
              </div>
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Complaints</p>
                <p className="text-2xl font-bold text-orange-600">{stats.complaints}</p>
                <p className="text-xs text-red-600">3 urgent</p>
              </div>
              <AlertTriangle className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Drivers</p>
                <p className="text-xl font-bold text-blue-600">{stats.drivers}</p>
              </div>
              <Users className="text-blue-600" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fleet Size</p>
                <p className="text-xl font-bold text-green-600">{stats.trucks} trucks</p>
              </div>
              <Truck className="text-green-600" size={20} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Efficiency Rate</p>
                <p className="text-xl font-bold text-purple-600">87%</p>
              </div>
              <TrendingUp className="text-purple-600" size={20} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="mt-1">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="text-purple-600" size={20} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/households')}>
                <Users size={20} />
                <span className="text-sm mt-1">Households</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/drivers')}>
                <Users size={20} />
                <span className="text-sm mt-1">Drivers</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/routes')}>
                <MapPin size={20} />
                <span className="text-sm mt-1">Routes</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/payments')}>
                <CreditCard size={20} />
                <span className="text-sm mt-1">Payments</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/complaints')}>
                <MessageSquare size={20} />
                <span className="text-sm mt-1">Complaints</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/admin/reports')}>
                <BarChart3 size={20} />
                <span className="text-sm mt-1">Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
