import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ColorPaletteTool } from './index';

describe('ColorPaletteTool Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders the header and default Image tab with upload zone', () => {
    render(<ColorPaletteTool />);

    expect(screen.getByText('Color Palette & Contrast Studio')).toBeInTheDocument();
    expect(screen.getByText('Upload or drag an image here')).toBeInTheDocument();
  });

  it('switches between Image and Harmonies tabs', () => {
    render(<ColorPaletteTool />);

    const harmoniesTab = screen.getByRole('button', { name: /harmonies/i });
    fireEvent.click(harmoniesTab);

    expect(screen.getAllByText('Base Color').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Triadic')).toBeInTheDocument();
    expect(screen.getByText('Complementary')).toBeInTheDocument();
  });

  it('applies sample presets and renders extracted swatches', () => {
    render(<ColorPaletteTool />);

    const sampleButton = screen.getByText('Sunset Glow');
    fireEvent.click(sampleButton);

    // Should display swatches
    const hexCodes = screen.getAllByText(/^#[0-9A-F]{6}$/i);
    expect(hexCodes.length).toBeGreaterThan(0);
  });

  it('opens and closes export modal', () => {
    render(<ColorPaletteTool />);

    const exportBtn = screen.getByRole('button', { name: /export/i });
    fireEvent.click(exportBtn);

    expect(screen.getByText('Export Color Palette')).toBeInTheDocument();
    expect(screen.getByText('Download SVG')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /close export modal/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByText('Export Color Palette')).not.toBeInTheDocument();
  });
});
