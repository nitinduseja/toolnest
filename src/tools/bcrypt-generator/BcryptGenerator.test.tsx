import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BcryptGeneratorTool } from './index';

describe('BcryptGeneratorTool', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders default tool title and Hasher view', () => {
    render(<BcryptGeneratorTool />);
    expect(screen.getByText('Bcrypt & Password Hash Studio')).toBeInTheDocument();
    expect(screen.getByText('Generate Bcrypt Hash')).toBeInTheDocument();
  });

  it('generates bcrypt hash on button click', async () => {
    render(<BcryptGeneratorTool />);

    const hashBtn = screen.getByRole('button', { name: /Generate Bcrypt Hash/i });
    fireEvent.click(hashBtn);

    await waitFor(() => {
      expect(screen.getByTestId('bcrypt-hash-output')).toBeInTheDocument();
    });
  });

  it('switches to verifier tab and performs verification', async () => {
    render(<BcryptGeneratorTool />);

    const verifyTabBtn = screen.getByRole('button', { name: /Verify/i });
    fireEvent.click(verifyTabBtn);

    expect(screen.getByText('Candidate Plain Text Password')).toBeInTheDocument();

    const runVerifyBtn = screen.getByRole('button', {
      name: /Verify Password Against Hash/i,
    });
    fireEvent.click(runVerifyBtn);

    await waitFor(() => {
      expect(screen.getByTestId('verify-result-banner')).toBeInTheDocument();
    });
  });

  it('switches to benchmark tab', () => {
    render(<BcryptGeneratorTool />);

    const benchTabBtn = screen.getByRole('button', { name: /Benchmark/i });
    fireEvent.click(benchTabBtn);

    expect(screen.getByText('Cost Factor Performance Benchmark')).toBeInTheDocument();
    expect(screen.getByText('Run Live Benchmark')).toBeInTheDocument();
  });
});
