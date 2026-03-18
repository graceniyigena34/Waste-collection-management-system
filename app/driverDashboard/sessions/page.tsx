/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import driverSessionService from '@/lib/driver-session-service';
import { Session, SessionStop } from '@/lib/session-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar, Clock, User, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DriverSessionsPage() {
    const [todaySessions, setTodaySessions] = useState<Session[]>([]);
    const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingStops, setViewingStops] = useState<string | null>(null);
    const [stops, setStops] = useState<SessionStop[]>([]);
    const [selectedStop, setSelectedStop] = useState<SessionStop | null>(null);
    const [skipReason, setSkipReason] = useState('');

    useEffect(() => {
        const userInfo = localStorage.getItem('user_info');
        console.log('Logged in user info:', userInfo);
        if (userInfo) {
            const parsed = JSON.parse(userInfo);
            console.log('User ID:', parsed.userId);
            console.log('User email:', parsed.email);
            console.log('User role:', parsed.role);
        }
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        setLoading(true);
        try {
            console.log('Fetching driver sessions...');
            const [today, upcoming] = await Promise.all([
                driverSessionService.getTodaySessions(),
                driverSessionService.getUpcomingSessions()
            ]);
            console.log('Today sessions:', today);
            console.log('Upcoming sessions:', upcoming);
            setTodaySessions(today);
            setUpcomingSessions(upcoming);
        } catch (error: any) {
            console.error('Fetch sessions error:', error);
            toast.error(error.message || 'Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleViewStops = async (sessionId: string) => {
        try {
            const data = await driverSessionService.getSessionStops(sessionId);
            setStops(data);
            setViewingStops(sessionId);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch stops');
        }
    };

    const handleCompleteSession = async (sessionId: string) => {
        try {
            await driverSessionService.completeSession(sessionId);
            toast.success('Session completed successfully');
            fetchSessions();
            setViewingStops(null);
        } catch (error: any) {
            toast.error(error.message || 'Failed to complete session');
        }
    };

    const handleUpdateStop = async (stopId: string, status: 'COMPLETED' | 'SKIPPED') => {
        try {
            await driverSessionService.updateStopStatus(stopId, status, status === 'SKIPPED' ? skipReason : undefined);
            toast.success(`Stop ${status.toLowerCase()} successfully`);
            if (viewingStops) {
                const data = await driverSessionService.getSessionStops(viewingStops);
                setStops(data);
            }
            setSelectedStop(null);
            setSkipReason('');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update stop');
        }
    };

    const getStatusColor = (status: string) => {
        const colors = {
            PLANNED: 'bg-blue-100 text-blue-700',
            ASSIGNED: 'bg-purple-100 text-purple-700',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
            COMPLETED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

    const renderSessionCard = (session: Session) => (
        <div key={session.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-green-50 rounded-xl text-green-600">
                    <MapPin size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                    {session.status}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1">{session.routeName}</h3>
            <p className="text-sm text-gray-500 mb-4">{session.zoneName}</p>

            <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="font-medium">{new Date(session.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="font-medium">{session.completedStops}/{session.totalStops} stops</span>
                </div>
            </div>

            <Button
                onClick={() => handleViewStops(session.id)}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-10 rounded-lg"
            >
                View Stops
            </Button>
        </div>
    );

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Sessions</h1>
                <p className="text-gray-500 mt-1">Manage your collection routes</p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                    <p className="text-gray-500 animate-pulse">Loading sessions...</p>
                </div>
            ) : (
                <>
                    <Card className="rounded-2xl shadow-sm border border-gray-100">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Sessions</h2>
                            {todaySessions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {todaySessions.map(renderSessionCard)}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No sessions scheduled for today</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border border-gray-100">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h2>
                            {upcomingSessions.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {upcomingSessions.map(renderSessionCard)}
                                </div>
                            ) : (
                                <p className="text-center text-gray-500 py-8">No upcoming sessions</p>
                            )}
                        </CardContent>
                    </Card>
                </>
            )}

            {/* View Stops Modal */}
            <Dialog open={viewingStops !== null} onOpenChange={() => setViewingStops(null)}>
                <DialogContent className="sm:max-w-[700px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-green-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Session Stops</DialogTitle>
                            <p className="text-green-100 text-sm mt-1">Mark stops as completed or skipped</p>
                        </DialogHeader>
                    </div>
                    <div className="p-6 max-h-[500px] overflow-y-auto">
                        {stops.length > 0 ? (
                            <div className="space-y-3">
                                {stops.map((stop) => (
                                    <div key={stop.id} className="border border-gray-200 rounded-xl p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-900">{stop.citizenName}</p>
                                                <p className="text-sm text-gray-600">{stop.householdAddress}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                stop.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                                stop.status === 'SKIPPED' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {stop.status}
                                            </span>
                                        </div>
                                        <div className="flex gap-4 text-xs text-gray-500 mb-3">
                                            <span>Stop #{stop.sequenceNumber}</span>
                                            <span>Planned: {stop.plannedTime}</span>
                                        </div>
                                        {stop.status === 'PENDING' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => handleUpdateStop(stop.id, 'COMPLETED')}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 h-9 text-sm"
                                                >
                                                    <CheckCircle size={16} className="mr-1" />
                                                    Complete
                                                </Button>
                                                <Button
                                                    onClick={() => setSelectedStop(stop)}
                                                    variant="outline"
                                                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 h-9 text-sm"
                                                >
                                                    <XCircle size={16} className="mr-1" />
                                                    Skip
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No stops found</p>
                        )}
                    </div>
                    <div className="p-6 border-t">
                        <Button
                            onClick={() => viewingStops && handleCompleteSession(viewingStops)}
                            className="w-full bg-green-600 hover:bg-green-700 h-12 font-bold"
                        >
                            Complete Session
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Skip Reason Modal */}
            <Dialog open={selectedStop !== null} onOpenChange={() => setSelectedStop(null)}>
                <DialogContent className="sm:max-w-[400px] rounded-2xl">
                    <DialogHeader>
                        <DialogTitle>Skip Stop</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <p className="text-sm text-gray-600">Please provide a reason for skipping this stop:</p>
                        <textarea
                            value={skipReason}
                            onChange={(e) => setSkipReason(e.target.value)}
                            placeholder="Enter reason..."
                            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setSelectedStop(null)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => selectedStop && handleUpdateStop(selectedStop.id, 'SKIPPED')}
                            className="flex-1 bg-red-600 hover:bg-red-700"
                            disabled={!skipReason.trim()}
                        >
                            Skip Stop
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
