// Mock data for various services
export const mockData = {
    households: [
        { id: 1, name: 'Smith Family', address: 'Kigali, Rwanda', zone: 'Zone A', status: 'Active' },
        { id: 2, name: 'Johnson Family', address: 'Kigali, Rwanda', zone: 'Zone B', status: 'Active' }
    ],
    
    payments: [
        { id: 1, amount: 5000, date: '2024-01-15', status: 'Paid', household: 'Smith Family' },
        { id: 2, amount: 7500, date: '2024-01-10', status: 'Pending', household: 'Johnson Family' }
    ],
    
    zones: [
        { id: 1, name: 'Zone A', description: 'Central Kigali', households: 25 },
        { id: 2, name: 'Zone B', description: 'East Kigali', households: 18 }
    ],
    
    tariffs: [
        { id: 1, name: 'Standard Rate', amount: 5000, zone: 'Zone A', type: 'Monthly' },
        { id: 2, name: 'Premium Rate', amount: 7500, zone: 'Zone B', type: 'Monthly' }
    ],
    
    drivers: [
        { id: 1, name: 'John Doe', phone: '+250123456789', zone: 'Zone A', status: 'Active' },
        { id: 2, name: 'Jane Smith', phone: '+250987654321', zone: 'Zone B', status: 'Active' }
    ],
    
    complaints: [
        { id: 1, title: 'Missed Collection', description: 'Waste not collected on schedule', status: 'Open', date: '2024-01-15' },
        { id: 2, title: 'Damaged Bin', description: 'Waste bin was damaged during collection', status: 'Resolved', date: '2024-01-10' }
    ]
};

// Mock service functions
export const mockServices = {
    // Household services
    getHouseholds: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.households;
    },
    
    createHousehold: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newHousehold = { ...data, id: Date.now() };
        mockData.households.push(newHousehold);
        return newHousehold;
    },
    
    updateHousehold: async (id: number, data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockData.households.findIndex(h => h.id === id);
        if (index !== -1) {
            mockData.households[index] = { ...mockData.households[index], ...data };
            return mockData.households[index];
        }
        throw new Error('Household not found');
    },
    
    deleteHousehold: async (id: number) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const index = mockData.households.findIndex(h => h.id === id);
        if (index !== -1) {
            mockData.households.splice(index, 1);
            return true;
        }
        throw new Error('Household not found');
    },
    
    // Payment services
    getPayments: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.payments;
    },
    
    createPayment: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newPayment = { ...data, id: Date.now() };
        mockData.payments.push(newPayment);
        return newPayment;
    },
    
    // Zone services
    getZones: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.zones;
    },
    
    createZone: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newZone = { ...data, id: Date.now() };
        mockData.zones.push(newZone);
        return newZone;
    },
    
    // Tariff services
    getTariffs: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.tariffs;
    },
    
    createTariff: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newTariff = { ...data, id: Date.now() };
        mockData.tariffs.push(newTariff);
        return newTariff;
    },
    
    // Driver services
    getDrivers: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.drivers;
    },
    
    // Complaint services
    getComplaints: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockData.complaints;
    },
    
    createComplaint: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const newComplaint = { ...data, id: Date.now(), date: new Date().toISOString().split('T')[0] };
        mockData.complaints.push(newComplaint);
        return newComplaint;
    },
    
    // Dashboard services
    getDashboardStats: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return {
            totalHouseholds: mockData.households.length,
            totalPayments: mockData.payments.length,
            totalZones: mockData.zones.length,
            activeDrivers: mockData.drivers.filter(d => d.status === 'Active').length,
            openComplaints: mockData.complaints.filter(c => c.status === 'Open').length
        };
    }
};