import { TariffPlan, TariffRule, dummyTariffPlans, dummyTariffRules } from '@/data/tariffs';

class TariffStore {
  private plans: TariffPlan[] = [...dummyTariffPlans];
  private rules: TariffRule[] = [...dummyTariffRules];

  // Tariff Plans
  getPlans(): TariffPlan[] {
    return [...this.plans];
  }

  getPlan(id: string): TariffPlan | undefined {
    return this.plans.find(plan => plan.id === id);
  }

  createPlan(plan: Omit<TariffPlan, 'id'>): TariffPlan {
    const newPlan: TariffPlan = {
      ...plan,
      id: Date.now().toString(),
    };
    this.plans.push(newPlan);
    return newPlan;
  }

  updatePlan(id: string, updates: Partial<TariffPlan>): TariffPlan | null {
    const index = this.plans.findIndex(plan => plan.id === id);
    if (index === -1) return null;
    
    this.plans[index] = { ...this.plans[index], ...updates };
    return this.plans[index];
  }

  deletePlan(id: string): boolean {
    const index = this.plans.findIndex(plan => plan.id === id);
    if (index === -1) return false;
    
    this.plans.splice(index, 1);
    // Also delete associated rules
    this.rules = this.rules.filter(rule => rule.tariff_plan_id !== id);
    return true;
  }

  // Tariff Rules
  getRules(): TariffRule[] {
    return [...this.rules];
  }

  getRulesForPlan(planId: string): TariffRule[] {
    return this.rules.filter(rule => rule.tariff_plan_id === planId);
  }

  getRule(id: string): TariffRule | undefined {
    return this.rules.find(rule => rule.id === id);
  }

  createRule(rule: Omit<TariffRule, 'id'>): TariffRule {
    const newRule: TariffRule = {
      ...rule,
      id: Date.now().toString(),
    };
    this.rules.push(newRule);
    return newRule;
  }

  updateRule(id: string, updates: Partial<TariffRule>): TariffRule | null {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index === -1) return null;
    
    this.rules[index] = { ...this.rules[index], ...updates };
    return this.rules[index];
  }

  deleteRule(id: string): boolean {
    const index = this.rules.findIndex(rule => rule.id === id);
    if (index === -1) return false;
    
    this.rules.splice(index, 1);
    return true;
  }

  getRuleCount(planId: string): number {
    return this.rules.filter(rule => rule.tariff_plan_id === planId).length;
  }
}

export const tariffStore = new TariffStore();