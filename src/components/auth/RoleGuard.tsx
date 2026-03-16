"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for authentication
        const token = localStorage.getItem("auth_token");
        const userInfoStr = localStorage.getItem("user_info");

        if (!token || !userInfoStr || token === "undefined" || token === "null" || userInfoStr === "undefined" || userInfoStr === "null") {
            console.log("No valid token or user info found, redirecting to signin");
            // Clear potential garbage
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");
            router.push("/signin");
            return;
        }

        try {
            const userInfo = JSON.parse(userInfoStr);
            const userRole = userInfo.role;

            if (allowedRoles.includes(userRole)) {
                setAuthorized(true);
            } else {
                console.log(`User role ${userRole} not authorized for this route. Allowed: ${allowedRoles}`);
                // Redirect to appropriate dashboard based on actual role or home
                if (userRole === "ADMIN") router.push("/Supper-dashboard");
                else if (userRole === "COMPANY_MANAGER") router.push("/wasteCompanyDashboard");
                else if (userRole === "CITIZEN") router.push("/User-Dashboard");
                else router.push("/");
            }
        } catch (error) {
            console.error("Error parsing user info:", error);
            localStorage.removeItem("auth_token");
            localStorage.removeItem("user_info");
            router.push("/signin");
        } finally {
            setLoading(false);
        }
    }, [router, allowedRoles]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return authorized ? <>{children}</> : null;
}
