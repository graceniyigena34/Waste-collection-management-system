/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import sessionService, { Session, CreateSessionData, SessionStatus } from '@/lib/session-service';
import routeService, { Route } from '@/lib/route-service';
import driverService, { Driver } from '@/lib/driver-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, Calendar, Clock, Edit, Trash2, User, MapPin, Eye } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SessionsPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [viewingStops, setViewingStops] = useState<string | null>(null);
    const [stops, setStops] = useState<any[]>([]);

    const [formData, setFormData] = useState<CreateSessionData>({
        routeId: '',
        date: '',
        driverUserId: ''
    });

    const [routes, setRoutes] = useState<Route[]>([]);
    const [drivers, setDrivers] = useState<Driver[]>([]);

    useEffect(() => {
        fetchSessions();
        fetchRoutes();
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const data = await driverService.getAll();
            setDrivers(data);
        } catch (error: any) {
            toast.error('Failed to fetch drivers');
        }
    };

    const fetchRoutes = async () => {
        try {
            const data = await routeService.getAll();
            setRoutes(data);
        } catch (error: any) {
            toast.error('Failed to fetch routes');
        }
    };

    const fetchSessions = async () => {
        setLoading(true);
        try {
            const data = await sessionService.getAll();
            console.log('Fetched sessions:', data);
            console.log('Is array:', Array.isArray(data));
            setSessions(data);
        } catch (error: any) {
            console.error('Error fetching sessions:', error);
            toast.error(error.message || 'Failed to fetch sessions');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (session?: Session) => {
        if (session) {
            setEditingSession(session);
            setFormData({
                routeId: session.routeId,
                date: session.date,
                driverUserId: session.driverUserId
            });
        } else {
            setEditingSession(null);
            setFormData({
                routeId: '',
                date: '',
                driverUserId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSession(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.routeId || !formData.date || !formData.driverUserId) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            await sessionService.create(formData);
            toast.success('Session created successfully');
            handleCloseModal();
            fetchSessions();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save session';
            toast.error(errorMessage);
        }
    };

    const handleStatusChange = async (id: string, status: SessionStatus) => {
        try {
            await sessionService.updateStatus(id, status);
            toast.success('Session status updated');
            fetchSessions();
        } catch (error: any) {
            toast.error(error.message || 'Failed to update status');
        }
    };

    const handleDriverChange = async (id: string, driverId: string) => {
        try {
            await sessionService.assignDriver(id, driverId);
            toast.success('Driver assigned successfully');
            fetchSessions();
        } catch (error: any) {
            toast.error(error.message || 'Failed to assign driver');
        }
    };

    const handleViewStops = async (sessionId: string) => {
        try {
            const data = await sessionService.getStops(sessionId);
            setStops(data);
            setViewingStops(sessionId);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch stops');
        }
    };

    const getStatusColor = (status: SessionStatus) => {
        const colors = {
            PLANNED: 'bg-blue-100 text-blue-700',
            ASSIGNED: 'bg-purple-100 text-purple-700',
            IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
            COMPLETED: 'bg-green-100 text-green-700',
            CANCELLED: 'bg-red-100 text-red-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const filteredSessions = Array.isArray(sessions) ? sessions.filter(session =>
        session.routeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.zoneName?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    console.log('Sessions state:', sessions);
    console.log('Filtered sessions:', filteredSessions);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Collection Sessions</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Schedule and manage waste collection sessions</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Session</span>
                </Button>
            </div>

            <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
                            <Input
                                placeholder="Search sessions by route, driver, or zone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">Fetching sessions...</p>
                        </div>
                    ) : filteredSessions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredSessions.map((session) => (
                                <div key={session.id} className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-green-100 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                            <MapPin size={24} />
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                                            {session.status}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-1">{session.routeName}</h3>
                                    <p className="text-sm text-gray-500 mb-4">{session.zoneName}</p>

                                    <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span className="font-medium">{new Date(session.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-gray-400" />
                                            <span className="font-medium">{session.driverName || 'Unassigned'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-gray-400" />
                                            <span className="font-medium">{session.completedStops}/{session.totalStops} stops</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <select
                                            value={session.status}
                                            onChange={(e) => handleStatusChange(session.id, e.target.value as SessionStatus)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="PLANNED">Planned</option>
                                            <option value="ASSIGNED">Assigned</option>
                                            <option value="IN_PROGRESS">In Progress</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                        <select
                                            value={session.driverUserId}
                                            onChange={(e) => handleDriverChange(session.id, e.target.value)}
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                                        >
                                            <option value="">Reassign driver...</option>
                                            {drivers.map(driver => (
                                                <option key={driver.id} value={driver.id}>
                                                    {driver.fullName}
                                                </option>
                                            ))}
                                        </select>
                                        <Button
                                            onClick={() => handleViewStops(session.id)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white h-9 rounded-lg text-sm"
                                        >
                                            <Eye size={16} className="mr-2" />
                                            View Stops
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Calendar size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">No sessions found</p>
                            <p className="text-sm text-gray-400 mt-1">Create a new collection session to get started</p>
                            <Button
                                onClick={() => handleOpenModal()}
                                className="mt-6 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-6"
                            >
                                Create your first session
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-green-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Create New Session</DialogTitle>
                            <p className="text-green-100 text-sm mt-1">Schedule a waste collection session</p>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Route</label>
                            <select
                                value={formData.routeId}
                                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Select a route...</option>
                                {routes.map(route => (
                                    <option key={route.id} value={route.id}>
                                        {route.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Driver</label>
                            <select
                                value={formData.driverUserId}
                                onChange={(e) => setFormData({ ...formData, driverUserId: e.target.value })}
                                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                required
                            >
                                <option value="">Select a driver...</option>
                                {drivers.map(driver => (
                                    <option key={driver.id} value={driver.id}>
                                        {driver.fullName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <DialogFooter className="pt-4 flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCloseModal}
                                className="flex-1 h-12 rounded-xl border-gray-200 font-bold text-gray-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 font-bold shadow-lg shadow-green-100"
                            >
                                Create Session
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Stops Modal */}
            <Dialog open={viewingStops !== null} onOpenChange={() => setViewingStops(null)}>
                <DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-green-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Session Stops</DialogTitle>
                            <p className="text-green-100 text-sm mt-1">Collection stops for this session</p>
                        </DialogHeader>
                    </div>
                    <div className="p-6 max-h-[500px] overflow-y-auto">
                        {stops.length > 0 ? (
                            <div className="space-y-3">
                                {stops.map((stop) => (
                                    <div key={stop.id} className="border border-gray-200 rounded-xl p-4 hover:border-green-300 transition-colors">
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
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>Stop #{stop.sequenceNumber}</span>
                                            <span>Planned: {stop.plannedTime}</span>
                                            {stop.completedAt && <span>Completed: {new Date(stop.completedAt).toLocaleString()}</span>}
                                        </div>
                                        {stop.reason && <p className="text-xs text-gray-600 mt-2">Reason: {stop.reason}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">No stops found for this session</p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
