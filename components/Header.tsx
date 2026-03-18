"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Truck, Moon, Sun, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  activeSection: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onThemeToggle, isDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [menuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      })
      setMenuOpen(false);
    }
  }

  const isActive = (section: string) =>
    activeSection === section ? "underline underline-offset-8 decoration-2 text-primary-green dark:text-secondary-green" : "";

  const headerBgClass = scrolled
    ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg"
    : "bg-transparent";

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerBgClass}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Truck size={32} className="sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-primary-green dark:text-secondary-green" />
          </motion.div>
          <motion.h1
            className="text-primary-green text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide dark:text-secondary-green"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            GreenEx
          </motion.h1>
        </motion.div>

        <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2">
          <AnimatePresence>
            {scrolled && (
              <motion.div
                className="flex items-center gap-8 xl:gap-12 font-medium text-base lg:text-lg"
                variants={navVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <motion.button
                  onClick={() => scrollToSection("home")}
                  className={`${isActive("home")} hover:text-primary-green dark:hover:text-secondary-green transition-colors`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Home
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("about")}
                  className={`${isActive("about")}  hover:text-primary-green dark:hover:text-secondary-green transition-colors`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  About
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("services")}
                  className={`${isActive("services")} hover:text-primary-green dark:hover:text-secondary-green transition-colors`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Services
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection("contact")}
                  className={`${isActive("contact")} hover:text-primary-green dark:hover:text-secondary-green transition-colors`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Us
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="hidden lg:flex items-center gap-4 lg:gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            onClick={() => router.push("/signin")}
            className="bg-primary-green dark:bg-secondary-green text-white px-4 lg:px-6 py-2 rounded-lg font-medium text-sm lg:text-base hover:bg-opacity-90 transition-all"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            Request pickup
          </motion.button>
        </motion.div>

        <motion.div
          className="flex items-center gap-3 lg:hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          <motion.button
            className="text-foreground text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{ rotate: menuOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {menuOpen ? '✕' : '☰'}
          </motion.button>
        </motion.div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 lg:hidden bg-white dark:bg-dark-bg w-full h-screen z-50 flex flex-col items-center justify-center text-foreground"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.div
              className="flex flex-col items-center gap-6 text-lg sm:text-xl font-medium p-4 w-full max-w-xs"
              variants={navVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                onClick={() => scrollToSection("home")}
                className={`${isActive("home")} hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("about")}
                className={`${isActive("about")} hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                About
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("services")}
                className={`${isActive("services")} hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                Services
              </motion.button>
              <motion.button
                onClick={() => scrollToSection("contact")}
                className={`${isActive("contact")} hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>

              {/* Navigation Links
              <motion.button
                onClick={() => { router.push('/onboarding'); setMenuOpen(false); }}
                className="hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                Onboarding
              </motion.button>
              <motion.button
                onClick={() => { router.push('/wasteCompanyDashboard'); setMenuOpen(false); }}
                className="hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05, x: 10 }}
                whileTap={{ scale: 0.95 }}
              >
                Waste Company Dashboard
              </motion.button> */}

              <motion.button
                onClick={() => router.push("/signin")}
                className="bg-primary-green dark:bg-secondary-green text-white px-6 sm:px-8 py-3 rounded-xl font-medium mt-6 text-base hover:bg-opacity-90 transition-colors w-full"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Request pickup
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;