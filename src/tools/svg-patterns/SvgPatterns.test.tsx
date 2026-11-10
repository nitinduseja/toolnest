import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SvgPatterns } from './index';

describe('SvgPatterns Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders header title and curated presets', () => {
    render(<SvgPatterns />);
    expect(screen.getByText('SVG Pattern & Background Generator')).toBeInTheDocument();
    expect(screen.getByText('Blueprint Grid')).toBeInTheDocument();
    expect(screen.getByText('Cyberpunk PCB')).toBeInTheDocument();
  });

  it('switches pattern type and updates canvas style', () => {
    render(<SvgPatterns />);
    const gridBtn = screen.getByRole('button', { name: 'Grid' });
    fireEvent.click(gridBtn);
    const canvas = screen.getByTestId('pattern-canvas');
    expect(canvas.style.backgroundImage).toContain('data:image/svg+xml');
  });

  it('toggles preview card overlay', () => {
    render(<SvgPatterns />);
    expect(screen.getByText('Live Preview Overlay')).toBeInTheDocument();
    const toggleBtn = screen.getByRole('button', { name: 'Hide Overlay' });
    fireEvent.click(toggleBtn);
    expect(screen.queryByText('Live Preview Overlay')).not.toBeInTheDocument();
  });

  it('loads preset on button click', () => {
    render(<SvgPatterns />);
    const presetBtn = screen.getByText('Honeycomb Hive');
    fireEvent.click(presetBtn);
    const canvas = screen.getByTestId('pattern-canvas');
    expect(canvas.style.backgroundColor).toBe('rgb(69, 26, 3)');
  });

  it('copies generated CSS background code', async () => {
    render(<SvgPatterns />);
    const copyBtn = screen.getByRole('button', { name: /Copy Code/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('switches export tabs to Tailwind arbitrary class', () => {
    render(<SvgPatterns />);
    const twBtn = screen.getByRole('button', { name: /tailwind/i });
    fireEvent.click(twBtn);
    expect(screen.getByText(/bg-\[url\(/i)).toBeInTheDocument();
  });
});
