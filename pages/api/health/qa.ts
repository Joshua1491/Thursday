import type { NextApiRequest, NextApiResponse } from 'next';

type QaResponse = {
  answer: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<QaResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: 'Question is required' } as any);
    }

    // TODO: Replace with actual GPT API call
    // This is a mock response for demonstration
    const mockResponse: QaResponse = {
      answer: `I understand you're asking about "${question}". While I can provide general information, please remember that this is not medical advice. 

For accurate medical guidance, I recommend:
1. Consulting with your healthcare provider
2. Getting a proper medical evaluation
3. Following professional medical recommendations

If this is an emergency, please call emergency services immediately.`,
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('Error processing question:', error);
    res.status(500).json({ message: 'Failed to process question' } as any);
  }
} 