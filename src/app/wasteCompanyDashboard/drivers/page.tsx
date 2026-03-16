'use client';

import React, { useState, useEffect } from 'react';
import driverService, { Driver, CreateDriverData } from '@/lib/driver-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, User } from 'lucide-react';
import { toast } from 'react-toastify';

export default function DriversPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState<CreateDriverData>({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        licenseNumber: ''
    });

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const data = await driverService.getAll();
            setDrivers(data);
        } catch (error: any) {
            console.error('Fetch drivers error:', error);
            if (error.response?.status === 400) {
                toast.error('Driver endpoint not yet implemented on backend');
            } else {
                const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch drivers';
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email || !formData.password) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const result = await driverService.create(formData);
            console.log('Driver created:', result);
            toast.success('Driver created successfully');
            handleCloseModal();
            fetchDrivers();
        } catch (error: any) {
            console.error('Driver save error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create driver';
            toast.error(errorMessage);
        }
    };

    const handleStatusChange = async (driverId: string, status: string) => {
        try {
            await driverService.updateStatus(driverId, status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING');
            toast.success('Driver status updated successfully');
            fetchDrivers();
        } catch (error: any) {
            console.error('Status update error:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
            toast.error(errorMessage);
        }
    };

    const filteredDrivers = drivers.filter(driver =>
        driver.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        driver.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Driver Management</h1>
                    <p className="text-gray-500 mt-1 text-sm md:text-base">Manage your fleet drivers</p>
                </div>
                <Button
                    onClick={() => handleOpenModal()}
                    className="bg-green-600 hover:bg-green-700 text-white h-11 px-6 rounded-xl shadow-lg shadow-green-100 transition-all active:scale-95 flex items-center gap-2"
                >
                    <Plus size={20} />
                    <span>New Driver</span>
                </Button>
            </div>

            <Card className="rounded-2xl shadow-sm border border-gray-100 bg-white/50 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" size={18} />
                            <Input
                                placeholder="Search drivers by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 rounded-xl"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                            <p className="text-gray-500 animate-pulse">Fetching drivers...</p>
                        </div>
                    ) : filteredDrivers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredDrivers.map((driver) => (
                                <div key={driver.id} className="group relative bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-xl hover:border-green-100 transition-all duration-300">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                            <User size={24} />
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors mb-3">
                                        {driver.fullName}
                                    </h3>
                                    
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Email:</span>
                                            <span className="truncate">{driver.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Phone:</span>
                                            <span>{driver.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">License:</span>
                                            <span>{driver.licenseNumber}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <Select
                                            value={driver.status || 'ACTIVE'}
                                            onValueChange={(value) => handleStatusChange(driver.id, value)}
                                        >
                                            <SelectTrigger className="w-32 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                <SelectItem value="INACTIVE">INACTIVE</SelectItem>
                                                <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <User size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">No drivers found</p>
                            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or create a new driver</p>
                            <Button
                                onClick={() => handleOpenModal()}
                                className="mt-6 bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 rounded-xl px-6"
                            >
                                Create your first driver
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                    <div className="bg-green-600 p-6 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Create New Driver</DialogTitle>
                            <p className="text-green-100 text-sm mt-1">Add a new driver to your fleet</p>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Full Name *</label>
                            <Input
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                placeholder="John Doe"
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email *</label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="john.doe@example.com"
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <Input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+250 XXX XXX XXX"
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Password *</label>
                            <Input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter password"
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">License Number</label>
                            <Input
                                value={formData.licenseNumber}
                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                placeholder="DL-XXXXXXXX"
                                className="h-11 rounded-xl border-gray-200 focus:border-green-500"
                            />
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
                                Create Driver
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
