"use client";

import React from "react";
import Link from "next/link";
import { Shield, ArrowLeft, Lock, Eye, Database, UserCheck, Share2, CheckCircle } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-light-bg dark:bg-gray-900 text-foreground">
            {/* Simple Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-primary-green hover:text-secondary-green transition-colors font-semibold text-sm sm:text-base"
                    >
                        <ArrowLeft size={20} />
                        Back to Home
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                {/* Title Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-primary-green/10 dark:bg-primary-green/20 rounded-2xl mb-4 sm:mb-6">
                        <Shield className="text-primary-green" size={36} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        PRIVACY POLICY
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl mx-auto px-4">
                        Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use the GreenEx platform.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 sm:space-y-10">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <Database className="text-primary-green" size={24} />
                            INFORMATION WE COLLECT
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                We collect information that you provide directly to us when you create an account, use our services, or communicate with us. This includes:
                            </p>
                            <ul className="space-y-2 sm:space-y-3 ml-0 sm:ml-6">
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Account Information:</strong> Name, email address, phone number, and password</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Location Data:</strong> Address and service area for waste collection scheduling</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Payment Information:</strong> Billing details for processing service fees</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Usage Data:</strong> Information about how you interact with our platform</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <Eye className="text-primary-green" size={24} />
                            HOW WE USE YOUR INFORMATION
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                We use the information we collect to provide, maintain, and improve our services. Specifically, we use your information to:
                            </p>
                            <div className="grid gap-3 sm:gap-4 mt-4 sm:mt-6">
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Service Delivery</h3>
                                    <p className="text-xs sm:text-sm">
                                        Schedule and coordinate waste collection services, send notifications about pickups, and process payments.
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Platform Improvement</h3>
                                    <p className="text-xs sm:text-sm">
                                        Analyze usage patterns to enhance user experience and optimize our waste management routes.
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Communication</h3>
                                    <p className="text-xs sm:text-sm">
                                        Send you updates, service announcements, and respond to your inquiries and support requests.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <Lock className="text-primary-green" size={24} />
                            HOW WE PROTECT YOUR DATA
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
                            </p>
                            <div className="bg-primary-green/5 dark:bg-primary-green/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary-green/20">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                    <Shield className="text-primary-green" size={18} />
                                    Security Measures
                                </h3>
                                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />
                                        Encrypted data transmission using SSL/TLS protocols
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />
                                        Secure password storage with industry-standard hashing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />
                                        Regular security audits and vulnerability assessments
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary-green shrink-0" />
                                        Limited employee access to personal data on a need-to-know basis
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <Share2 className="text-primary-green" size={24} />
                            INFORMATION SHARING
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                We do not sell your personal information to third parties. We may share your information only in the following circumstances:
                            </p>
                            <ul className="space-y-2 sm:space-y-3 ml-0 sm:ml-6">
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Service Providers:</strong> With waste collection companies to fulfill your service requests</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Legal Requirements:</strong> When required by law or to protect our rights and safety</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span><strong className="text-gray-900 dark:text-white">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <UserCheck className="text-primary-green" size={24} />
                            YOUR PRIVACY RIGHTS
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                You have certain rights regarding your personal information. These include:
                            </p>
                            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6">
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Access & Update</h3>
                                    <p className="text-xs sm:text-sm">
                                        View and update your personal information through your account settings.
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Data Deletion</h3>
                                    <p className="text-xs sm:text-sm">
                                        Request deletion of your account and associated personal data.
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Data Portability</h3>
                                    <p className="text-xs sm:text-sm">
                                        Export your data in a commonly used, machine-readable format.
                                    </p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">Opt-Out</h3>
                                    <p className="text-xs sm:text-sm">
                                        Unsubscribe from marketing communications at any time.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-xl sm:text-2xl">📧</span>
                            CONTACT US
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:
                            </p>
                            <div className="bg-primary-green/5 dark:bg-primary-green/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary-green/20">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">GreenEx Privacy Team</p>
                                <p className="text-sm sm:text-base">Email: privacy@greenex.rw</p>
                                <p className="text-sm sm:text-base">Phone: +250 XXX XXX XXX</p>
                                <p className="mt-2 text-xs sm:text-sm">Address: Kigali, Rwanda</p>
                            </div>
                        </div>
                    </section>

                </div>

                {/* Action Buttons */}
                <div className="mt-10 sm:mt-12 py-6 sm:py-8">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md mx-auto">
                        <Link
                            href="/signup"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-primary-green hover:bg-secondary-green text-white rounded-lg sm:rounded-xl font-bold text-center transition-colors shadow-lg text-sm sm:text-base"
                        >
                            ACCEPT
                        </Link>
                        <Link
                            href="/"
                            className="px-6 sm:px-8 py-3 sm:py-4 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-bold text-center transition-colors border border-gray-300 dark:border-gray-600 text-sm sm:text-base"
                        >
                            DECLINE
                        </Link>
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-4 sm:mt-6">
                        Last updated: January 26, 2026
                    </p>
                </div>

                {/* Additional Links */}
                <div className="text-center mt-6 sm:mt-8 pb-4">
                    <Link
                        href="/terms"
                        className="text-primary-green hover:text-secondary-green font-semibold underline text-sm sm:text-base"
                    >
                        View Terms of Service
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12 sm:mt-16 lg:mt-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-center">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        © 2026 GreenEx. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
