import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { WebhookTesterTool } from './index';

describe('WebhookTester Component', () => {
  it('renders provider templates and computes HMAC signature headers', async () => {
    render(<WebhookTesterTool />);
    expect(screen.getByText('Webhook Payload Generator & Signer')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('X-Hub-Signature-256')).toBeInTheDocument();
    });
    expect(screen.getByText(/curl -X POST/)).toBeInTheDocument();
  });

  it('switches template event to Stripe and updates header format', async () => {
    render(<WebhookTesterTool />);
    fireEvent.click(screen.getByText('Stripe: payment_intent.succeeded'));

    await waitFor(() => {
      expect(screen.getByText('Stripe-Signature')).toBeInTheDocument();
    });
  });

  it('toggles webhook secret visibility and copies cURL snippet', async () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<WebhookTesterTool />);

    await waitFor(() => {
      expect(screen.getByText('Copy cURL')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByText('Hide')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Copy cURL'));
    await screen.findByText('Copied');
    expect(writeText).toHaveBeenCalled();
  });
});
