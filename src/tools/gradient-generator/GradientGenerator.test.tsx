import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GradientGenerator } from './index';

describe('GradientGenerator Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders header title and presets', () => {
    render(<GradientGenerator />);
    expect(screen.getByText('CSS Gradient & Mesh Studio')).toBeInTheDocument();
    expect(screen.getByText('Sunset Vibes')).toBeInTheDocument();
    expect(screen.getByText('Cyberpunk Neon')).toBeInTheDocument();
  });

  it('switches gradient type to radial and updates controls', () => {
    render(<GradientGenerator />);
    const radialBtn = screen.getByRole('button', { name: /radial/i });
    fireEvent.click(radialBtn);
    expect(screen.getByText('Radial Shape')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /circle/i })).toBeInTheDocument();
  });

  it('switches gradient type to conic', () => {
    render(<GradientGenerator />);
    const conicBtn = screen.getByRole('button', { name: /conic/i });
    fireEvent.click(conicBtn);
    expect(screen.getByLabelText(/Angle/i)).toBeInTheDocument();
  });

  it('allows adding a new color stop', () => {
    render(<GradientGenerator />);
    const addBtn = screen.getByText('+ Add Color Stop');
    fireEvent.click(addBtn);
    expect(screen.getByText('Color Stops (3/8)')).toBeInTheDocument();
  });

  it('selects preset gradient and updates style', () => {
    render(<GradientGenerator />);
    const sunsetBtn = screen.getByText('Sunset Vibes');
    fireEvent.click(sunsetBtn);
    const canvas = screen.getByTestId('gradient-canvas');
    expect(canvas.style.background).toContain('linear-gradient');
  });

  it('switches code formats and triggers copy', async () => {
    render(<GradientGenerator />);
    const twBtn = screen.getByRole('button', { name: /tailwind/i });
    fireEvent.click(twBtn);
    expect(screen.getByText(/bg-\[linear-gradient/i)).toBeInTheDocument();

    const copyBtn = screen.getByRole('button', { name: /Copy Code/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
