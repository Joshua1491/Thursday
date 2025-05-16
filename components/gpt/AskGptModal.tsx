import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import type { DashboardSummary } from '../../services/alerts';

type AskGptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  dashboardData: DashboardSummary;
  userId: string;
};

export function AskGptModal({ isOpen, onClose, dashboardData, userId }: AskGptModalProps) {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      const response = await fetch('/api/context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          context: {
            userId,
            dashboardData,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No reader available');

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        setResponse(prev => prev + text);
      }
    } catch (error) {
      console.error('Error:', error);
      setResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-xl shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Ask GPT Assistant
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ask anything about your dashboard data..."
                className="w-full h-32 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Submit'}
              </button>
            </div>
          </form>

          {response && (
            <div className="p-4 border-t">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Response:</h3>
              <div className="prose max-w-none">
                {response.split('\n').map((line, i) => (
                  <p key={i} className="text-gray-700">{line}</p>
                ))}
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 