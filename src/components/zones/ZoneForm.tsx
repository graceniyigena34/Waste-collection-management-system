'use client'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Zone } from '@/data/zones';
import { rwandaAdminData, getSectorsByDistrict, getCellsBySector, getVillagesByCell, getDistrictById, District, Sector, Cell, Village } from '@/data/rwanda-admin';

const zoneSchema = z.object({
  district: z.string().min(1, 'District is required'),
  sector: z.string().min(1, 'Sector is required'),
  cell: z.string().min(1, 'Cell is required'),
  village: z.string().min(1, 'Village is required'),
  code: z.string().min(1, 'Code is required'),
  description: z.string().min(1, 'Description is required'),
});

type ZoneFormData = z.infer<typeof zoneSchema>;

interface ZoneFormProps {
  zone?: Zone;
  onSubmit: (data: ZoneFormData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function ZoneForm({ zone, onSubmit, onCancel, isEditing = false }: ZoneFormProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedCell, setSelectedCell] = useState<string>('');
  const [availableSectors, setAvailableSectors] = useState<Sector[]>([]);
  const [availableCells, setAvailableCells] = useState<Cell[]>([]);
  const [availableVillages, setAvailableVillages] = useState<Village[]>([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ZoneFormData>({
    resolver: zodResolver(zoneSchema),
    defaultValues: zone ? {
      district: zone.district,
      sector: zone.sector,
      cell: zone.cell,
      village: zone.village,
      code: zone.code,
      description: zone.description,
    } : undefined,
  });

  const watchedDistrict = watch('district');
  const watchedSector = watch('sector');
  const watchedCell = watch('cell');

  useEffect(() => {
    if (zone) {
      setSelectedDistrict(zone.district);
      setSelectedSector(zone.sector);
      setSelectedCell(zone.cell);
      setAvailableSectors(getSectorsByDistrict(zone.district));
      setAvailableCells(getCellsBySector(zone.district, zone.sector));
      setAvailableVillages(getVillagesByCell(zone.district, zone.sector, zone.cell));
    }
  }, [zone]);

  useEffect(() => {
    if (watchedDistrict) {
      const sectors = getSectorsByDistrict(watchedDistrict);
      setAvailableSectors(sectors);
      setSelectedDistrict(watchedDistrict);
      
      if (!isEditing) {
        setValue('sector', '');
        setValue('cell', '');
        setValue('village', '');
      }
      setAvailableCells([]);
      setAvailableVillages([]);
    }
  }, [watchedDistrict, setValue, isEditing]);

  useEffect(() => {
    if (watchedSector && selectedDistrict) {
      const cells = getCellsBySector(selectedDistrict, watchedSector);
      setAvailableCells(cells);
      setSelectedSector(watchedSector);
      
      if (!isEditing) {
        setValue('cell', '');
        setValue('village', '');
      }
      setAvailableVillages([]);
    }
  }, [watchedSector, selectedDistrict, setValue, isEditing]);

  useEffect(() => {
    if (watchedCell && selectedDistrict && selectedSector) {
      const villages = getVillagesByCell(selectedDistrict, selectedSector, watchedCell);
      setAvailableVillages(villages);
      setSelectedCell(watchedCell);
      
      if (!isEditing) {
        setValue('village', '');
      }
    }
  }, [watchedCell, selectedDistrict, selectedSector, setValue, isEditing]);

  const handleFormSubmit = (data: ZoneFormData) => {
    const district = getDistrictById(data.district);
    const sector = district?.sectors.find((s: Sector) => s.id === data.sector);
    const cell = sector?.cells.find((c: Cell) => c.id === data.cell);
    const village = cell?.villages.find((v: Village) => v.id === data.village);

    const enrichedData = {
      ...data,
      districtName: district?.name,
      sectorName: sector?.name,
      cellName: cell?.name,
      villageName: village?.name
    };

    onSubmit(enrichedData);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditing ? 'Edit Zone' : 'Create New Zone'}
      </h1>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">District</label>
          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.district ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select District</option>
                {rwandaAdminData.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">{errors.district.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Sector</label>
          <Controller
            name="sector"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedDistrict}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.sector ? 'border-red-500' : 'border-gray-300'
                } ${!selectedDistrict ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Sector</option>
                {availableSectors.map((sector) => (
                  <option key={sector.id} value={sector.id}>
                    {sector.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.sector && (
            <p className="text-red-500 text-sm mt-1">{errors.sector.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Cell</label>
          <Controller
            name="cell"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedSector}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.cell ? 'border-red-500' : 'border-gray-300'
                } ${!selectedSector ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Cell</option>
                {availableCells.map((cell) => (
                  <option key={cell.id} value={cell.id}>
                    {cell.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.cell && (
            <p className="text-red-500 text-sm mt-1">{errors.cell.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Village</label>
          <Controller
            name="village"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                disabled={!selectedCell}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.village ? 'border-red-500' : 'border-gray-300'
                } ${!selectedCell ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              >
                <option value="">Select Village</option>
                {availableVillages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.village && (
            <p className="text-red-500 text-sm mt-1">{errors.village.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <Input
            {...register('code')}
            placeholder="Enter code"
            className={errors.code ? 'border-red-500' : ''}
          />
          {errors.code && (
            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            {...register('description')}
            placeholder="Enter description"
            className={errors.description ? 'border-red-500' : ''}
            rows={3}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? 'Save Changes' : 'Create Zone'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}