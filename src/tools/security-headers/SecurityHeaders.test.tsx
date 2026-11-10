import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SecurityHeaders } from './index';

describe('SecurityHeaders Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders header title and security score badge', () => {
    render(<SecurityHeaders />);
    expect(screen.getByText('Security Headers & CSP Builder')).toBeInTheDocument();
    expect(screen.getByText(/Security Score:/i)).toBeInTheDocument();
  });

  it('switches server target snippet to Apache', () => {
    render(<SecurityHeaders />);
    const apacheBtn = screen.getByRole('button', { name: /apache/i });
    fireEvent.click(apacheBtn);
    expect(screen.getByText(/Header always set/i)).toBeInTheDocument();
  });

  it('switches server target snippet to Netlify', () => {
    render(<SecurityHeaders />);
    const netlifyBtn = screen.getByRole('button', { name: /netlify/i });
    fireEvent.click(netlifyBtn);
    expect(screen.getByText(/\/\*/i)).toBeInTheDocument();
  });

  it('changes frame protection to SAMEORIGIN', () => {
    render(<SecurityHeaders />);
    const sameOriginBtn = screen.getByRole('button', { name: 'SAMEORIGIN' });
    fireEvent.click(sameOriginBtn);
    expect(screen.getAllByText(/SAMEORIGIN/i).length).toBeGreaterThan(0);
  });

  it('loads strict production preset and renders A+ grade', () => {
    render(<SecurityHeaders />);
    const strictBtn = screen.getByRole('button', { name: /Strict Production/i });
    fireEvent.click(strictBtn);
    expect(screen.getByText('A+')).toBeInTheDocument();
  });

  it('copies generated server snippet to clipboard', async () => {
    render(<SecurityHeaders />);
    const copyBtn = screen.getByRole('button', { name: /Copy Config/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
