import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenGraphPreviewTool } from './index';

describe('OpenGraphPreviewTool', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders default tool title, form, and previews', () => {
    render(<OpenGraphPreviewTool />);
    expect(screen.getByText('Meta Tags & Open Graph (OG) Previewer')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(/Toolnest — Useful tools. One workspace./i)
    ).toBeInTheDocument();
  });

  it('switches social preview tabs', () => {
    render(<OpenGraphPreviewTool />);

    const googleTab = screen.getByRole('button', { name: 'Google SERP' });
    fireEvent.click(googleTab);
    expect(screen.getByText(/https:\/\/toolnest.dev › .../i)).toBeInTheDocument();

    const discordTab = screen.getByRole('button', { name: 'Discord' });
    fireEvent.click(discordTab);
    expect(screen.getByAltText('Discord Embed')).toBeInTheDocument();
  });

  it('updates title when typed in form input', () => {
    render(<OpenGraphPreviewTool />);

    const titleInput = screen.getByDisplayValue(/Toolnest — Useful tools. One workspace./i);
    fireEvent.change(titleInput, { target: { value: 'My Awesome New Product' } });

    expect(screen.getByDisplayValue('My Awesome New Product')).toBeInTheDocument();
  });

  it('selects preset and updates form and preview', () => {
    render(<OpenGraphPreviewTool />);

    const techPresetBtn = screen.getByRole('button', { name: /Technical Blog Post/i });
    fireEvent.click(techPresetBtn);

    expect(screen.getByDisplayValue(/Demystifying Web Workers/i)).toBeInTheDocument();
  });
});
