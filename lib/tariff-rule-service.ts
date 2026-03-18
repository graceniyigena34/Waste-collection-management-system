import { apiRequest } from './api-services';

export interface TariffRule {
  id: string;
  name: string;
  description: string;
  amount: number;
  unit: 'kg' | 'household' | 'month' | 'fixed';
  conditions?: {
    minWeight?: number;
    maxWeight?: number;
    householdType?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTariffRuleData {
  name: string;
  description: string;
  amount: number;
  unit: TariffRule['unit'];
  conditions?: TariffRule['conditions'];
}

class TariffRuleService {
  async getTariffRules(): Promise<TariffRule[]> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/tariff-rules');

      // Mock data for now
      return [
        {
          id: '1',
          name: 'Standard Household Rate',
          description: 'Monthly rate for standard households',
          amount: 5000,
          unit: 'household',
          conditions: { householdType: 'standard' },
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Commercial Rate',
          description: 'Monthly rate for commercial properties',
          amount: 15000,
          unit: 'household',
          conditions: { householdType: 'commercial' },
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        {
          id: '3',
          name: 'Weight-based Rate',
          description: 'Rate per kilogram of waste',
          amount: 200,
          unit: 'kg',
          conditions: { minWeight: 0, maxWeight: 100 },
          isActive: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error fetching tariff rules:', error);
      throw error;
    }
  }

  async getTariffRuleById(id: string): Promise<TariffRule | null> {
    try {
      const rules = await this.getTariffRules();
      return rules.find(rule => rule.id === id) || null;
    } catch (error) {
      console.error('Error fetching tariff rule:', error);
      throw error;
    }
  }

  async createTariffRule(ruleData: CreateTariffRuleData): Promise<TariffRule> {
    try {
      // In a real app, this would call the API
      // return await apiRequest('/tariff-rules', 'POST', ruleData);

      const newRule: TariffRule = {
        ...ruleData,
        id: Date.now().toString(),
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      return newRule;
    } catch (error) {
      console.error('Error creating tariff rule:', error);
      throw error;
    }
  }

  async updateTariffRule(id: string, updates: Partial<TariffRule>): Promise<TariffRule> {
    try {
      // In a real app, this would call the API
      // return await apiRequest(`/tariff-rules/${id}`, 'PATCH', updates);

      const rule = await this.getTariffRuleById(id);
      if (!rule) throw new Error('Tariff rule not found');

      const updatedRule: TariffRule = {
        ...rule,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return updatedRule;
    } catch (error) {
      console.error('Error updating tariff rule:', error);
      throw error;
    }
  }

  async deleteTariffRule(id: string): Promise<void> {
    try {
      // In a real app, this would call the API
      // await apiRequest(`/tariff-rules/${id}`, 'DELETE');
      console.log(`Deleted tariff rule ${id}`);
    } catch (error) {
      console.error('Error deleting tariff rule:', error);
      throw error;
    }
  }

  async toggleTariffRuleStatus(id: string): Promise<void> {
    try {
      const rule = await this.getTariffRuleById(id);
      if (!rule) throw new Error('Tariff rule not found');

      await this.updateTariffRule(id, { isActive: !rule.isActive });
    } catch (error) {
      console.error('Error toggling tariff rule status:', error);
      throw error;
    }
  }
}

const tariffRuleService = new TariffRuleService();
export default tariffRuleService;