export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

const mockAdminNotifications: AdminNotification[] = [
  {
    id: '1',
    title: 'System Update',
    message: 'System maintenance scheduled for tonight',
    type: 'info',
    createdAt: new Date().toISOString()
  }
];

class AdminNotificationService {
  async getAll(): Promise<AdminNotification[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockAdminNotifications];
  }

  async deleteAll(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    mockAdminNotifications.length = 0;
  }
}

export default new AdminNotificationService();
