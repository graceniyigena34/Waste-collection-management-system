'use client'
import { Zone } from '@/data/tariffs';

interface ZoneSelectProps {
  zones: Zone[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ZoneSelect({ zones, value, onChange, placeholder = "Select a zone", className = "" }: ZoneSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${className}`}
    >
      <option value="">{placeholder}</option>
      {zones.map((zone) => (
        <option key={zone.id} value={zone.id}>
          {zone.sector} - {zone.cell} ({zone.code})
        </option>
      ))}
    </select>
  );
}