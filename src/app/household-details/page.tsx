"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Home, FileText, ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import Image from "next/image";

export default function HouseholdDetailsPage() {
  const [sector, setSector] = useState("");
  const [cell, setCell] = useState("");
  const [village, setVillage] = useState("");
  const [address, setAddress] = useState("");
  const [houseType, setHouseType] = useState("RESIDENTIAL");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
   
    const userInfo = localStorage.getItem("user_info");
    if (!userInfo) {
      router.push("/signin");
      return;
    }

    const user = JSON.parse(userInfo);
    if (user.role !== "CITIZEN") {
      router.push("/");
      return;
    }

    const detailsSubmitted = localStorage.getItem("household_details_submitted");
    if (detailsSubmitted === "true") {
      router.push("/User-Dashboard");
    }
  }, [router]);

  const validSector = sector.trim().length >= 2;
  const validCell = cell.trim().length >= 2;
  const validVillage = village.trim().length >= 2;
  const validAddress = address.trim().length >= 5;

  const canSubmit = validSector && validCell && validVillage && validAddress && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setIsLoading(true);

    try {
      // Mock household details submission
      await new Promise(resolve => setTimeout(resolve, 1000));

      const payload = {
        sector: sector.trim(),
        cell: cell.trim(),
        village: village.trim(),
        address: address.trim(),
        houseType,
        notes: notes.trim() || undefined,
      };

      // Store household details locally
      localStorage.setItem("household_details", JSON.stringify(payload));
      localStorage.setItem("household_details_submitted", "true");
      
      toast.success("Household details saved successfully!");
      
      setTimeout(() => {
        router.push("/User-Dashboard");
      }, 1000);
    } catch (error) {
      console.error('Household submission error:', error);
      toast.error("Failed to save details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto"
      >
        <div className="w-full max-w-lg space-y-4 py-4">
          <div className="text-center lg:text-left space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary-green to-secondary-green bg-clip-text text-transparent">
              Complete Your Profile
            </h1>
            <p className="text-muted-foreground">
              Tell us about your household location
            </p>
          </div>

          <div className="space-y-4">
          
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
                <div className="space-y-1">
                  <label className="text-sm font-medium ml-1">
                    Sector <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Kicukiro"
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${
                      sector && !validSector
                        ? "border-red-500"
                        : "border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                    }`}
                  />
                </div>

                {/* Cell */}
                <div className="space-y-1">
                  <label className="text-sm font-medium ml-1">
                    Cell <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Gahanga"
                    value={cell}
                    onChange={(e) => setCell(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${
                      cell && !validCell
                        ? "border-red-500"
                        : "border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                    }`}
                  />
                </div>

             
                <div className="space-y-1">
                  <label className="text-sm font-medium ml-1">
                    Village <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Kabuga"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${
                      village && !validVillage
                        ? "border-red-500"
                        : "border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                    }`}
                  />
                </div>
              </div>

            
              <div className="space-y-1">
                <label className="text-sm font-medium ml-1">
                  Street Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your full street address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-xl border bg-white/50 dark:bg-white/5 transition-all outline-none ${
                    address && !validAddress
                      ? "border-red-500"
                      : "border-border focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green"
                  }`}
                />
              </div>
            </div>

            
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">
                House Type <span className="text-red-500">*</span>
              </label>
              <select
                value={houseType}
                onChange={(e) => setHouseType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all outline-none appearance-none cursor-pointer"
              >
                <option value="RESIDENTIAL">Residential</option>
                <option value="COMMERCIAL">Commercial</option>
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
              </select>
            </div>

            
            <div className="space-y-1">
              <label className="text-sm font-medium ml-1">Notes (Optional)</label>
              <textarea
                placeholder="Any additional notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white/50 dark:bg-white/5 focus:ring-2 focus:ring-primary-green/20 focus:border-primary-green transition-all outline-none resize-none"
              />
            </div>

            
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-700 to-green-600 hover:from-green-800 hover:to-green-700 text-white font-semibold shadow-lg shadow-green-900/10 hover:shadow-green-900/20 transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>

     
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="hidden lg:block lg:w-1/2 relative overflow-hidden"
      >
        <Image
          src="/landingImage.png"
          alt="GreenEx Household"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-green-900/90 via-green-800/40 to-black/10" />
        
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-10 bg-gradient-to-t from-black/80 to-transparent">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="h-12 w-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center mb-6">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Join the Green Revolution</h2>
            <p className="text-lg text-white/80 max-w-md leading-relaxed">
              Manage your waste collection efficiently and contribute to a cleaner, sustainable future with GreenEx.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
