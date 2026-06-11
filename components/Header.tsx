"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Truck, Moon, Sun, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/lib/language-context";
import { LANGUAGES } from "@/lib/i18n";

interface HeaderProps {
  activeSection: string;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeSection, onThemeToggle, isDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [menuOpen]);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const isActive = (section: string) =>
    activeSection === section
      ? "underline underline-offset-8 decoration-2 text-primary-green dark:text-secondary-green"
      : "";

  const headerBgClass = scrolled
    ? "bg-white/95 dark:bg-gray-800/95 backdrop-blur-md shadow-lg"
    : "bg-transparent";

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  };

  const LangSwitcher = ({ isMobile }: { isMobile?: boolean }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
          aria-label="Switch language"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Globe size={18} />
          <span className={isMobile ? 'text-base' : 'text-xs uppercase tracking-wide'}>{lang}</span>
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code)}
            className={`flex items-center gap-2 cursor-pointer ${lang === l.code ? 'font-semibold text-primary-green' : ''}`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <motion.header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${headerBgClass}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
            <Truck size={32} className="sm:w-10 sm:h-10 lg:w-11 lg:h-11 text-primary-green dark:text-secondary-green" />
          </motion.div>
          <motion.h1
            className="text-primary-green text-xl sm:text-2xl lg:text-3xl font-bold tracking-wide dark:text-secondary-green"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            EcoTrack
          </motion.h1>
        </motion.div>

        {/* Desktop nav links (shown on scroll) */}
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
                {(['home', 'about', 'services', 'contact'] as const).map((section) => (
                  <motion.button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={`${isActive(section)} hover:text-primary-green dark:hover:text-secondary-green transition-colors`}
                    variants={itemVariants}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {section === 'home' && t.nav.home}
                    {section === 'about' && t.nav.about}
                    {section === 'services' && t.nav.services}
                    {section === 'contact' && t.nav.contact}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop right actions */}
        <motion.div
          className="hidden lg:flex items-center gap-3 lg:gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <LangSwitcher />
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
            {t.nav.requestPickup}
          </motion.button>
        </motion.div>

        {/* Mobile right actions */}
        <motion.div
          className="flex items-center gap-2 lg:hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <LangSwitcher />
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
              {([
                { id: 'home', label: t.nav.home },
                { id: 'about', label: t.nav.about },
                { id: 'services', label: t.nav.services },
                { id: 'contact', label: t.nav.contact },
              ] as const).map(({ id, label }) => (
                <motion.button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`${isActive(id)} hover:text-primary-green dark:hover:text-secondary-green transition-colors duration-200 py-2 w-full text-center`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {label}
                </motion.button>
              ))}

              <motion.button
                onClick={() => router.push("/signin")}
                className="bg-primary-green dark:bg-secondary-green text-white px-6 sm:px-8 py-3 rounded-xl font-medium mt-6 text-base hover:bg-opacity-90 transition-colors w-full"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.nav.requestPickup}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
