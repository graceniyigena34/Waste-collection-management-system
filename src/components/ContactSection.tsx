/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import { contactService } from "@/lib/contact-service";
import { toast } from "react-toastify";

const contactInfo = [
  {
    icon: <Phone className="w-6 h-6" />,
    title: "Phone",
    details: "+250 788 800 777",
    description: ""
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Email",
    details: "greenex@wastecollection.com",
    description: ""
  },
  {
    icon: <MapPin className="w-6 h-6" />,
    title: "Office",
    details: "KG,str Kigali, Rwanda",
    description: ""
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Working Hours",
    details: "8:00 AM - 6:00 PM",
    description: "Monday to Saturday"
  }
];

const ContactSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    service: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.name,
        email: formData.email,
        phone: formData.phone,
        serviceInterest: formData.service,
        message: formData.message
      };

      console.log('Submitting contact form:', payload);
      const response = await contactService.submitContactForm(payload);
      console.log('Contact form response:', response);

      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: "", email: "", phone: "", message: "", service: "" });
    } catch (error: any) {
      console.error('Contact form error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="contact" className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 bg-light-bg dark:bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
            Contact Us
          </h2>
          <motion.div
            className="w-16 sm:w-20 lg:w-24 h-1 bg-foreground dark:bg-white mx-auto mb-6 sm:mb-8"
            initial={{ width: 0, scaleX: 0 }}
            animate={isInView ? { width: 96, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            Get in touch with us for efficient waste management solutions.
            We&apos;re here to help!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* LEFT SIDE: CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.h3
                className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <MessageSquare className="w-6 h-6" />
                Send us a message
              </motion.h3>
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4 sm:space-y-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="+250..........."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service Interest
                  </label>
                  <select
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a service</option>
                    <option value="collection">Waste Collection</option>
                    <option value="recycling">Recycling Services</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-foreground focus:ring-2 focus:ring-primary-green dark:focus:ring-secondary-green focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Your message here..."
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full bg-primary-green dark:bg-secondary-green text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-semibold hover:shadow-2xl hover:shadow-primary-green/30 dark:hover:shadow-secondary-green/30 transition-all duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={!isSubmitting ? { scale: 1.02, y: -2 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Send className="w-5 h-5" />
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </motion.button>
              </motion.form>
            </motion.div>
          </motion.div>

          {/* RIGHT SIDE: MAP + CONTACT INFO + PICKUP */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >

            {/* MAP ON TOP */}
            <motion.div
              className="w-full h-48 sm:h-56 lg:h-64 rounded-2xl overflow-hidden shadow-lg mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <iframe
                src="https://maps.google.com/maps?q=SheCanCode%20Training%20Center&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            {/* CONTACT INFO LIST */}
            <motion.div
              className="space-y-4 sm:space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {contactInfo
                .filter((info) => info.title !== "Working Hours")
                .map((info, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 sm:gap-4 py-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                    whileHover={{
                      scale: 1.05,
                      x: 10,
                      transition: { type: "spring", stiffness: 400, damping: 10 }
                    }}
                  >
                    <motion.div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary-green flex items-center justify-center flex-shrink-0"
                      whileHover={{
                        scale: 1.1,
                        rotate: 360,
                        transition: { duration: 0.3 }
                      }}
                    >
                      <div className="text-white text-sm sm:text-base">{info.icon}</div>
                    </motion.div>
                    <div>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 font-medium">
                        {info.details}
                      </p>
                    </div>
                  </motion.div>
                ))}
            </motion.div>

            {/* PICKUP CARD */}
            <motion.div
              className="mt-6 sm:mt-8 bg-gradient-to-br from-primary-green to-secondary-green rounded-2xl p-6 sm:p-8 text-white shadow-xl"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.8
              }}
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <motion.h3
                className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                Request a Pickup
              </motion.h3>
              <motion.p
                className="mb-4 sm:mb-6 text-sm sm:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.0 }}
              >
                Need immediate waste collection? Schedule a pickup now and
                we&apos;ll be there promptly.
              </motion.p>
              <motion.button
                onClick={() => scrollToSection("contact")}
                className="group relative w-full bg-white text-primary-green px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Schedule Pickup</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-green/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
