import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SvgOptimizerTool } from './index';

describe('SvgOptimizer Component', () => {
  it('renders sample SVG, stats bar, and controls cleanly', () => {
    render(
      <MemoryRouter>
        <SvgOptimizerTool />
      </MemoryRouter>
    );

    expect(screen.getByText('SVG Optimizer & Minifier')).toBeInTheDocument();
    expect(screen.getByText('SVG Optimized Successfully')).toBeInTheDocument();
  });

  it('shows validation prompt when cleared and restores sample on click', () => {
    render(
      <MemoryRouter>
        <SvgOptimizerTool />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Clear'));
    expect(
      screen.getByText(/Please provide valid SVG code containing <svg> tags\./)
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText('Sample SVG'));
    expect(screen.getByText('SVG Optimized Successfully')).toBeInTheDocument();
  });
});
