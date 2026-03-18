export const adminService = {
  getCompanies: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: 1, name: 'Clean Rwanda Ltd', status: 'APPROVED', email: 'info@cleanrwanda.com' },
      { id: 2, name: 'Eco Waste Co', status: 'PENDING', email: 'contact@ecowaste.rw' }
    ];
  },
  
  approveCompany: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Company approved successfully' };
  },
  
  rejectCompany: async (id: number) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true, message: 'Company rejected' };
  }
};

export default adminService;