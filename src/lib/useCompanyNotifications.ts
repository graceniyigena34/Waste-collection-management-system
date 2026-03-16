'use client';

import { useState, useEffect } from 'react';

interface CompanyNotification {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  registrationDate: string;
  registrationTime: string;
}

export function useCompanyNotifications() {
  const [notifications, setNotifications] = useState<CompanyNotification[]>([]);

  const addNotification = (company: Omit<CompanyNotification, 'id' | 'registrationDate' | 'registrationTime'>) => {
    const now = new Date();
    const notification: CompanyNotification = {
      id: Date.now().toString(),
      ...company,
      registrationDate: now.toLocaleDateString(),
      registrationTime: now.toLocaleTimeString(),
    };
    
    setNotifications(prev => [notification, ...prev]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Simulate company registrations for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.97) { // 3% chance every 5 seconds
        const companies = [
          { companyName: 'EcoWaste Solutions Ltd', email: 'info@ecowaste.rw', phone: '+250788123456' },
          { companyName: 'Green Clean Services', email: 'contact@greenclean.rw', phone: '+250788654321' },
          { companyName: 'Kigali Waste Management', email: 'admin@kigaliwaste.rw', phone: '+250788987654' },
        ];
        
        const randomCompany = companies[Math.floor(Math.random() * companies.length)];
        addNotification(randomCompany);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    notifications,
    addNotification,
    dismissNotification,
  };
}