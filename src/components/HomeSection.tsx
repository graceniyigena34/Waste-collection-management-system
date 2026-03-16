"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const HomeSection: React.FC = () => {
  const [typedText, setTypedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const fullText = "GreenEx";
  const router = useRouter();

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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section 
      id="home" 
      className="min-h-screen w-full bg-cover bg-center relative overflow-hidden flex items-center justify-center"
      style={{ backgroundImage: "url('/landingImage.png')" }}
    >
      <div className="absolute inset-0 bg-dark-overlay"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">

        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg tracking-tight text-gradient animate-fade-in-up">
          {typedText}
          {!isTypingDone && (
            <span className="border-r-2 sm:border-r-4 border-white animate-pulse ml-1"></span>
          )}
        </h1>

        <p className="text-white text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-light opacity-90 mb-8 sm:mb-10 lg:mb-12 animate-fade-in-up delay-300 max-w-4xl leading-relaxed">
         Smarter waste management for a sustainable future <br className="hidden sm:block" />
         <span className="sm:hidden"> </span>Building eco-friendly communities across Rwanda
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 animate-fade-in-up delay-500 w-full max-w-md sm:max-w-none">
          <button 
            onClick={() => router.push("/signup")}
            className="group relative bg-primary-green dark:bg-secondary-green text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:shadow-2xl hover:shadow-primary-green/30 dark:hover:shadow-secondary-green/30 transition-all duration-300 overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10">Get Started</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>

          <button 
            onClick={() => scrollToSection("about")}
            className="group relative border-2 border-white text-white px-8 sm:px-10 lg:px-12 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg font-semibold hover:bg-white/10 transition-all duration-300 overflow-hidden w-full sm:w-auto"
          >
            <span className="relative z-10">Learn More</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HomeSection;