/**
 * Complete onboarding form data matching backend requirements
 */
export interface OnboardingFormData {
  name: string;
  sectorCoverage: string;
  remaDocument: File;
  cityOfKigaliDocument: File;
  rdbDocument: File;
}

/**
 * Backend response structure
 */
export interface OnboardingResponse {
  message: string;
  companyId?: number;
  status?: string;
}

/**
 * Service for handling company onboarding with file uploads
 */
class OnboardingService {
  /**
   * Submit complete onboarding data with all required files
   * @param data - Complete form data including all 3 required files
   * @returns Promise with backend response
   */
  async submitOnboarding(data: OnboardingFormData): Promise<OnboardingResponse> {
    // Mock onboarding submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful onboarding
    return {
      message: 'Onboarding submitted successfully! Your application is under review.',
      companyId: Date.now(),
      status: 'PENDING'
    };
  }
}

export default new OnboardingService();
