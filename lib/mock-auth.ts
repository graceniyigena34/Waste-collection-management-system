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

export const mockAuthService = {
    register: async (data: RegisterData): Promise<RegisterResponse> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockUser = {
            id: Date.now(),
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            userType: data.userType,
            verified: true
        };
        
        const mockToken = `mock_token_${Date.now()}`;
        localStorage.setItem('auth_token', mockToken);
        localStorage.setItem('user_info', JSON.stringify(mockUser));
        
        return {
            message: 'Registration successful',
            user: mockUser,
            token: mockToken
        };
    },

    login: async (email: string, password: string): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (email && password) {
            let role = 'CITIZEN';
            let status = 'APPROVED';
            
            if (email.includes('admin')) {
                role = 'ADMIN';
            } else if (email.includes('company') || email.includes('manager')) {
                role = 'COMPANY_MANAGER';
                status = 'APPROVED';
            } else if (email.includes('driver')) {
                role = 'COMPANY_DRIVER';
            }
            
            const mockUser = {
                userId: Date.now(),
                fullName: 'Mock User',
                email: email,
                phone: '+250123456789',
                role: role,
                status: status,
                registrationStatus: status,
                verified: true
            };
            
            const mockToken = `mock_token_${Date.now()}`;
            localStorage.setItem('auth_token', mockToken);
            localStorage.setItem('user_info', JSON.stringify(mockUser));
            
            return {
                message: 'Login successful',
                userId: mockUser.userId,
                email: mockUser.email,
                fullName: mockUser.fullName,
                role: role,
                status: status,
                registrationStatus: status,
                user: mockUser,
                token: mockToken
            };
        }
        
        throw new Error('Invalid email or password');
    },

    verifyOtp: async (otp: string): Promise<any> => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (otp) {
            return {
                message: 'OTP verified successfully',
                verified: true
            };
        }
        
        throw new Error('Invalid OTP');
    }
};