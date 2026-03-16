'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { TariffForm } from '@/components/tariffs/TariffForm';
import { RuleTable } from '@/components/tariffs/RuleTable';
import { RuleFormModal } from '@/components/tariffs/RuleFormModal';
import { ConfirmDialog } from '@/components/tariffs/ConfirmDialog';
import { toast } from 'react-toastify';
import tariffService, { Tariff } from '@/lib/tariff-service';
import tariffRuleService from '@/lib/tariff-rule-service';
import zoneService, { Zone } from '@/lib/zone-service';

export default function EditTariffPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [plan, setPlan] = useState<Tariff | null>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(undefined);
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [planId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [planData, rulesData, zonesData] = await Promise.all([
        tariffService.getById(Number(planId)),
        tariffRuleService.getByPlanId(planId),
        zoneService.getAll()
      ]);
      setPlan(planData);
      setRules(rulesData);
      setZones(zonesData);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSubmit = async (data: any) => {
    try {
      await tariffService.update(Number(planId), data);
      toast.success('Tariff plan updated!');
      await fetchData();
    } catch (error) {
      toast.error('Failed to update tariff plan.');
    }
  };

  const handleCancel = () => {
    router.push('/wasteCompanyDashboard/tariffs');
  };

  const handleAddRule = () => {
    setEditingRule(undefined);
    setShowRuleModal(true);
  };

  const handleEditRule = (rule: any) => {
    setEditingRule(rule);
    setShowRuleModal(true);
  };

  const handleRuleSubmit = async (ruleData: any) => {
    try {
      const payload = {
        tariffPlanId: planId,
        zoneId: ruleData.zone_id,
        houseType: ruleData.house_type,
        pickupFrequencyPerWeek: Number(ruleData.pickup_frequency_per_week),
        amount: Number(ruleData.amount),
      };

      if (editingRule) {
        await tariffRuleService.update(editingRule.id, payload);
        toast.success('Rule updated!');
      } else {
        await tariffRuleService.create(payload);
        toast.success('Rule added!');
      }
      const updatedRules = await tariffRuleService.getByPlanId(planId);
      setRules(updatedRules);
    } catch (error) {
      console.error('Save rule error:', error);
      toast.error('Failed to save rule.');
    }
  };

  const handleDeleteRule = (id: string) => {
    setDeleteRuleId(id);
  };

  const confirmDeleteRule = async () => {
    if (deleteRuleId) {
      try {
        await tariffRuleService.delete(deleteRuleId);
        const updatedRules = await tariffRuleService.getByPlanId(planId);
        setRules(updatedRules);
        toast.success('Rule deleted!');
      } catch (error) {
        toast.error('Failed to delete rule.');
      }
      setDeleteRuleId(null);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!plan) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Tariff Plan Not Found</h1>
          <button
            onClick={() => router.push('/wasteCompanyDashboard/tariffs')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Tariff Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-8">
      <TariffForm
        plan={plan as any}
        onSubmit={handlePlanSubmit}
        onCancel={handleCancel}
        isEditing={true}
      />

      <RuleTable
        rules={rules}
        zones={zones as any}
        onAdd={handleAddRule}
        onEdit={handleEditRule}
        onDelete={handleDeleteRule}
      />

      <RuleFormModal
        open={showRuleModal}
        onOpenChange={setShowRuleModal}
        rule={editingRule}
        zones={zones as any}
        onSubmit={handleRuleSubmit}
      />

      <ConfirmDialog
        open={!!deleteRuleId}
        onOpenChange={() => setDeleteRuleId(null)}
        title="Confirm Delete"
        message="Are you sure you want to delete this rule?"
        onConfirm={confirmDeleteRule}
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  );
}
