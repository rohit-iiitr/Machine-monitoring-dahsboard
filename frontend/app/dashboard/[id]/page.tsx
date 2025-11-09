'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { machinesAPI } from '@/lib/api';
import { CardSkeleton } from '@/components/LoadingSkeleton';
import MachineModal from '@/components/MachineModal';
import toast from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface Machine {
  _id: string;
  id?: string;
  name: string;
  status: 'Running' | 'Idle' | 'Stopped';
  temperature: number;
  energyConsumption: number;
}

interface TemperatureData {
  time: string;
  temperature: number;
}

export default function MachineDetailsPage() {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [temperatureHistory, setTemperatureHistory] = useState<TemperatureData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const fetchMachineDetails = async () => {
    try {
      const data = await machinesAPI.getById(id);
      setMachine(data);

      // Generate temperature history for the chart (last 10 readings)
      const history: TemperatureData[] = [];
      const now = new Date();
      for (let i = 9; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
        history.push({
          time: time.toLocaleTimeString(),
          temperature: data.temperature + Math.random() * 10 - 5, // Simulate variation
        });
      }
      setTemperatureHistory(history);
      setError('');
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        toast.error('Session expired. Please login again.');
      } else {
        setError('Failed to fetch machine details');
        toast.error('Failed to fetch machine details');
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

    fetchMachineDetails();

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchMachineDetails, 10000);

    return () => clearInterval(interval);
  }, [id, router]);

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

  const handleSave = async (machineData: Partial<Machine>) => {
    try {
      if (machine) {
        await machinesAPI.update(machine._id, machineData);
        toast.success('Machine updated successfully');
        fetchMachineDetails();
        setIsModalOpen(false);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update machine');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Machine not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-800 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {machine.name} - Details
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Edit Machine
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Machine Information</h2>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Machine ID:</span>
                <p className="text-lg text-gray-900">{machine._id || machine.id}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Name:</span>
                <p className="text-lg text-gray-900">{machine.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Status:</span>
                <p className="mt-1">
                  <span
                    className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(
                      machine.status
                    )}`}
                  >
                    {machine.status}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Temperature:</span>
                <p className="text-lg text-gray-900">{machine.temperature}°C</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Energy Consumption:</span>
                <p className="text-lg text-gray-900">{machine.energyConsumption} kWh</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Temperature Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={temperatureHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#4f46e5"
                  strokeWidth={2}
                  name="Temperature (°C)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Edit Machine Modal */}
      <MachineModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        machine={machine}
        mode="edit"
      />
    </div>
  );
}

