'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Bell,
  MessageSquare,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Home,
  Trash2,
  DollarSign,
  History
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CollectionSchedule {
  id: string;
  date: string;
  time: string;
  wasteType: string;
  status: 'scheduled' | 'completed' | 'missed';
  address: string;
}

interface Payment {
  id: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'overdue';
  description: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

export default function UserDashboard() {
  const router = useRouter();
  const [userStats, setUserStats] = useState({
    nextCollection: 'Tomorrow, 8:00 AM',
    pendingPayment: 25.00,
    totalCollections: 12,
    status: 'Active',
    monthlyWaste: 45,
    recyclingRate: 78
  });

  const [schedules, setSchedules] = useState<CollectionSchedule[]>([
    {
      id: '1',
      date: '2024-01-15',
      time: '08:00 AM',
      wasteType: 'General Waste',
      status: 'scheduled',
      address: '123 Kigali Street, Kicukiro'
    },
    {
      id: '2',
      date: '2024-01-22',
      time: '08:00 AM',
      wasteType: 'Recyclables',
      status: 'scheduled',
      address: '123 Kigali Street, Kicukiro'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: '1',
      amount: 25.00,
      date: '2024-01-01',
      status: 'pending',
      description: 'Monthly waste collection fee'
    },
    {
      id: '2',
      amount: 25.00,
      date: '2023-12-01',
      status: 'paid',
      description: 'Monthly waste collection fee'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Collection Reminder',
      message: 'Your waste collection is scheduled for tomorrow at 8:00 AM',
      time: '2 hours ago',
      read: false,
      type: 'info'
    },
    {
      id: '2',
      title: 'Payment Due',
      message: 'Your monthly payment of $25.00 is due soon',
      time: '1 day ago',
      read: false,
      type: 'warning'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'missed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info': return <Bell className="text-blue-500" size={16} />;
      case 'warning': return <AlertCircle className="text-yellow-500" size={16} />;
      case 'success': return <CheckCircle className="text-green-500" size={16} />;
      default: return <Bell className="text-gray-500" size={16} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Household Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your waste collection services</p>
        </div>
        <Button 
          onClick={() => router.push('/User-Dashboard/Notifications')}
          className="relative"
        >
          <Bell size={20} />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/User-Dashboard/Schedule')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Collection</p>
                <p className="text-lg font-bold text-green-600">{userStats.nextCollection}</p>
              </div>
              <Calendar className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/User-Dashboard/Payments')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Payment</p>
                <p className="text-lg font-bold text-orange-600">${userStats.pendingPayment.toFixed(2)}</p>
              </div>
              <CreditCard className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push('/User-Dashboard/History')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Collections</p>
                <p className="text-lg font-bold text-blue-600">{userStats.totalCollections}</p>
              </div>
              <Trash2 className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-lg font-bold text-green-600">{userStats.status}</p>
              </div>
              <Users className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="text-green-600" size={20} />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Monthly Waste (kg)</span>
                  <span className="text-sm font-medium">{userStats.monthlyWaste} kg</span>
                </div>
                <Progress value={(userStats.monthlyWaste / 50) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600">Recycling Rate</span>
                  <span className="text-sm font-medium">{userStats.recyclingRate}%</span>
                </div>
                <Progress value={userStats.recyclingRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="text-blue-600" size={20} />
              Recent Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {notifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  )}
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/User-Dashboard/Notifications')}
            >
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Collections & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="text-green-600" size={20} />
              Upcoming Collections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{schedule.wasteType}</p>
                    <p className="text-sm text-gray-600">{schedule.address}</p>
                    <p className="text-xs text-gray-500">{schedule.date} at {schedule.time}</p>
                  </div>
                  <Badge className={getStatusColor(schedule.status)}>
                    {schedule.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/User-Dashboard/Schedule')}
            >
              View Full Schedule
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="text-orange-600" size={20} />
              Recent Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{payment.description}</p>
                    <p className="text-sm text-gray-600">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${payment.amount.toFixed(2)}</p>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => router.push('/User-Dashboard/Payments')}
            >
              View Payment History
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/User-Dashboard/Schedule')}
            >
              <Calendar size={20} />
              <span className="text-sm mt-1">Schedule</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/User-Dashboard/Complaints')}
            >
              <MessageSquare size={20} />
              <span className="text-sm mt-1">Complaints</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/User-Dashboard/Payments')}
            >
              <CreditCard size={20} />
              <span className="text-sm mt-1">Payments</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/User-Dashboard/History')}
            >
              <History size={20} />
              <span className="text-sm mt-1">History</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-20 flex-col"
              onClick={() => router.push('/admin')}
            >
              <TrendingUp size={20} />
              <span className="text-sm mt-1">Admin Panel</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
