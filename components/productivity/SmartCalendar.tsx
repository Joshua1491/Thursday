import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { ClockIcon, BellIcon } from '@heroicons/react/24/outline';

type Reminder = {
  id: string;
  title: string;
  date: string;
  time: string;
  priority: 'low' | 'medium' | 'high';
};

type FocusBlock = {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
};

type AutoSlotResponse = {
  focusBlocks: FocusBlock[];
};

async function fetchReminders(): Promise<Reminder[]> {
  const response = await fetch('/api/reminders');
  if (!response.ok) {
    throw new Error('Failed to fetch reminders');
  }
  return response.json();
}

async function fetchAutoSlots(date: Date): Promise<AutoSlotResponse> {
  const response = await fetch('/api/calendar/auto-slots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ date: date.toISOString() }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch auto slots');
  }

  return response.json();
}

export function SmartCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { data: reminders, isLoading: isLoadingReminders } = useQuery({
    queryKey: ['reminders'],
    queryFn: fetchReminders,
  });

  const { data: autoSlots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['autoSlots', selectedDate],
    queryFn: () => fetchAutoSlots(selectedDate),
  });

  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getPriorityColor = (priority: Reminder['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            className="w-full border-0"
            tileClassName={({ date }) => {
              const hasReminders = reminders?.some(
                (reminder) => new Date(reminder.date).toDateString() === date.toDateString()
              );
              return hasReminders ? 'bg-blue-50' : '';
            }}
          />
        </div>

        {/* Reminders Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Reminders</h2>
          {isLoadingReminders ? (
            <div className="text-center py-4">Loading reminders...</div>
          ) : reminders?.length ? (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200"
                >
                  <BellIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{reminder.title}</h3>
                      <span className={`text-sm ${getPriorityColor(reminder.priority)}`}>
                        {reminder.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {new Date(reminder.date).toLocaleDateString()} at {reminder.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No reminders for this period</div>
          )}
        </div>
      </div>

      {/* Focus Blocks Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Focus Blocks</h2>
        {isLoadingSlots ? (
          <div className="text-center py-4">Loading focus blocks...</div>
        ) : autoSlots?.focusBlocks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {autoSlots.focusBlocks.map((block) => (
              <div
                key={block.id}
                className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200"
              >
                <ClockIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">
                    {formatTime(block.startTime)} - {formatTime(block.endTime)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(block.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No focus blocks available for this date
          </div>
        )}
      </div>
    </div>
  );
} 