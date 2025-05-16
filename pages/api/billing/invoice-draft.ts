import type { NextApiRequest, NextApiResponse } from 'next';

type InvoiceDraftResponse = {
  pdfUrl: string;
  previewUrl: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<InvoiceDraftResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' } as any);
  }

  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' } as any);
    }

    // TODO: Replace with actual invoice generation logic
    // This is a mock response for demonstration
    const mockResponse: InvoiceDraftResponse = {
      pdfUrl: `/api/billing/invoices/${orderId}.pdf`,
      previewUrl: `/api/billing/invoices/${orderId}/preview`,
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.status(200).json(mockResponse);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ message: 'Failed to generate invoice' } as any);
  }
} 