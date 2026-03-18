"use client";
import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

const Home: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);

  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path ? "underline underline-offset-8 text-emerald-300" : "";


  const fullText = "GreenEx";
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setTimeout(() => setIsTypingDone(true), 200);
      }
    }, 130);
    return () => clearInterval(interval);
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

  return (
    <section
      className="min-h-screen w-full bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/landingImage.png')" }}
    >
      <div className="absolute inset-0 bg-[#0c351f]/80"></div>
      <nav className="absolute top-0 inset-x-0 flex justify-between items-center px-4 md:px-10 py-5 z-30">
        <div className="flex items-center gap-2">
          <Truck size={45} className="text-white" />
          <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
            GreenEx
          </h1>
        </div>
        <div className="hidden md:flex items-center">
          <div className="flex items-center gap-25 text-white font-medium text-lg pr-10 lg:pr-40 pl-25">
            <Link className={`${isActive("/")} hover:text-emerald-300 transition`} href="/">Home</Link>
            <Link className={`${isActive("/about")} hover:text-emerald-300 transition`} href="/about">About</Link>
            <Link className={`${isActive("/services")} hover:text-emerald-300 transition`} href="/services">Services</Link>
            <Link className={`${isActive("/contact")} hover:text-emerald-300 transition`} href="/contact">Contact Us</Link>
          </div>

          <button className="ml-4 lg:ml-10 bg-[#31a366] text-white px-4 py-2 lg:px-6 lg:py-2 rounded-lg font-medium hover:bg-[#2a8f57] transition">
            Request a pickup
          </button>
        </div>

        
        <button
          className="text-white text-3xl md:hidden z-40"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

    
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 md:hidden bg-[#0c351f] w-full h-full z-30 flex flex-col items-center justify-center text-white transition-all duration-300 ease-in-out ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-4 text-xl font-medium p-4 w-full max-w-xs">
          <Link 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-emerald-300 transition-colors duration-200 py-2 w-full text-center"
            href="/"
          >
            Home
          </Link>
          <Link 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-emerald-300 transition-colors duration-200 py-2 w-full text-center"
            href="/about"
          >
            About
          </Link>
          <Link 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-emerald-300 transition-colors duration-200 py-2 w-full text-center"
            href="/services"
          >
            Services
          </Link>
          <Link 
            onClick={() => setMenuOpen(false)} 
            className="hover:text-emerald-300 transition-colors duration-200 py-2 w-full text-center"
            href="/contact"
          >
            Contact Us
          </Link>

          <button className="bg-[#25b86a] text-white px-8 py-3 rounded-xl font-medium mt-6 text-base hover:bg-[#1f9c58] transition-colors w-full">
            Request a pickup
          </button>
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <h1
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold mb-4 drop-shadow-lg tracking-tight bg-gradient-to-r from-white via-white to-[#25b86a] text-transparent bg-clip-text"
        >
          {typedText}
          {!isTypingDone && (
            <span className="border-r-4 border-white animate-pulse ml-1"></span>
          )}
        </h1>

        <p className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-light opacity-90 mb-8 sm:mb-10 md:mb-14 px-4">
          Cleaner waste management
        </p>

        <div className="flex justify-center items-center sm:flex-row gap-4 sm:gap-6 w-full max-w-sm sm:max-w-none px-4">
          <button className="bg-[#25b86a] text-white px-6 sm:px-14 py-3 sm:py-4 rounded-2xl text-base sm:text-lg md:text-xl hover:bg-[#1f9c58] transition shadow-xl font-medium">
            Get Started
          </button>

          <button className="border-2 border-white text-white px-6 sm:px-14 py-3 sm:py-4 rounded-xl font-medium text-base sm:text-lg md:text-xl hover:bg-white/10 transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  ); 
};

export default Home;