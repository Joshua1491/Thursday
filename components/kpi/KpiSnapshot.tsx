import React, { useState } from 'react';
import { useAlerts } from '../../services/alerts';
import type { DashboardSummary } from '../../services/alerts';
import { AskGptModal } from '../gpt/AskGptModal';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

export function KpiSnapshot() {
  const { data, isLoading, error } = useAlerts();
  const [isGptModalOpen, setIsGptModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 animate-pulse h-32 rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading dashboard metrics
      </div>
    );
  }

  if (!data) return null;

  const summary = data as DashboardSummary;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setIsGptModalOpen(true)}
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          Ask GPT
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Sales Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-semibold mt-2">{formatCurrency(summary.sales.total)}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${summary.sales.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.sales.growth >= 0 ? '↑' : '↓'} {Math.abs(summary.sales.growth)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Returns Rate Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Returns Rate</h3>
          <p className="text-2xl font-semibold mt-2">{formatPercentage(summary.returnsRate.value)}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${
              summary.returnsRate.trend === 'down' ? 'text-green-600' : 
              summary.returnsRate.trend === 'up' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {summary.returnsRate.trend === 'down' ? '↓' : 
               summary.returnsRate.trend === 'up' ? '↑' : '→'} 
              {summary.returnsRate.trend === 'stable' ? ' Stable' : ' Trending'}
            </span>
          </div>
        </div>

        {/* Inventory Value Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Inventory Value</h3>
          <p className="text-2xl font-semibold mt-2">{formatCurrency(summary.inventoryValue.total)}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${summary.inventoryValue.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.inventoryValue.change >= 0 ? '↑' : '↓'} {Math.abs(summary.inventoryValue.change)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last month</span>
          </div>
        </div>

        {/* Cash Flow Card */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Cash Flow</h3>
          <p className="text-2xl font-semibold mt-2">{formatCurrency(summary.cashFlow.current)}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm ${
              summary.cashFlow.current >= summary.cashFlow.previous ? 'text-green-600' : 'text-red-600'
            }`}>
              {summary.cashFlow.current >= summary.cashFlow.previous ? '↑' : '↓'} 
              {formatPercentage(
                ((summary.cashFlow.current - summary.cashFlow.previous) / summary.cashFlow.previous) * 100
              )}
            </span>
            <span className="text-sm text-gray-500 ml-2">vs previous</span>
          </div>
        </div>
      </div>

      <AskGptModal
        isOpen={isGptModalOpen}
        onClose={() => setIsGptModalOpen(false)}
        dashboardData={summary}
        userId="current-user" // TODO: Replace with actual user ID from auth context
      />
    </div>
  );
} 