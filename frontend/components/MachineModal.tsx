'use client';

import { useState, useEffect } from 'react';

interface Machine {
  _id?: string;
  name: string;
  status: 'Running' | 'Idle' | 'Stopped';
  temperature: number;
  energyConsumption: number;
}

interface MachineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (machine: Partial<Machine>) => Promise<void>;
  machine?: Machine | null;
  mode: 'create' | 'edit';
}

export default function MachineModal({
  isOpen,
  onClose,
  onSave,
  machine,
  mode,
}: MachineModalProps) {
  const [formData, setFormData] = useState<Partial<Machine>>({
    name: '',
    status: 'Idle',
    temperature: 0,
    energyConsumption: 0,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (machine && mode === 'edit') {
      setFormData({
        name: machine.name,
        status: machine.status,
        temperature: machine.temperature,
        energyConsumption: machine.energyConsumption,
      });
    } else {
      setFormData({
        name: '',
        status: 'Idle',
        temperature: 0,
        energyConsumption: 0,
      });
    }
    setErrors({});
  }, [machine, mode, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.trim() === '') {
      newErrors.name = 'Machine name is required';
    }

    if (formData.temperature === undefined || formData.temperature < 0) {
      newErrors.temperature = 'Temperature must be a positive number';
    }

    if (
      formData.energyConsumption === undefined ||
      formData.energyConsumption < 0
    ) {
      newErrors.energyConsumption = 'Energy consumption must be a positive number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving machine:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {mode === 'create' ? 'Create New Machine' : 'Edit Machine'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Machine Name *
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className={`w-full px-4 py-2 border text-black rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter machine name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.target.value as 'Running' | 'Idle' | 'Stopped',
                  })
                }
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Running">Running</option>
                <option value="Idle">Idle</option>
                <option value="Stopped">Stopped</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="temperature"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Temperature (°C) *
              </label>
              <input
                id="temperature"
                type="number"
                value={formData.temperature}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    temperature: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-4 py-2 border text-black rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.temperature ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.temperature && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.temperature}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="energyConsumption"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Energy Consumption (kWh) *
              </label>
              <input
                id="energyConsumption"
                type="number"
                value={formData.energyConsumption}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    energyConsumption: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-full px-4 py-2 border text-black rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                  errors.energyConsumption ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0"
                min="0"
                step="0.1"
              />
              {errors.energyConsumption && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.energyConsumption}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

