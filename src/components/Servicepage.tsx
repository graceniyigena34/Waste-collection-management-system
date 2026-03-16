"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

const services = [
  {
    title: "Real-Time Alerts & Schedule",
    description:
      "Citizens receive timely SMS/App reminders and alerts for their specific collection day. They can also view the exact upcoming date and route status.",
    image: "/Service2.png",
  },
  {
    title: "Effortless Digital Payments",
    description:
      "Seamless, integrated payment via popular mobile money channels, coupled with an easily accessible history of all past payments.",
    image: "/Service1.png",
  },
  {
    title: "Instant Reporting & Resolution for Missed Pickups",
    description:
      "A direct portal for citizens to instantly report a missed collection or request a one-off extra pickup for special waste.",
    image: "/Service3.png",
  },
];

export default function ServicePage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" ref={ref}>
      <div className="w-full bg-primary-green py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 transition-all">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.h2
            className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Our services
          </motion.h2>
          <motion.div
            className="w-16 sm:w-20 lg:w-24 h-1 bg-white mx-auto mb-4 sm:mb-6"
            initial={{ width: 0, scaleX: 0 }}
            animate={isInView ? { width: 96, scaleX: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          ></motion.div>

          <motion.p
            className="text-white dark:text-gray-300 text-base sm:text-lg leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Save Time Managing Your waste collecting <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>With Our Best Services
          </motion.p>
        </motion.div>
        <motion.div
          className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {services.map((srv, index) => (
            <motion.div
              key={index}
              className="bg-light-bg dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:hover:shadow-secondary-green/20 transition-all cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                y: -10,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-full h-48 sm:h-56 lg:h-64 relative overflow-hidden rounded-t-xl">
                <Image
                  src={srv.image}
                  alt={srv.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/fallback.png";
                  }}
                />
              </div>

              <motion.div
                className="p-4 sm:p-6"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              >
                <motion.h3
                  className="font-semibold text-base sm:text-lg mb-2 text-black dark:text-white"
                  whileHover={{
                    color: "#059669",
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                >
                  {srv.title}
                </motion.h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                  {srv.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
