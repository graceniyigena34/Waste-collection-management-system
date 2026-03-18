'use client'
import { useState } from 'react';
import { Zone, getZoneDisplayInfo } from '@/data/zones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit, Trash2, Search } from 'lucide-react';

interface ZoneTableProps {
  zones: Zone[];
  onView: (zone: Zone) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ZoneTable({ zones, onView, onEdit, onDelete }: ZoneTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredZones = zones.filter(zone => {
    const displayInfo = getZoneDisplayInfo(zone);
    return (displayInfo.district || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (displayInfo.sector || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (displayInfo.cell || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (displayInfo.village || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zone.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (zone.description || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search zones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium">District</th>
              <th className="text-left py-3 px-4 font-medium">Sector</th>
              <th className="text-left py-3 px-4 font-medium">Cell</th>
              <th className="text-left py-3 px-4 font-medium">Village</th>
              <th className="text-left py-3 px-4 font-medium">Code</th>
              <th className="text-left py-3 px-4 font-medium">Description</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone) => {
              const displayInfo = getZoneDisplayInfo(zone);
              return (
                <tr key={zone.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{displayInfo.district}</td>
                  <td className="py-3 px-4">{displayInfo.sector}</td>
                  <td className="py-3 px-4">{displayInfo.cell}</td>
                  <td className="py-3 px-4">{displayInfo.village}</td>
                  <td className="py-3 px-4">{zone.code}</td>
                  <td className="py-3 px-4 max-w-xs truncate">{zone.description}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onView(zone)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(zone.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(zone.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredZones.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No zones found matching your search.
        </div>
      )}
    </div>
  );
}