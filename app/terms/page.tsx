"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft, CheckCircle } from "lucide-react";

export default function TermsPage() {
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
                        <FileText className="text-primary-green" size={36} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                        TERMS OF SERVICE
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-base sm:text-lg max-w-3xl mx-auto px-4">
                        This summary is provided only for convenience. Please review the Terms of Service below in their entirety for important information and conditions that apply to your use of the Platform.
                    </p>
                </div>

                {/* Content */}
                <div className="space-y-8 sm:space-y-10">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">01.</span>
                            ACCEPTANCE OF TERMS
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                By accessing and using the GreenEx platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                            </p>
                            <p>
                                These terms apply to all users of the Platform, including households, waste collection companies, and administrators.
                            </p>
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">02.</span>
                            YOUR POSTING OF USER CONTENT
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                <strong className="text-gray-900 dark:text-white">"User Content"</strong> means content that users have created and posted to the Platform for use by other Users, including both your devices and any comments that you or other Users may post to online comics or other User Content.
                            </p>
                            <p>
                                You represent and warrant that you own the User Content you post to the Platform or that you have the legal right to post the User Content. You are solely responsible for your User Content. You agree that GreenEx will not be held liable to you with respect to the actions of any other user.
                            </p>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
                                <p className="text-xs sm:text-sm italic">
                                    GreenEx does not receive any ownership or license in your User Content by virtue of posting it to the Platform. You retain all ownership rights to your User Content.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">03.</span>
                            USER RESPONSIBILITIES
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>As a user of GreenEx, you agree to:</p>
                            <ul className="space-y-2 sm:space-y-3 ml-0 sm:ml-6">
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span>Provide accurate and up-to-date information during registration</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span>Maintain the security of your account credentials</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span>Use the platform in compliance with all applicable laws and regulations</span>
                                </li>
                                <li className="flex items-start gap-2 sm:gap-3">
                                    <CheckCircle className="text-primary-green shrink-0 mt-1" size={18} />
                                    <span>Respect the rights and privacy of other users</span>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">04.</span>
                            WASTE COLLECTION SERVICES
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                GreenEx provides a platform connecting households with registered waste collection companies. We facilitate scheduling, tracking, and payment processing for waste collection services.
                            </p>
                            <p>
                                While we strive to ensure reliable service, GreenEx is not directly responsible for the physical waste collection activities performed by third-party waste management companies.
                            </p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">05.</span>
                            PAYMENT AND BILLING
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                Payment for waste collection services is processed through the GreenEx platform. Users agree to pay all applicable fees according to the pricing structure displayed at the time of service booking.
                            </p>
                            <p>
                                All payments are final and non-refundable unless otherwise specified in our refund policy or required by law.
                            </p>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">06.</span>
                            LIMITATION OF LIABILITY
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                GreenEx shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the platform.
                            </p>
                            <p>
                                We do not guarantee uninterrupted or error-free service and reserve the right to modify or discontinue features at any time.
                            </p>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">07.</span>
                            PRIVACY AND DATA PROTECTION
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                Your privacy is important to us. Please review our{" "}
                                <Link href="/privacy" className="text-primary-green hover:text-secondary-green font-semibold underline">
                                    Privacy Policy
                                </Link>{" "}
                                to understand how we collect, use, and protect your personal information.
                            </p>
                        </div>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">08.</span>
                            CHANGES TO TERMS
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                GreenEx reserves the right to modify these Terms of Service at any time. We will notify users of significant changes via email or platform notifications.
                            </p>
                            <p>
                                Continued use of the platform after changes constitutes acceptance of the updated terms.
                            </p>
                        </div>
                    </section>

                    {/* Section 9 */}
                    <section>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                            <span className="text-primary-green text-lg sm:text-xl">09.</span>
                            CONTACT INFORMATION
                        </h2>
                        <div className="space-y-3 sm:space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                            <p>
                                If you have any questions about these Terms of Service, please contact us at:
                            </p>
                            <div className="bg-primary-green/5 dark:bg-primary-green/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary-green/20">
                                <p className="font-semibold text-gray-900 dark:text-white mb-1">GreenEx Support</p>
                                <p className="text-sm sm:text-base">Email: support@greenex.rw</p>
                                <p className="text-sm sm:text-base">Phone: +250 XXX XXX XXX</p>
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
                        href="/privacy"
                        className="text-primary-green hover:text-secondary-green font-semibold underline text-sm sm:text-base"
                    >
                        View Privacy Policy
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
