"use client";

import RoleGuard from "@/components/auth/RoleGuard";

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={["ADMIN"]}>
            {children}
        </RoleGuard>
    );
}
