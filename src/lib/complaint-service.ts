export interface Complaint {
  id: number;
  title: string;
  description: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  householdId: number;
  createdAt: string;
}

const mockComplaints: Complaint[] = [
  {
    id: 1,
    title: 'Missed Collection',
    description: 'Waste was not collected on scheduled day',
    status: 'OPEN',
    householdId: 1,
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Damaged Bin',
    description: 'Waste bin was damaged during collection',
    status: 'RESOLVED',
    householdId: 2,
    createdAt: '2024-01-10T14:30:00Z'
  }
];

export const complaintService = {
  getAll: async (): Promise<Complaint[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockComplaints];
  },
  
  create: async (data: Omit<Complaint, 'id' | 'createdAt'>): Promise<Complaint> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newComplaint: Complaint = {
      ...data,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    mockComplaints.push(newComplaint);
    return newComplaint;
  },
  
  updateStatus: async (id: number, status: Complaint['status']): Promise<Complaint> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const index = mockComplaints.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Complaint not found');
    mockComplaints[index].status = status;
    return mockComplaints[index];
  }
};

export default complaintService;