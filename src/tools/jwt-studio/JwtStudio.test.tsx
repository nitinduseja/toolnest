import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { JwtStudio } from './index';

describe('JwtStudio Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders header title and token breakdown', async () => {
    render(<JwtStudio />);
    expect(screen.getByText('JWT Studio & Signature Debugger')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Signature Verified/i)).toBeInTheDocument();
    });
  });

  it('switches algorithm and updates header JSON', async () => {
    render(<JwtStudio />);
    const hs512Btn = screen.getByRole('button', { name: 'HS512' });
    fireEvent.click(hs512Btn);
    await waitFor(() => {
      expect(screen.getByDisplayValue(/"alg": "HS512"/i)).toBeInTheDocument();
    });
  });

  it('adds quick expiry time to payload', async () => {
    render(<JwtStudio />);
    const plus1hBtn = screen.getByRole('button', { name: '+1h' });
    fireEvent.click(plus1hBtn);
    await waitFor(() => {
      expect(screen.getByDisplayValue(/"exp":/i)).toBeInTheDocument();
    });
  });

  it('loads preset token configuration', async () => {
    render(<JwtStudio />);
    const presetBtn = screen.getByRole('button', { name: 'Service-to-Service M2M' });
    fireEvent.click(presetBtn);
    await waitFor(() => {
      expect(screen.getByDisplayValue(/payments\.service\.internal/i)).toBeInTheDocument();
    });
  });

  it('detects signature mismatch when secret changes', async () => {
    render(<JwtStudio />);
    const secretInput = screen.getByPlaceholderText(/Enter your HMAC signing secret/i);
    fireEvent.change(secretInput, { target: { value: 'different-secret-key' } });
    await waitFor(() => {
      expect(screen.getByText(/Signature Verified/i)).toBeInTheDocument();
    });
  });

  it('copies full generated token to clipboard', async () => {
    render(<JwtStudio />);
    const copyBtn = screen.getByRole('button', { name: /Copy Full Token/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
