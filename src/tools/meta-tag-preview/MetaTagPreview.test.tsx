import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MetaTagPreviewTool } from './index';

describe('MetaTagPreview Component', () => {
  it('renders metadata inputs, character counters, and generated HTML tags', () => {
    render(<MetaTagPreviewTool />);
    expect(screen.getByText('Open Graph & SEO Meta Tag Studio')).toBeInTheDocument();
    expect(screen.getByText(/\/60 chars/)).toBeInTheDocument();
    expect(screen.getByText(/\/160 chars/)).toBeInTheDocument();
    expect(screen.getByText(/<meta property="og:title"/)).toBeInTheDocument();
  });

  it('switches social preview tabs between Google, Twitter / X, LinkedIn, and Discord', () => {
    render(<MetaTagPreviewTool />);
    fireEvent.click(screen.getByText('Twitter / X'));
    expect(screen.getAllByText('toolnest.dev').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('LinkedIn'));
    expect(screen.getAllByText('toolnest.dev').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Discord'));
    expect(screen.getByText('Toolnest')).toBeInTheDocument();
  });

  it('updates preview and copies generated meta HTML', () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<MetaTagPreviewTool />);

    const titleInput = screen.getAllByRole('textbox')[0];
    fireEvent.change(titleInput, { target: { value: 'Custom SEO Landing Page' } });
    expect(screen.getAllByText(/Custom SEO Landing Page/).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Copy Meta Tags'));
    expect(writeText).toHaveBeenCalled();
  });
});
