/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useRef } from "react";
import { Truck, Users, MapPin, FileText } from "lucide-react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const displayed = useTransform(springValue, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    return displayed.onChange(setDisplayValue);
  }, [displayed]);

  return (
    <span ref={ref} className="text-3xl font-bold text-gray-800 dark:text-white">
      {displayValue.toLocaleString()}+
    </span>
  );
};

const AboutSection: React.FC = () => {
  const logos = [
    "Rema.png",
    "/RSB.png",
    "/moe_logo.svg",
    "/RGF-Approved-logo-01.png",
    "/RDBMaster.png",
    "/MTN-Logo.png",
    "/kigali_logo.png",
  ];

  return (
    <section
      id="about"
      className="min-h-screen w-full bg-light-bg dark:bg-gray-900 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-10"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-12 lg:mb-20">
          <div className="relative w-full order-2 lg:order-1">
            <div className="absolute left-[38%] top-1/2 -translate-y-1/2 z-30 rounded-full bg-light-bg shadow-xl w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center cursor-pointer text-foreground font-semibold text-sm sm:text-base lg:text-lg transition-all duration-300 hover:scale-110 dark:bg-gray-800">
              GreenEx
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="col-span-1 sm:col-span-2 flex flex-col gap-2 sm:gap-4">
                <div className="overflow-hidden rounded-lg shadow-lg group h-[200px] sm:h-[250px] lg:h-[350px] w-full sm:w-[250px] lg:w-[300px]">
                  <img
                    src="/About3.png"
                    alt="About Image 1"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <div className="overflow-hidden rounded-lg shadow-lg group h-[200px] sm:h-[250px] lg:h-[350px] w-full sm:w-[250px] lg:w-[300px]">
                  <img
                    src="/About3.jpg"
                    alt="About Image 2"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg shadow-lg group h-[200px] sm:h-[250px] lg:h-[350px] w-full sm:w-[250px] lg:w-[300px] mt-0 sm:mt-32 lg:mt-60 -ml-0 sm:-ml-16 lg:-ml-25">
                <img
                  src="/About2.png"
                  alt="About Image 3"
                  className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 animate-fade-in-right order-1 lg:order-2 pl-0 sm:pl-8 lg:pl-40">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-green">
              About Us
            </h2>
            <p className="text-gray-700 dark:text-foreground text-base sm:text-lg leading-relaxed">
              Greenex is a digital platform created to transform how waste is collected,
              tracked, and managed across Rwanda. It bridges the gap between
              households, companies, and private garbage collection companies by
              providing a modern and reliable technology solution.
            </p>

            <Link
              href="/signin"
              className="inline-block bg-[#2E7D32] text-white px-6 sm:px-8 py-2 sm:py-3 font-semibold text-xs sm:text-sm uppercase tracking-wide transition-all transform hover:scale-105 rounded-lg shadow-[0_6px_12px_rgba(0,0,0,0.15)] [clip-path:polygon(0%_0%,100%_0%,90%_100%,0%_100%)]"
            >
              Explore More
            </Link>
          </div>
        </div>

        <div className="bg-primary-green rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-16 text-center mb-12 lg:mb-20 animate-scale-in shadow-2xl">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Our Mission
          </h3>
          <p className="text-white text-base sm:text-lg lg:text-xl leading-relaxed max-w-4xl mx-auto mb-6 sm:mb-8 px-2">
            GreenEx is committed to revolutionizing waste collection in
            Rwanda&apos;s technology. We empower citizens, companies, and
            private garbage collectors for a cleaner, healthier, and more
            sustainable future. Our vision is a Rwanda where smart waste
            management brings vibrant and eco-friendly communities.
          </p>

          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full backdrop-blur-sm mb-4">
            <Truck className="text-white" size={32} />
          </div>

          <p className="text-white/90 text-xs sm:text-sm font-medium">
            GreenEx - for sustainable Rwanda
          </p>
        </div>

        <motion.div
          className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-snug dark:text-foreground">
                Helping a local <span className="text-primary-green">village</span><br className="hidden sm:block" />
                <span className="sm:hidden"> </span>keeping it&apos;s <span className="text-primary-green">cleaness</span>
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                We reached here with our hard work and dedication
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >

              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.6
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                >
                  <Users className="text-primary-green mb-2 mx-auto" size={36} />
                </motion.div>
                <AnimatedCounter value={30000} duration={2.5} />
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base dark:text-gray-400">Members</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 0.8
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -5, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 2
                  }}
                >
                  <MapPin className="text-primary-green mb-2 mx-auto" size={36} />
                </motion.div>
                <AnimatedCounter value={10} duration={1.5} />
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base dark:text-gray-400">Partnerships</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 1.0
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 15, -15, 0]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 4
                  }}
                >
                  <Users className="text-primary-green mb-2 mx-auto" size={36} />
                </motion.div>
                <AnimatedCounter value={13} duration={1.8} />
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base dark:text-gray-400">Waste collectors companies</p>
              </motion.div>

              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  delay: 1.2
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.1,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, -10, 10, 0],
                    y: [0, -3, 0]
                  }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    repeatDelay: 3.5
                  }}
                >
                  <FileText className="text-primary-green mb-2 mx-auto" size={36} />
                </motion.div>
                <AnimatedCounter value={20} duration={2} />
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base dark:text-gray-400">Districts</p>
              </motion.div>
            </motion.div>

          </div>
        </motion.div>

        <div className="pt-12 sm:pt-16">
          <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-800 dark:text-white mb-4">
            Our Partners
          </h3>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gray-800 dark:bg-white mx-auto mb-6 sm:mb-8"></div>
          <p className="text-center text-gray-600 dark:text-gray-400 text-base sm:text-lg mb-8 sm:mb-12 px-4">
            We have been working with some Fortune 5+ organisations
          </p>

          <div className="overflow-hidden relative py-6">
            <div className="flex whitespace-nowrap animate-scroll">
              {[...logos, ...logos].map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  className="mx-4 sm:mx-6 lg:mx-10 h-12 sm:h-16 lg:h-20 w-auto object-contain"
                  alt="partner logo"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;