/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import routeService, { Route, CreateRouteData } from '@/lib/route-service';
import zoneService, { Zone } from '@/lib/zone-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Plus, Search, MapPin, Calendar, Clock, Edit, Trash2, MoreVertical } from 'lucide-react';
import { toast } from 'react-toastify';

export default function RoutesPage() {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [routeToDelete, setRouteToDelete] = useState<string | null>(null);
    const [editingRoute, setEditingRoute] = useState<Route | null>(null);

    // Form State
    const [formData, setFormData] = useState<CreateRouteData>({
        zoneId: '',
        name: '',
        dayOfWeek: 'MONDAY',
        shift: 'MORNING'
    });

    const [zones, setZones] = useState<Zone[]>([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        fetchRoutes();
        fetchZones();
        
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        
        return () => clearInterval(timer);
    }, []);

    const fetchZones = async () => {
        try {
            const data = await zoneService.getAll();
            setZones(data);
        } catch (error: any) {
            toast.error('Failed to fetch zones');
        }
    };

    const fetchRoutes = async () => {
        setLoading(true);
        try {
            const data = await routeService.getAll();
            setRoutes(data);
        } catch (error: any) {
            toast.error(error.message || 'Failed to fetch routes');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (route?: Route) => {
        if (route) {
            setEditingRoute(route);
            setFormData({
                zoneId: route.zoneId,
                name: route.name,
                dayOfWeek: route.dayOfWeek,
                shift: route.shift
            });
        } else {
            setEditingRoute(null);
            setFormData({
                zoneId: '',
                name: '',
                dayOfWeek: 'MONDAY',
                shift: 'MORNING'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRoute(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.zoneId || !formData.name) {
            toast.error('Please fill in all required fields');
            return;
        }

        console.log('Submitting route data:', formData);

        try {
            if (editingRoute) {
                await routeService.update(editingRoute.id, formData);
                toast.success('Route updated successfully');
            } else {
                const result = await routeService.create(formData);
                console.log('Route created:', result);
                toast.success('Route created successfully');
            }
            handleCloseModal();
            fetchRoutes();
        } catch (error: any) {
            console.error('Route save error:', error);
            console.error('Error response:', error.response?.data);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to save route';
            toast.error(errorMessage);
        }
    };

    const confirmDelete = (id: string) => {
        const ConfirmToast = ({ closeToast }: { closeToast: () => void }) => (
            <div className="flex flex-col gap-3 p-1">
                <p className="font-semibold text-gray-900">Confirm Deletion</p>
                <p className="text-sm text-gray-600">Are you sure you want to delete this route? This action cannot be undone.</p>
                <div className="flex gap-2 mt-2">
                    <button
                        onClick={async () => {
                            try {
                                await routeService.delete(id);
                                toast.success('Route deleted successfully');
                                fetchRoutes();
                            } catch (error: any) {
                                toast.error(error.message || 'Failed to delete route');
                            }
                            closeToast();
                        }}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                    >
                        Delete
                    </button>
                    <button
                        onClick={closeToast}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );

        toast(<ConfirmToast closeToast={() => { }} />, {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
            closeButton: false,
        });
    };

    const isRouteActive = (route: Route) => {
        const now = currentTime;
        const currentHour = now.getHours();
        const currentDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][now.getDay()];
        
        if (route.dayOfWeek !== currentDay) return false;
        
        const shiftRanges = {
            MORNING: { start: 6, end: 12 },
            AFTERNOON: { start: 12, end: 18 },
            EVENING: { start: 18, end: 22 },
            NIGHT: { start: 22, end: 6 }
        };
        
        const range = shiftRanges[route.shift];
        if (route.shift === 'NIGHT') {
            return currentHour >= range.start || currentHour < range.end;
        }
        return currentHour >= range.start && currentHour < range.end;
    };

    const isRouteNext = (route: Route) => {
        const now = currentTime;
        const currentHour = now.getHours();
        const currentDay = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'][now.getDay()];
        
        const shiftRanges = {
            MORNING: { start: 6, end: 12 },
            AFTERNOON: { start: 12, end: 18 },
            EVENING: { start: 18, end: 22 },
            NIGHT: { start: 22, end: 6 }
        };
        
        if (route.dayOfWeek === currentDay) {
            const range = shiftRanges[route.shift];
            if (route.shift === 'NIGHT') {
                return currentHour < range.start && currentHour >= 18;
            }
            return currentHour < range.start;
        }
        
        return false;
    };

    const filteredRoutes = routes.filter(route =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zones.find(z => z.id === route.zoneId)?.sector.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Route Management</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Create and manage collection routes for your fleet</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Route</span>
                </Button>
            </div>

            <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
                            <Input
                                placeholder="Search routes by name or zone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl"
                            />
                        </div>
                        <div className="flex gap-2">
                            {/* Filters could go here */}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">Fetching routes...</p>
                        </div>
                    ) : filteredRoutes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredRoutes.map((route) => {
                                const zone = zones.find(z => z.id === route.zoneId);
                                const isActive = isRouteActive(route);
                                const isNext = isRouteNext(route);
                                
                                return (
                                    <div key={route.id} className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-green-100 transition-all duration-300">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 bg-green-50 rounded-xl text-green-600 relative ${isActive || isNext ? 'animate-bounce' : ''}`}>
                                                <MapPin size={24} />
                                                {isActive && (
                                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                    </span>
                                                )}
                                                {isNext && !isActive && (
                                                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(route)}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => confirmDelete(route.id)}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-1">{route.name}</h3>
                                        <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                                            <span className="font-medium text-gray-700">{zone?.sector || 'Unknown Zone'}</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span>{zone?.cell}</span>
                                        </p>

                                        <div className="flex items-center gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-gray-400" />
                                                <span className="font-medium">{route.dayOfWeek}</span>
                                            </div>
                                            <div className="w-px h-3 bg-gray-200"></div>
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-gray-400" />
                                                <span className="font-medium">{route.shift}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <MapPin size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">No routes found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new route</p>
                            <Button
                                onClick={() => handleOpenModal()}
                                className="mt-6 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-6"
                            >
                                Create your first route
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Add/Edit Modal */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-green-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">{editingRoute ? 'Edit Route' : 'Create New Route'}</DialogTitle>
                            <p className="text-green-100 text-sm mt-1">Configure the details for your collection route</p>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Route Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g., Kicukiro Morning Run A"
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Service Zone</label>
                            <select
                                value={formData.zoneId}
                                onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                                className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                required
                            >
                                <option value="">Select a zone...</option>
                                {zones.map(zone => (
                                    <option key={zone.id} value={zone.id}>
                                        {zone.sector} - {zone.cell} ({zone.village})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Day of Week</label>
                                <select
                                    value={formData.dayOfWeek}
                                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value as any })}
                                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-sm"
                                >
                                    <option value="MONDAY">Monday</option>
                                    <option value="TUESDAY">Tuesday</option>
                                    <option value="WEDNESDAY">Wednesday</option>
                                    <option value="THURSDAY">Thursday</option>
                                    <option value="FRIDAY">Friday</option>
                                    <option value="SATURDAY">Saturday</option>
                                    <option value="SUNDAY">Sunday</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Collection Shift</label>
                                <select
                                    value={formData.shift}
                                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                                    className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium text-sm"
                                >
                                    <option value="MORNING">Morning (6AM - 12PM)</option>
                                    <option value="AFTERNOON">Afternoon (12PM - 6PM)</option>
                                    <option value="EVENING">Evening (6PM - 10PM)</option>
                                    <option value="NIGHT">Night (10PM - 6AM)</option>
                                </select>
                            </div>
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
                                {editingRoute ? 'Save Changes' : 'Create Route'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
