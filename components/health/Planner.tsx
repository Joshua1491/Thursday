import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type Preferences = {
  dietaryPreference: string;
  workoutIntensity: string;
};

type DailyPlan = {
  day: string;
  meals: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  exercise: {
    type: string;
    duration: string;
    intensity: string;
  };
};

type WeeklyPlan = DailyPlan[];

async function fetchWeeklyPlan(preferences: Preferences): Promise<WeeklyPlan> {
  const response = await fetch('/api/health/plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch weekly plan');
  }

  return response.json();
}

const dietaryPreferences = [
  { value: 'balanced', label: 'Balanced' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'paleo', label: 'Paleo' },
];

const workoutIntensities = [
  { value: 'light', label: 'Light' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'intense', label: 'Intense' },
];

export function MealExercisePlanner() {
  const [preferences, setPreferences] = useState<Preferences>({
    dietaryPreference: 'balanced',
    workoutIntensity: 'moderate',
  });

  const { data: weeklyPlan, isLoading } = useQuery({
    queryKey: ['weeklyPlan', preferences],
    queryFn: () => fetchWeeklyPlan(preferences),
  });

  const handlePreferenceChange = (key: keyof Preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Preferences Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="dietaryPreference" className="block text-sm font-medium text-gray-700 mb-1">
            Dietary Preference
          </label>
          <select
            id="dietaryPreference"
            value={preferences.dietaryPreference}
            onChange={(e) => handlePreferenceChange('dietaryPreference', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {dietaryPreferences.map((pref) => (
              <option key={pref.value} value={pref.value}>
                {pref.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="workoutIntensity" className="block text-sm font-medium text-gray-700 mb-1">
            Workout Intensity
          </label>
          <select
            id="workoutIntensity"
            value={preferences.workoutIntensity}
            onChange={(e) => handlePreferenceChange('workoutIntensity', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {workoutIntensities.map((intensity) => (
              <option key={intensity.value} value={intensity.value}>
                {intensity.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Weekly Plan Table */}
      {isLoading ? (
        <div className="text-center py-4">Loading weekly plan...</div>
      ) : weeklyPlan ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Breakfast
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lunch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dinner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exercise
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {weeklyPlan.map((day, index) => (
                <tr key={day.day} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {day.day}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.meals.breakfast}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.meals.lunch}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {day.meals.dinner}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>
                      <p className="font-medium">{day.exercise.type}</p>
                      <p className="text-xs text-gray-400">
                        {day.exercise.duration} • {day.exercise.intensity}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Select preferences to generate your weekly plan
        </div>
      )}
    </div>
  );
} 