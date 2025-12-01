export enum UserRole {
    CUSTOMER = 'customer',
    ADMIN = 'admin',
    STAFF = 'staff',
    MANAGER = 'manager',
}

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    phone: string;
    company?: string;
    role: UserRole;
    role_display: string;
    avatar?: string;
    is_store_admin: boolean;
    is_store_staff: boolean;
    is_staff: boolean;
    is_active: boolean;
    email_verified: boolean;
    date_joined: string;
    updated_at: string;
    total_orders: number;
    pending_orders: number;
    cancelled_orders: number;
    completed_orders: number;
}

export interface UserStats {
    total_orders: number;
    pending_orders: number;
    cancelled_orders: number;
    completed_orders: number;
    total_spent: number;
    discount_percentage: number;
    addresses_count: number;
}

export interface UserPermissions {
    role: UserRole;
    role_display: string;
    is_superuser: boolean;
    is_store_admin: boolean;
    is_store_staff: boolean;
    permissions: string[];
}
