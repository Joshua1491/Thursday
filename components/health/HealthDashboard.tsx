import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  HeartIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

type HealthMetrics = {
  stepCount: number;
  sleepHours: number;
  heartRate: number;
};

type Reminder = {
  id: string;
  title: string;
  time: string;
  isEnabled: boolean;
};

async function fetchHealthMetrics(): Promise<HealthMetrics> {
  const response = await fetch('/api/health/metrics');
  if (!response.ok) {
    throw new Error('Failed to fetch health metrics');
  }
  return response.json();
}

// Mock reminders data
const mockReminders: Reminder[] = [
  { id: '1', title: 'Take Medication', time: '08:00 AM', isEnabled: true },
  { id: '2', title: 'Drink Water', time: 'Every 2 hours', isEnabled: true },
  { id: '3', title: 'Exercise', time: '05:00 PM', isEnabled: false },
];

export function HealthDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['healthMetrics'],
    queryFn: fetchHealthMetrics,
  });

  const handleReminderToggle = (reminderId: string) => {
    // TODO: Implement local notification scheduling
    console.log('Toggle reminder:', reminderId);
  };

  return (
    <div className="space-y-6">
      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Steps Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Steps Today</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : metrics?.stepCount.toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <ArrowTrendingUpIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${Math.min((metrics?.stepCount || 0) / 10000 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Goal: 10,000 steps</p>
          </div>
        </div>

        {/* Sleep Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sleep Hours</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : metrics?.sleepHours}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <ClockIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full" 
                style={{ width: `${Math.min((metrics?.sleepHours || 0) / 8 * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">Goal: 8 hours</p>
          </div>
        </div>

        {/* Heart Rate Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heart Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : metrics?.heartRate}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-full">
              <HeartIcon className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xs text-gray-500">BPM (Resting)</p>
          </div>
        </div>
      </div>

      {/* Reminders Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Health Reminders</h3>
          <button
            onClick={() => console.log('Add new reminder')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Reminder
          </button>
        </div>
        <div className="space-y-4">
          {mockReminders.map((reminder) => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <BellIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">{reminder.title}</p>
                  <p className="text-sm text-gray-500">{reminder.time}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={reminder.isEnabled}
                  onChange={() => handleReminderToggle(reminder.id)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 