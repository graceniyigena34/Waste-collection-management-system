'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Truck, 
  Calendar, 
  CheckCircle, 
  Clock, 
  MapPin, 
  Users,
  AlertCircle,
  TrendingUp,
  Navigation,
  DollarSign,
  BarChart3,
  Play,
  Pause,
  Square,
  LogOut
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CollectionSession {
  id: string;
  zone: string;
  route: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'paused';
  households: number;
  completed: number;
  wasteCollected: number;
  estimatedTime: string;
}

interface DriverStats {
  todaySessions: number;
  completedSessions: number;
  totalHouseholds: number;
  completedHouseholds: number;
  wasteCollected: number;
  earnings: number;
  efficiency: number;
}

export default function DriverDashboard() {
  const router = useRouter();
  const [currentSession, setCurrentSession] = useState<CollectionSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  
  const [driverStats, setDriverStats] = useState<DriverStats>({
    todaySessions: 3,
    completedSessions: 2,
    totalHouseholds: 45,
    completedHouseholds: 38,
    wasteCollected: 280,
    earnings: 145.50,
    efficiency: 84
  });

  const [todaySessions, setTodaySessions] = useState<CollectionSession[]>([
    {
      id: '1',
      zone: 'Kicukiro Zone A',
      route: 'Route A-1',
      startTime: '08:00 AM',
      endTime: '11:30 AM',
      status: 'completed',
      households: 15,
      completed: 15,
      wasteCollected: 95,
      estimatedTime: '3h 30m'
    },
    {
      id: '2',
      zone: 'Gasabo Zone B',
      route: 'Route B-2',
      startTime: '12:00 PM',
      endTime: '02:30 PM',
      status: 'completed',
      households: 12,
      completed: 12,
      wasteCollected: 78,
      estimatedTime: '2h 30m'
    },
    {
      id: '3',
      zone: 'Nyarugenge Zone C',
      route: 'Route C-3',
      startTime: '03:00 PM',
      status: 'scheduled',
      households: 18,
      completed: 0,
      wasteCollected: 0,
      estimatedTime: '3h 15m'
    },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSessionActive && currentSession) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSessionActive, currentSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startSession = (session: CollectionSession) => {
    setCurrentSession(session);
    setIsSessionActive(true);
    setSessionTime(0);
  };

  const pauseSession = () => {
    setIsSessionActive(false);
  };

  const resumeSession = () => {
    setIsSessionActive(true);
  };

  const completeSession = () => {
    if (currentSession) {
      setTodaySessions(prev => prev.map(s => 
        s.id === currentSession.id 
          ? { ...s, status: 'completed' as const, endTime: new Date().toLocaleTimeString() }
          : s
      ));
    }
    setCurrentSession(null);
    setIsSessionActive(false);
    setSessionTime(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'scheduled': return 'text-yellow-600 bg-yellow-100';
      case 'paused': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const completionRate = currentSession 
    ? (currentSession.completed / currentSession.households) * 100
    : (driverStats.completedHouseholds / driverStats.totalHouseholds) * 100;

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    router.push('/signin');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your collection routes efficiently</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/driver/sessions')}>
            <Calendar size={20} className="mr-2" />
            All Sessions
          </Button>
          <Button onClick={() => router.push('/driver/sessions/new')}>
            <Truck size={20} className="mr-2" />
            New Session
          </Button>
          <Button variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400" onClick={handleLogout}>
            <LogOut size={20} className="mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Current Session Status */}
      {currentSession && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Truck className="text-blue-600" size={20} />
                Active Session: {currentSession.zone}
              </span>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(currentSession.status)}>
                  {currentSession.status}
                </Badge>
                <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                  {formatTime(sessionTime)}
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Route</p>
                <p className="font-medium">{currentSession.route}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="font-medium">{currentSession.completed}/{currentSession.households} households</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Waste Collected</p>
                <p className="font-medium">{currentSession.wasteCollected} kg</p>
              </div>
            </div>
            <div className="flex gap-2">
              {isSessionActive ? (
                <Button variant="outline" onClick={pauseSession}>
                  <Pause size={16} className="mr-2" />
                  Pause
                </Button>
              ) : (
                <Button onClick={resumeSession}>
                  <Play size={16} className="mr-2" />
                  Resume
                </Button>
              )}
              <Button variant="outline" onClick={() => router.push('/driver/sessions/map')}>
                <Navigation size={16} className="mr-2" />
                Navigate
              </Button>
              <Button variant="destructive" onClick={completeSession}>
                <Square size={16} className="mr-2" />
                Complete Session
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today&apos;s Sessions</p>
                <p className="text-2xl font-bold text-blue-600">{driverStats.todaySessions}</p>
              </div>
              <Calendar className="text-blue-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{driverStats.completedSessions}</p>
              </div>
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waste Collected</p>
                <p className="text-2xl font-bold text-purple-600">{driverStats.wasteCollected} kg</p>
              </div>
              <TrendingUp className="text-purple-600" size={24} />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today&apos;s Earnings</p>
                <p className="text-2xl font-bold text-orange-600">${driverStats.earnings.toFixed(2)}</p>
              </div>
              <DollarSign className="text-orange-600" size={24} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} />
            Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todaySessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{session.zone}</h3>
                  <p className="text-sm text-gray-600">{session.route} • {session.startTime}</p>
                  <p className="text-xs text-gray-500">{session.households} households • {session.estimatedTime}</p>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                  {session.status === 'scheduled' && !currentSession && (
                    <Button 
                      size="sm" 
                      className="ml-2 mt-1"
                      onClick={() => startSession(session)}
                    >
                      Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="text-purple-600" size={20} />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{driverStats.efficiency}%</div>
              <p className="text-sm text-gray-600 mt-1">Daily Efficiency</p>
              <p className="text-xs text-gray-500">Based on route completion time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{(driverStats.wasteCollected / driverStats.completedHouseholds).toFixed(1)} kg</div>
              <p className="text-sm text-gray-600 mt-1">Average per Household</p>
              <p className="text-xs text-gray-500">Waste collected per stop</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{driverStats.completedHouseholds}</div>
              <p className="text-sm text-gray-600 mt-1">Households Served</p>
              <p className="text-xs text-gray-500">Total collections today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/driver/sessions')}>
              <Calendar size={20} />
              <span className="text-sm mt-1">Sessions</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/driver/sessions/map')}>
              <Navigation size={20} />
              <span className="text-sm mt-1">Navigation</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/driver/profile')}>
              <Users size={20} />
              <span className="text-sm mt-1">Profile</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col" onClick={() => router.push('/driver/earnings')}>
              <DollarSign size={20} />
              <span className="text-sm mt-1">Earnings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
