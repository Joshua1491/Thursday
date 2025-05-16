import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

type QaResponse = {
  answer: string;
};

async function submitQuestion(question: string): Promise<QaResponse> {
  const response = await fetch('/api/health/qa', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error('Failed to get answer');
  }

  return response.json();
}

export function MedicalQa() {
  const [question, setQuestion] = useState('');
  const [streamingAnswer, setStreamingAnswer] = useState('');

  const { mutate: getAnswer, isLoading } = useMutation({
    mutationFn: submitQuestion,
    onSuccess: (data) => {
      // Simulate streaming response
      const words = data.answer.split(' ');
      let currentIndex = 0;

      const streamInterval = setInterval(() => {
        if (currentIndex < words.length) {
          setStreamingAnswer((prev) => prev + ' ' + words[currentIndex]);
          currentIndex++;
        } else {
          clearInterval(streamInterval);
        }
      }, 100); // Adjust speed as needed
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
      setStreamingAnswer(''); // Reset streaming answer
      getAnswer(question);
    }
  };

  return (
    <div className="space-y-6">
      {/* Disclaimer */}
      <div className="bg-red-50 border border-red-300 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          <strong>Disclaimer:</strong> This is not a substitute for professional medical care. 
          Always consult with qualified healthcare providers for medical advice, diagnosis, or treatment.
        </p>
      </div>

      {/* Question Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-1">
            Your Medical Question
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
            placeholder="Type your question here..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Getting Answer...' : 'Submit Question'}
        </button>
      </form>

      {/* Answer Display */}
      {streamingAnswer && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Answer</h3>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{streamingAnswer}</p>
          </div>
        </div>
      )}
    </div>
  );
} 