export type NotificationType = 'COMPANY_REGISTRATION' | 'CONTACT_MESSAGE' | 'COMPLAINT';
export type RecipientRole = 'SUPER_ADMIN' | 'WASTE_COMPANY';

export interface NotificationMetadata {
    companyName?: string;
    companyEmail?: string;
    companyPhone?: string;
    contactName?: string;
    contactEmail?: string;
    complaintId?: string;
    householdId?: string;
    complaintType?: string;
    [key: string]: any;
}

export interface Notification {
    _id: string;
    type: NotificationType;
    recipientId: string;
    recipientRole: RecipientRole;
    title: string;
    message: string;
    metadata?: NotificationMetadata;
    isRead: boolean;
    createdAt: string;
    updatedAt?: string;
}

const mockNotifications: Notification[] = [
    {
        _id: '1',
        type: 'COMPANY_REGISTRATION',
        recipientId: 'admin',
        recipientRole: 'SUPER_ADMIN',
        title: 'New Company Registration',
        message: 'A new waste company has registered',
        isRead: false,
        createdAt: new Date().toISOString()
    },
    {
        _id: '2',
        type: 'CONTACT_MESSAGE',
        recipientId: 'admin',
        recipientRole: 'SUPER_ADMIN',
        title: 'New Contact Message',
        message: 'Someone sent a contact message',
        isRead: false,
        createdAt: new Date().toISOString()
    }
];

export const notificationService = {
    getAllNotifications: async (): Promise<Notification[]> => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return [...mockNotifications];
    },

    deleteNotification: async (id: string): Promise<void> => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const index = mockNotifications.findIndex(n => n._id === id);
        if (index !== -1) {
            mockNotifications.splice(index, 1);
        }
    },

    getUnreadCount: async (): Promise<number> => {
        await new Promise(resolve => setTimeout(resolve, 200));
        return mockNotifications.filter(n => !n.isRead).length;
    }
};
