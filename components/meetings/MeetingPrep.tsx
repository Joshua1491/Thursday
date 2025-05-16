import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

type MeetingSummary = {
  id: string;
  date: string;
  summary: string;
  outstandingItems: {
    id: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
  }[];
};

type AgendaResponse = {
  agenda: string;
};

async function fetchLastMeeting(): Promise<MeetingSummary> {
  const response = await fetch('/api/meetings/last');
  if (!response.ok) {
    throw new Error('Failed to fetch last meeting');
  }
  return response.json();
}

async function generateAgenda(): Promise<AgendaResponse> {
  const response = await fetch('/api/meetings/agenda', {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Failed to generate agenda');
  }
  return response.json();
}

export function MeetingPrep() {
  const [copied, setCopied] = useState(false);

  const { data: meeting, isLoading, error } = useQuery({
    queryKey: ['lastMeeting'],
    queryFn: fetchLastMeeting,
  });

  const { mutate: generateAgendaMutation, data: agendaData, isLoading: isGenerating } = useMutation({
    mutationFn: generateAgenda,
  });

  const handleCopyAgenda = () => {
    if (agendaData?.agenda) {
      navigator.clipboard.writeText(agendaData.agenda);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg">
        Error loading meeting data
      </div>
    );
  }

  if (!meeting) return null;

  return (
    <div className="space-y-6">
      {/* Last Meeting Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Last Meeting Summary</h3>
        <p className="text-gray-600 mb-4">{meeting.summary}</p>
        
        <h4 className="font-medium mb-2">Outstanding Items:</h4>
        <ul className="space-y-2">
          {meeting.outstandingItems.map(item => (
            <li key={item.id} className="flex items-start space-x-2">
              <span className={`w-2 h-2 mt-2 rounded-full ${
                item.status === 'completed' ? 'bg-green-500' :
                item.status === 'in-progress' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}></span>
              <span className="text-gray-700">{item.description}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Agenda Generation */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Meeting Agenda</h3>
          <button
            onClick={() => generateAgendaMutation()}
            disabled={isGenerating}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isGenerating ? 'Generating...' : 'Generate Agenda'}
          </button>
        </div>

        {agendaData?.agenda && (
          <div className="relative">
            <textarea
              value={agendaData.agenda}
              readOnly
              className="w-full h-64 p-4 border rounded-lg font-mono text-sm"
            />
            <button
              onClick={handleCopyAgenda}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700"
              title="Copy to clipboard"
            >
              <ClipboardDocumentIcon className="w-5 h-5" />
            </button>
            {copied && (
              <div className="absolute top-2 right-12 bg-gray-800 text-white px-2 py-1 rounded text-sm">
                Copied!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 