import { mockAuthService } from './mock-auth';

export interface RegisterData {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    userType: string;
}

export interface RegisterResponse {
    message: string;
    user?: any;
    token?: string;
}

export const authService = mockAuthService;
