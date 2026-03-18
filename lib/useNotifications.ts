'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationService, type Notification } from './notification-service';

export function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await notificationService.getAllNotifications();
            setNotifications(data);
        } catch (err: any) {
            console.error('Error fetching notifications:', err);
            setError(err.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteNotification = useCallback(async (id: string) => {
        try {
            await notificationService.deleteNotification(id);
            // Optimistically update UI
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err: any) {
            console.error('Error deleting notification:', err);
            setError(err.message || 'Failed to delete notification');
            // Refetch to ensure consistency
            await fetchNotifications();
        }
    }, [fetchNotifications]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        fetchNotifications();

        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    return {
        notifications,
        loading,
        error,
        unreadCount,
        deleteNotification,
        refetch: fetchNotifications
    };
}
