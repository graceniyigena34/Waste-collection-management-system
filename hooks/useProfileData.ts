import { useState } from "react";
import {
  initialCompanyInfo,
  initialAboutUs,
  initialServices,
  initialServiceAreas,
  initialCertifications,
  initialTeamMembers,
  initialSubscription
} from "@/data/profile-data";

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  twitter: string;
  facebook: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface ServiceArea {
  id: string;
  city: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Subscription {
  plan: string;
  nextBilling: string;
  amount: number;
}

export function useProfileData() {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);
  const [aboutUs, setAboutUs] = useState(initialAboutUs);
  const [services, setServices] = useState<Service[]>(initialServices);
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(initialServiceAreas);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [subscription, setSubscription] = useState<Subscription>(initialSubscription);

  const addServiceArea = (city: string) => {
    if (city.trim()) {
      setServiceAreas(prev => [...prev, { id: Date.now().toString(), city }]);
      return true;
    }
    return false;
  };

  const removeServiceArea = (id: string) => {
    setServiceAreas(prev => prev.filter(a => a.id !== id));
  };

  const inviteTeamMember = (email: string) => {
    if (email.trim()) {
      setTeamMembers(prev => [...prev, {
        id: Date.now().toString(),
        name: "New Member",
        email,
        role: "Member"
      }]);
      return true;
    }
    return false;
  };

  const updateMemberRole = (id: string, role: string) => {
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m));
  };

  return {
    companyInfo,
    aboutUs,
    services,
    serviceAreas,
    teamMembers,
    subscription,
    addServiceArea,
    removeServiceArea,
    inviteTeamMember,
    updateMemberRole,
    setCompanyInfo,
    setAboutUs,
    setServices
  };
}
