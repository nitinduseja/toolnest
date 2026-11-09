import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DnsLookup } from './index';

describe('DnsLookup Component', () => {
  const mockDnsResponse = {
    Status: 0,
    TC: false,
    RD: true,
    RA: true,
    AD: false,
    CD: false,
    Question: [{ name: 'github.com.', type: 1 }],
    Answer: [{ name: 'github.com.', type: 1, TTL: 60, data: '140.82.121.4' }],
  };

  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(mockDnsResponse),
    } as unknown as Response);
  });

  it('renders header, input, and default records table', async () => {
    render(<DnsLookup />);
    expect(screen.getByText(/DNS over HTTPS \(DoH\) Inspector/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('140.82.121.4')).toBeInTheDocument();
    });
  });

  it('switches record type to MX and queries DoH', async () => {
    render(<DnsLookup />);
    const mxBtn = screen.getByRole('button', { name: 'MX' });
    fireEvent.click(mxBtn);
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  it('switches DNS provider to Google', async () => {
    render(<DnsLookup />);
    const providerSelect = screen.getByLabelText(/DNS Provider/i);
    fireEvent.change(providerSelect, { target: { value: 'google' } });
    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });
  });

  it('switches view mode to raw JSON', async () => {
    render(<DnsLookup />);
    await waitFor(() => {
      expect(screen.getByText('140.82.121.4')).toBeInTheDocument();
    });
    const jsonBtn = screen.getByRole('button', { name: /Raw JSON/i });
    fireEvent.click(jsonBtn);
    expect(screen.getByText(/"Status": 0/i)).toBeInTheDocument();
  });

  it('allows copying answer data', async () => {
    render(<DnsLookup />);
    await waitFor(() => {
      expect(screen.getByText('140.82.121.4')).toBeInTheDocument();
    });
    const copyBtn = screen.getByRole('button', { name: /Copy/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('140.82.121.4');
  });

  it('handles query failures gracefully', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error('Network error')
    );
    render(<DnsLookup />);
    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
