// userManagement.ts – lightweight wrapper for nxtbn‑style user API

import { apiClient } from "./api";
import { API_ENDPOINTS } from "./api"; // ensure USERS endpoints are exported

/**
 * Service providing the nxtbn‑style user management API.
 * Keeps the main api.ts file clean by isolating user‑specific calls.
 */
export class UserManagementService {
    /** Get current user's profile */
    static async getUserProfile() {
        const response = await apiClient.get<any>(API_ENDPOINTS.USERS.PROFILE);
        return response.data;
    }

    /** Update current user's profile */
    static async updateUserProfile(data: any) {
        const response = await apiClient.patch<any>(API_ENDPOINTS.USERS.PROFILE, data);
        return response.data;
    }

    /** Get current user's statistics */
    static async getUserStats() {
        const response = await apiClient.get<any>(API_ENDPOINTS.USERS.STATS);
        return response.data;
    }

    /** Get current user's permissions */
    static async getUserPermissions() {
        const response = await apiClient.get<any>(API_ENDPOINTS.USERS.PERMISSIONS);
        return response.data;
    }

    /** Admin: list users */
    static async getUsers(params?: any) {
        const response = await apiClient.get<any>(API_ENDPOINTS.USERS.LIST, params);
        return { count: response.count, data: response.data };
    }

    /** Admin: get a single user */
    static async getUser(id: number) {
        const response = await apiClient.get<any>(API_ENDPOINTS.USERS.DETAIL(id));
        return response.data;
    }

    /** Admin: update a user */
    static async updateUser(id: number, data: any) {
        const response = await apiClient.patch<any>(API_ENDPOINTS.USERS.DETAIL(id), data);
        return response.data;
    }

    /** Admin: delete a user */
    static async deleteUser(id: number) {
        return apiClient.delete<any>(API_ENDPOINTS.USERS.DETAIL(id));
    }

    /** Admin: change user role */
    static async updateUserRole(userId: number, role: string) {
        const response = await apiClient.patch<any>(API_ENDPOINTS.USERS.UPDATE_ROLE(userId), { role });
        return response.data;
    }
}
