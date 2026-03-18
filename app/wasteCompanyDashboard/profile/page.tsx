"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Save, X, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Plus, Trash2, Upload } from "lucide-react";
import { 
  initialCompanyInfo, 
  initialAboutUs, 
  initialServices, 
  initialServiceAreas, 
  initialCertifications, 
  initialTeamMembers, 
  initialSubscription,
  roleOptions
} from "@/data/profile-data";

interface CompanyInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  logo?: string;
  coverImage?: string;
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

interface Certification {
  id: string;
  name: string;
  logo: string;
  logoImage?: string;
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

export default function ProfilePage() {
  const router = useRouter();
  const [editingSection, setEditingSection] = useState<string | null>(null);
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(initialCompanyInfo);

  const [aboutUs, setAboutUs] = useState(initialAboutUs);

  const [services, setServices] = useState<Service[]>(initialServices);

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(initialServiceAreas);

  const [certifications, setCertifications] = useState<Certification[]>(initialCertifications);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);

  const [subscription, setSubscription] = useState<Subscription>(initialSubscription);

  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newAreaCity, setNewAreaCity] = useState("");

  const handleLogoUpload = (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertifications(certifications.map(c => 
          c.id === certId ? {...c, logoImage: reader.result as string} : c
        ));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo({...companyInfo, logo: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyInfo({...companyInfo, coverImage: reader.result as string});
      };
      reader.readAsDataURL(file);
    }
  };

  const getLogoPlaceholder = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        
        {/* Cover Image & Logo Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-r from-primary-green to-secondary-green group">
            {companyInfo.coverImage && (
              <img src={companyInfo.coverImage} alt="Cover" className="w-full h-full object-cover" />
            )}
            <label className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <div className="text-white text-center">
                <Upload className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Upload Cover Image</p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                className="hidden"
              />
            </label>
          </div>
          <div className="px-6 pb-6">
            <div className="relative -mt-16 mb-4">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg overflow-hidden relative group">
                {companyInfo.logo ? (
                  <img src={companyInfo.logo} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-primary-green/10 flex items-center justify-center">
                    <span className="text-primary-green font-bold text-3xl">
                      {companyInfo.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Upload className="w-6 h-6 text-white" />
                  <p className="text-xs text-white mt-1">Upload</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCompanyLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        
        {/* Company Snapshot */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-bg">Company Snapshot</h2>
            {editingSection !== "company" ? (
              <button 
                onClick={() => setEditingSection("company")}
                className="flex items-center gap-2 text-primary-green hover:text-secondary-green"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-gray-300 text-dark-bg px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-green/10 rounded-full flex items-center justify-center">
                  <span className="text-primary-green font-bold">EC</span>
                </div>
                {editingSection === "company" ? (
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <div>
                    <p className="font-semibold text-dark-bg">{companyInfo.name}</p>
                    <p className="text-sm text-gray-600">Waste Management Company</p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-green" />
                {editingSection === "company" ? (
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="text-gray-700">{companyInfo.email}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-green" />
                {editingSection === "company" ? (
                  <input
                    type="tel"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="text-gray-700">{companyInfo.phone}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-green" />
                {editingSection === "company" ? (
                  <input
                    type="text"
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="text-gray-700">{companyInfo.address}</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-dark-bg">Social Media</h3>
              
              <div className="flex items-center gap-3">
                <Linkedin className="w-5 h-5 text-primary-green" />
                {editingSection === "company" ? (
                  <input
                    type="text"
                    value={companyInfo.linkedin}
                    onChange={(e) => setCompanyInfo({...companyInfo, linkedin: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="text-gray-700">{companyInfo.linkedin}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Twitter className="w-5 h-5 text-primary-green" />
                {editingSection === "company" ? (
                  <input
                    type="text"
                    value={companyInfo.twitter}
                    onChange={(e) => setCompanyInfo({...companyInfo, twitter: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="text-gray-700">{companyInfo.twitter}</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Facebook className="w-5 h-5 text-primary-green" />
                {editingSection === "company" ? (
                  <input
                    type="text"
                    value={companyInfo.facebook}
                    onChange={(e) => setCompanyInfo({...companyInfo, facebook: e.target.value})}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                  />
                ) : (
                  <span className="text-gray-700">{companyInfo.facebook}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-dark-bg">About Us</h2>
            {editingSection !== "about" ? (
              <button 
                onClick={() => setEditingSection("about")}
                className="flex items-center gap-2 text-primary-green hover:text-secondary-green"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-gray-300 text-dark-bg px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {editingSection === "about" ? (
            <textarea
              value={aboutUs}
              onChange={(e) => setAboutUs(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed">{aboutUs}</p>
          )}
        </div>

        {/* Our Services Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-dark-bg mb-6">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map(service => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-4xl">{service.icon}</div>
                  {editingSection !== `service-${service.id}` ? (
                    <button 
                      onClick={() => setEditingSection(`service-${service.id}`)}
                      className="text-primary-green hover:text-secondary-green"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  ) : (
                    <button 
                      onClick={() => setEditingSection(null)}
                      className="text-primary-green hover:text-secondary-green"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                {editingSection === `service-${service.id}` ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={service.title}
                      onChange={(e) => setServices(services.map(s => 
                        s.id === service.id ? {...s, title: e.target.value} : s
                      ))}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <textarea
                      value={service.description}
                      onChange={(e) => setServices(services.map(s => 
                        s.id === service.id ? {...s, description: e.target.value} : s
                      ))}
                      rows={2}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                ) : (
                  <>
                    <h3 className="font-semibold text-dark-bg mb-2">{service.title}</h3>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Service Areas Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-bg">Service Areas</h2>
            {editingSection !== "areas" ? (
              <button 
                onClick={() => setEditingSection("areas")}
                className="flex items-center gap-2 text-primary-green hover:text-secondary-green"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-gray-300 text-dark-bg px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
          
          <div className="mb-6 bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary-green mx-auto mb-2" />
              <p className="text-gray-600">Map Placeholder</p>
            </div>
          </div>

          {editingSection === "areas" && (
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newAreaCity}
                onChange={(e) => setNewAreaCity(e.target.value)}
                placeholder="Enter city name"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
              />
              <button 
                onClick={() => {
                  if (newAreaCity.trim()) {
                    setServiceAreas([...serviceAreas, { id: Date.now().toString(), city: newAreaCity }]);
                    setNewAreaCity("");
                  }
                }}
                className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green"
              >
                <Plus className="w-4 h-4" />
                Add Area
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {serviceAreas.map(area => (
              <div key={area.id} className="flex items-center justify-between bg-light-bg rounded-lg px-4 py-2">
                <span className="text-dark-bg">{area.city}</span>
                {editingSection === "areas" && (
                  <button 
                    onClick={() => setServiceAreas(serviceAreas.filter(a => a.id !== area.id))}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Partnerships */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-dark-bg">Certifications & Partnerships</h2>
            {editingSection !== "certifications" ? (
              <button 
                onClick={() => setEditingSection("certifications")}
                className="flex items-center gap-2 text-primary-green hover:text-secondary-green"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
                <button 
                  onClick={() => setEditingSection(null)}
                  className="flex items-center gap-2 bg-gray-300 text-dark-bg px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map(cert => (
              <div key={cert.id} className="border border-gray-200 rounded-lg p-4 text-center hover:shadow-lg transition-shadow relative">
                {editingSection === "certifications" && (
                  <button 
                    onClick={() => setCertifications(certifications.filter(c => c.id !== cert.id))}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mx-auto mb-3 overflow-hidden relative group">
                  {cert.logoImage ? (
                    <img src={cert.logoImage} alt={cert.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-2xl font-bold text-primary-green">{getLogoPlaceholder(cert.name)}</span>
                  )}
                  {editingSection === "certifications" && (
                    <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleLogoUpload(cert.id, e)}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {editingSection === "certifications" ? (
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => setCertifications(certifications.map(c => 
                      c.id === cert.id ? {...c, name: e.target.value} : c
                    ))}
                    className="w-full text-center font-semibold text-dark-bg border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <p className="font-semibold text-dark-bg">{cert.name}</p>
                )}
              </div>
            ))}
          </div>
          {editingSection === "certifications" && (
            <button 
              onClick={() => setCertifications([...certifications, {
                id: Date.now().toString(),
                name: "New Certification",
                logo: "NEW"
              }])}
              className="mt-4 flex items-center gap-2 text-primary-green hover:text-secondary-green"
            >
              <Plus className="w-4 h-4" />
              Add Certification
            </button>
          )}
        </div>

        {/* Team & Access */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-dark-bg mb-6">Team & Access</h2>
          
          <div className="flex gap-2 mb-6">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email to invite"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
            />
            <button 
              onClick={() => {
                if (newMemberEmail.trim()) {
                  setTeamMembers([...teamMembers, { 
                    id: Date.now().toString(), 
                    name: "New Member", 
                    email: newMemberEmail, 
                    role: "Member" 
                  }]);
                  setNewMemberEmail("");
                }
              }}
              className="flex items-center gap-2 bg-primary-green text-white px-4 py-2 rounded-lg hover:bg-secondary-green"
            >
              <Plus className="w-4 h-4" />
              Invite
            </button>
          </div>

          <div className="space-y-3">
            {teamMembers.map(member => (
              <div key={member.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div>
                  <p className="font-semibold text-dark-bg">{member.name}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>
                <select
                  value={member.role}
                  onChange={(e) => setTeamMembers(teamMembers.map(m => 
                    m.id === member.id ? { ...m, role: e.target.value } : m
                  ))}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  {roleOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Billing & Subscription */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-dark-bg mb-6">Billing & Subscription</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-dark-bg mb-4">Current Plan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-semibold text-primary-green">{subscription.plan}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Next Billing:</span>
                  <span className="font-semibold">{subscription.nextBilling}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold">${subscription.amount}/month</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => router.push('/wasteCompanyDashboard/payments')}
                className="w-full bg-primary-green text-white px-4 py-3 rounded-lg hover:bg-secondary-green"
              >
                Update Payment Info
              </button>
              <button 
                onClick={() => router.push('/wasteCompanyDashboard/invoices')}
                className="w-full bg-gray-200 text-dark-bg px-4 py-3 rounded-lg hover:bg-gray-300"
              >
                View Invoices
              </button>
              <button 
                onClick={() => router.push('/wasteCompanyDashboard/payments')}
                className="w-full bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600"
              >
                Remove Payment Method
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
