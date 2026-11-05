import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { BrandLogo } from './BrandLogo';

describe('BrandLogo Component', () => {
  it('renders standard Toolnest 4-quadrant brand mark matching favicon', () => {
    const { container } = render(<BrandLogo />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox', '0 0 32 32');

    const rects = container.querySelectorAll('rect');
    expect(rects.length).toBe(5); // Background + 4 cells
    expect(rects[0]).toHaveAttribute('fill', '#181A22');
    expect(rects[1]).toHaveAttribute('fill', '#635BFF');
    expect(rects[4]).toHaveAttribute('fill', '#10B981');
  });

  it('accepts custom className and size', () => {
    const { container } = render(<BrandLogo className="custom-logo" size={32} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-logo');
    expect(svg).toHaveAttribute('width', '32');
    expect(svg).toHaveAttribute('height', '32');
  });
});
