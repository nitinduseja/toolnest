import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BoxShadowGeneratorTool } from './index';

describe('BoxShadowGeneratorTool', () => {
  it('renders initial elevation and preview card', () => {
    render(<BoxShadowGeneratorTool />);
    expect(screen.getByText('CSS Box Shadow & Glow Generator')).toBeInTheDocument();
    expect(screen.getByTestId('shadow-preview-box')).toBeInTheDocument();
    expect(screen.getByText(/Shadow Layers \(2\)/i)).toBeInTheDocument();
  });

  it('updates shadow when preset is selected', () => {
    render(<BoxShadowGeneratorTool />);

    const neonBtn = screen.getByRole('button', { name: /Neon Cyberpunk/i });
    fireEvent.click(neonBtn);

    const preview = screen.getByTestId('shadow-preview-box');
    expect(preview.style.boxShadow).toContain('rgba(0, 229, 255');
  });

  it('allows adding and removing shadow layers', () => {
    render(<BoxShadowGeneratorTool />);

    const addBtn = screen.getByRole('button', { name: /Add Layer/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Shadow Layers \(3\)/i)).toBeInTheDocument();
  });

  it('switches export format between CSS and Tailwind', () => {
    render(<BoxShadowGeneratorTool />);

    const tailwindTab = screen.getByRole('button', { name: 'Tailwind' });
    fireEvent.click(tailwindTab);

    expect(screen.getByText(/shadow-\[/i)).toBeInTheDocument();

    const cssVarTab = screen.getByRole('button', { name: 'CSS Variables' });
    fireEvent.click(cssVarTab);

    expect(screen.getByText(/--custom-box-shadow:/i)).toBeInTheDocument();
  });
});
