// RoleGuard.tsx – Simple role‑based access component

import React, { ReactNode, useEffect, useState } from "react";
import { UserManagementService } from "../../services/api";

interface RoleGuardProps {
    /** Roles that are allowed to view the children (e.g. ['ADMIN', 'ORDER_PROCESSOR']) */
    allowedRoles: string[];
    /** Optional fallback UI when access is denied */
    fallback?: ReactNode;
    children: ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, fallback = null, children }) => {
    const [hasAccess, setHasAccess] = useState<boolean>(false);

    useEffect(() => {
        // Fetch current user permissions once on mount
        const fetchPermissions = async () => {
            try {
                const data = await UserManagementService.getUserPermissions();
                // data.role is the enum value like "ADMIN"
                setHasAccess(allowedRoles.includes(data.role));
            } catch (e) {
                console.error("RoleGuard: failed to load permissions", e);
                setHasAccess(false);
            }
        };
        fetchPermissions();
    }, [allowedRoles]);

    return <>{hasAccess ? children : fallback}</>;
};
