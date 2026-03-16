// Sample data for company profile
// This file contains initial data that can be easily modified

export const initialCompanyInfo = {
  name: "EcoCycle Solutions",
  email: "contact@ecocycle.com",
  phone: "+250 788 123 456",
  address: "KN 5 Ave, Kigali, Rwanda",
  linkedin: "linkedin.com/company/ecocycle",
  twitter: "@ecocycle",
  facebook: "facebook.com/ecocycle",
  logo: "",
  coverImage: ""
};

export const initialAboutUs = "EcoCycle Solutions is a leading waste management company committed to creating a sustainable future. We provide comprehensive recycling and waste collection services to residential and industrial clients across Rwanda.";

export const initialServices = [
  { 
    id: "1", 
    title: "Residential Recycling & Waste Collection", 
    description: "Door-to-door waste collection and recycling services for households", 
    icon: "🏠" 
  },
  { 
    id: "2", 
    title: "Industrial Hazardous Waste Disposal", 
    description: "Safe disposal of industrial and hazardous materials", 
    icon: "🏭" 
  },
  { 
    id: "3", 
    title: "Organic Waste Composting", 
    description: "Convert organic waste into nutrient-rich compost", 
    icon: "🌱" 
  },
  { 
    id: "4", 
    title: "Commercial Waste Management", 
    description: "Tailored waste solutions for businesses", 
    icon: "🏢" 
  }
];

export const initialServiceAreas = [
  { id: "1", city: "Kigali" },
  { id: "2", city: "Gasabo" },
  { id: "3", city: "Kicukiro" },
  { id: "4", city: "Nyarugenge" }
];

export const initialCertifications = [
  { id: "1", name: "ISO Certified", logo: "ISO" },
  { id: "2", name: "EPA Partner", logo: "EPA" },
  { id: "3", name: "SWANA Member", logo: "SWANA" },
  { id: "4", name: "Eco-labels", logo: "ECO" }
];

export const initialTeamMembers = [
  { id: "1", name: "John Doe", email: "john@ecocycle.com", role: "Admin" },
  { id: "2", name: "Jane Smith", email: "jane@ecocycle.com", role: "Operations" },
  { id: "3", name: "Mike Johnson", email: "mike@ecocycle.com", role: "Member" }
];

export const initialSubscription = {
  plan: "Premium",
  nextBilling: "2024-02-15",
  amount: 99
};

// Role options for team members
export const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Operations", label: "Operations" },
  { value: "Member", label: "Member" }
];

// Service icons mapping
export const serviceIcons = {
  residential: "🏠",
  industrial: "🏭",
  organic: "🌱",
  commercial: "🏢",
  recycling: "♻️",
  transport: "🚛"
};
