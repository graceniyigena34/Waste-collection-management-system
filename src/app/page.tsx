"use client";
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import HomeSection from "@/components/HomeSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Servicepage from "@/components/Servicepage";
import Footer from "@/components/Footer";


export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("home");
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "services", "contact"];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 text-foreground transition-colors duration-300">
      <Header
        activeSection={activeSection}
        onThemeToggle={toggleTheme}
        isDarkMode={isDarkMode}
      />
      <main>
        <HomeSection />
        <AboutSection />
        <Servicepage />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}