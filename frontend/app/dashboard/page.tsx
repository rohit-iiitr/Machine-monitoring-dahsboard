'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { machinesAPI } from '@/lib/api';
import { TableSkeleton } from '@/components/LoadingSkeleton';
import MachineModal from '@/components/MachineModal';
import toast from 'react-hot-toast';

interface Machine {
  _id: string;
  id?: string;
  name: string;
  status: 'Running' | 'Idle' | 'Stopped';
  temperature: number;
  energyConsumption: number;
}

export default function DashboardPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMachine, setEditingMachine] = useState<Machine | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const router = useRouter();

  const fetchMachines = async () => {
    try {
      const data = await machinesAPI.getAll();
      setMachines(data);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        toast.error('Session expired. Please login again.');
      } else {
        setError('Failed to fetch machines');
        toast.error('Failed to fetch machines');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchMachines();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchMachines, 10000);

    return () => clearInterval(interval);
  }, [router]);

  useEffect(() => {
    let filtered = machines;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((machine) =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((machine) => machine.status === statusFilter);
    }

    setFilteredMachines(filtered);
  }, [machines, searchTerm, statusFilter]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    toast.success('Logged out successfully');
  };

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/${id}`);
  };

  const handleCreate = () => {
    setEditingMachine(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (e: React.MouseEvent, machine: Machine) => {
    e.stopPropagation();
    setEditingMachine(machine);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string, name: string) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await machinesAPI.delete(id);
      toast.success('Machine deleted successfully');
      fetchMachines();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete machine');
    }
  };

  const handleSave = async (machineData: Partial<Machine>) => {
    try {
      if (modalMode === 'create') {
        await machinesAPI.create(machineData);
        toast.success('Machine created successfully');
      } else if (editingMachine) {
        await machinesAPI.update(editingMachine._id, machineData);
        toast.success('Machine updated successfully');
      }
      fetchMachines();
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save machine');
      throw err;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Running':
        return 'bg-green-100 text-green-800';
      case 'Idle':
        return 'bg-yellow-100 text-yellow-800';
      case 'Stopped':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Machine Monitoring Dashboard
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm md:text-base"
            >
              + Add Machine
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm md:text-base"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search machines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="Running">Running</option>
                <option value="Idle">Idle</option>
                <option value="Stopped">Stopped</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {filteredMachines.length === 0 && !loading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg">
              {machines.length === 0
                ? 'No machines found. Create your first machine!'
                : 'No machines match your search criteria.'}
            </p>
            {machines.length === 0 && (
              <button
                onClick={handleCreate}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Create Machine
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Machine Name
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Temperature (°C)
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Energy (kWh)
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredMachines.map((machine) => {
                    const machineId = machine._id || machine.id;
                    return (
                      <tr
                        key={machineId}
                        onClick={() => machineId&&handleRowClick(machineId)}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {machine.name}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              machine.status
                            )}`}
                          >
                            {machine.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {machine.temperature}°C
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {machine.energyConsumption} kWh
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={(e) => handleEdit(e, machine)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                            <button
                            
                              onClick={(e) => machineId&&handleDelete(e, machineId, machine.name)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Machine Count */}
        <div className="mt-4 text-sm text-gray-500">
          Showing {filteredMachines.length} of {machines.length} machine(s)
        </div>
      </div>

      {/* Machine Modal */}
      <MachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        machine={editingMachine}
        mode={modalMode}
      />
    </div>
  );
}
