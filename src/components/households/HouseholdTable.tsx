'use client'
import { useState } from 'react';
import { Household } from '@/data/households';
import { Zone } from '@/data/zones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ZoneSelect } from './ZoneSelect';
import { Eye, Edit, Trash2, Search, Power } from 'lucide-react';

interface HouseholdTableProps {
  households: Household[];
  zones: Zone[];
  onView: (household: Household) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export function HouseholdTable({ households, zones, onView, onEdit, onDelete, onToggleStatus }: HouseholdTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('');

  const filteredHouseholds = households.filter(household => {
    const matchesSearch = 
      (household.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (household.address || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesZone = selectedZone === '' || household.zone_id === selectedZone;
    
    return matchesSearch && matchesZone;
  });

  const getZoneDisplay = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? `${zone.sectorName || zone.sector} - ${zone.cellName || zone.cell}` : 'Unknown Zone';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by code or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <ZoneSelect
          zones={zones}
          value={selectedZone}
          onChange={setSelectedZone}
          placeholder="Filter by zone"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">Code</th>
              <th className="text-left py-3 px-4 font-medium">Address</th>
              <th className="text-left py-3 px-4 font-medium">Zone</th>
              <th className="text-left py-3 px-4 font-medium">House Type</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredHouseholds.map((household) => (
              <tr key={household.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 font-medium">{household.code}</td>
                <td className="py-3 px-4 max-w-xs truncate">{household.address}</td>
                <td className="py-3 px-4">{getZoneDisplay(household.zone_id)}</td>
                <td className="py-3 px-4 capitalize">
                  {household.houseType === 'other' && household.otherHouseType 
                    ? household.otherHouseType 
                    : household.houseType}
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    household.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {household.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onView(household)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEdit(household.id)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleStatus(household.id)}
                      className={household.status === 'active' ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                      title={household.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDelete(household.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredHouseholds.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No households found matching your criteria.
        </div>
      )}
    </div>
  );
}