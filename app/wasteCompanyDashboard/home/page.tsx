"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Linkedin, Twitter, Facebook, Award, Send } from "lucide-react";
import { initialCompanyInfo, initialAboutUs, initialServices, initialServiceAreas, initialCertifications } from "@/data/profile-data";

export default function HomePage() {
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const [aboutUs, setAboutUs] = useState(initialAboutUs);
  const [services, setServices] = useState(initialServices);
  const [serviceAreas, setServiceAreas] = useState(initialServiceAreas);
  const [certifications, setCertifications] = useState(initialCertifications);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const savedProfile = localStorage.getItem("companyProfile");
    if (savedProfile) {
      const profile = JSON.parse(savedProfile);
      setCompanyInfo(profile.companyInfo || initialCompanyInfo);
      setAboutUs(profile.aboutUs || initialAboutUs);
      setServices(profile.services || initialServices);
      setServiceAreas(profile.serviceAreas || initialServiceAreas);
      setCertifications(profile.certifications || initialCertifications);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="p-6">
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Preview Mode:</strong> This is how households/users will see your company profile when accessing your services.
        </p>
      </div>

      {/* Hero Section */}
      <section className="min-h-[60vh] w-full bg-cover bg-center relative overflow-hidden flex items-center justify-center rounded-2xl mb-8" style={{ backgroundImage: companyInfo.coverImage ? `url(${companyInfo.coverImage})` : "url('/landingImage.png')" }}>
        <div className="absolute inset-0 bg-dark-overlay rounded-2xl"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
          {companyInfo.logo && (
            <img src={companyInfo.logo} alt="Company Logo" className="w-24 h-24 rounded-full object-cover mb-4 border-4 border-white shadow-lg" />
          )}
          <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg text-white">
            {companyInfo.name}
          </h1>
          <p className="text-white text-2xl font-light opacity-90 mb-8">
            Your Trusted Waste Management Partner
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-light-bg dark:bg-gray-900 py-16 px-8 rounded-2xl mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-primary-green mb-6">About Us</h2>
          <div className="w-20 h-1 bg-primary-green mb-6"></div>
          <p className="text-gray-700 dark:text-foreground text-lg leading-relaxed">{aboutUs}</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-primary-green py-16 px-8 rounded-2xl mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-white text-4xl font-bold mb-4">Our Services</h2>
            <div className="w-20 h-1 bg-white mx-auto mb-6"></div>
            <p className="text-white text-lg">Save Time Managing Your Waste With Our Best Services</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-light-bg dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                <div className="p-6">
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="text-lg font-semibold text-dark-bg mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas Section */}
      <section className="bg-white dark:bg-gray-800 py-16 px-8 rounded-2xl mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-dark-bg dark:text-white mb-6 flex items-center gap-2">
            <MapPin className="w-8 h-8 text-primary-green" />
            Service Areas
          </h2>
          <div className="flex flex-wrap gap-3">
            {serviceAreas.map((area) => (
              <div key={area.id} className="bg-primary-green/10 text-primary-green px-6 py-3 rounded-full font-medium text-lg">
                {area.city}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-light-bg/50 dark:bg-gray-900 py-16 px-8 rounded-2xl mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-dark-bg dark:text-white mb-6 flex items-center gap-2">
            <Award className="w-8 h-8 text-primary-green" />
            Certifications & Partnerships
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                {cert.logo && cert.logo.startsWith('http') ? (
                  <img src={cert.logo} alt={cert.name} className="w-16 h-16 object-contain mb-2" />
                ) : (
                  <div className="w-16 h-16 bg-primary-green/10 rounded-full flex items-center justify-center mb-2">
                    <span className="text-primary-green font-bold text-lg">
                      {cert.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{cert.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-8 bg-light-bg dark:bg-gray-900 rounded-2xl">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Contact Us</h2>
            <div className="w-20 h-1 bg-foreground mx-auto mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300">Get in touch with us for efficient waste management solutions</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-foreground mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green resize-none" placeholder="Your message here..." />
                </div>
                <button type="submit" className="w-full bg-primary-green text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{companyInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{companyInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary-green flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">{companyInfo.address}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary-green to-secondary-green rounded-2xl p-8 text-white shadow-xl">
                <h3 className="text-2xl font-bold mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  {companyInfo.linkedin && (
                    <a href={`https://${companyInfo.linkedin}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Linkedin className="w-6 h-6 text-white" />
                    </a>
                  )}
                  {companyInfo.twitter && (
                    <a href={`https://twitter.com/${companyInfo.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Twitter className="w-6 h-6 text-white" />
                    </a>
                  )}
                  {companyInfo.facebook && (
                    <a href={`https://${companyInfo.facebook}`} target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                      <Facebook className="w-6 h-6 text-white" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
