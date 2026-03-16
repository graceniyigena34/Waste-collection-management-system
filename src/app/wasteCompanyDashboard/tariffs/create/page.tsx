'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TariffForm } from '@/components/tariffs/TariffForm';
import { RuleTable } from '@/components/tariffs/RuleTable';
import { RuleFormModal } from '@/components/tariffs/RuleFormModal';
import { ConfirmDialog } from '@/components/tariffs/ConfirmDialog';
import { toast } from 'react-toastify';
import tariffService from '@/lib/tariff-service';
import tariffRuleService from '@/lib/tariff-rule-service';
import zoneService, { Zone } from '@/lib/zone-service';
import { useEffect } from 'react';

export default function CreateTariffPage() {
  const router = useRouter();
  const [createdPlanId, setCreatedPlanId] = useState<number | null>(null);
  const [rules, setRules] = useState<any[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [editingRule, setEditingRule] = useState<any>(undefined);
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      const zonesData = await zoneService.getAll();
      setZones(zonesData);
    } catch (error) {
      toast.error('Failed to fetch zones');
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const result = await tariffService.create(data);
      setCreatedPlanId(result.id);
      toast.success('Tariff plan created! Now add rules.');
    } catch (error) {
      toast.error('Failed to create tariff plan.');
    }
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
        tariffPlanId: createdPlanId!.toString(),
        zoneId: ruleData.zone_id,
        houseType: ruleData.house_type,
        pickupFrequencyPerWeek: Number(ruleData.pickup_frequency_per_week),
        amount: Number(ruleData.amount),
      };

      console.log('Submitting rule payload:', payload);

      if (editingRule) {
        await tariffRuleService.update(editingRule.id, payload);
        toast.success('Rule updated!');
      } else {
        const result = await tariffRuleService.create(payload);
        console.log('Created rule response:', result);
        toast.success('Rule added!');
      }
      const updatedRules = await tariffRuleService.getByPlanId(createdPlanId!.toString());
      console.log('Fetched rules:', updatedRules);
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
        const updatedRules = await tariffRuleService.getByPlanId(createdPlanId!.toString());
        setRules(updatedRules);
        toast.success('Rule deleted!');
      } catch (error) {
        toast.error('Failed to delete rule.');
      }
      setDeleteRuleId(null);
    }
  };

  const handleFinish = () => {
    router.push('/wasteCompanyDashboard/tariffs');
  };

  const handleCancel = () => {
    router.push('/wasteCompanyDashboard/tariffs');
  };

  return (
    <div className="max-w-6xl mx-auto py-8 space-y-8">
      <TariffForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
      />

      {createdPlanId && (
        <>
          <RuleTable
            rules={rules}
            zones={zones as any}
            onAdd={handleAddRule}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
          />

          <div className="flex justify-end">
            <button
              onClick={handleFinish}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Finish & View Tariffs
            </button>
          </div>
        </>
      )}

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
