"use client";

import RoleGuard from "@/components/auth/RoleGuard";
import Sidebar from "./sidebar";
import Header from "./Header";

export default function UserDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["CITIZEN"]}>
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 overflow-auto">
                    <Header />
                    {children}
                </div>
            </div>
        </RoleGuard>
    );
}
