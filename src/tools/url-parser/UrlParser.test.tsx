import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UrlParserTool } from './index';

describe('UrlParser Component', () => {
  it('renders sample URL breakdown and live synchronized banner', () => {
    render(<UrlParserTool />);
    expect(screen.getByText('Live Synchronized URL')).toBeInTheDocument();
    expect(screen.getByDisplayValue(/https?:\/\//)).toBeInTheDocument();
  });

  it('shows error state on malformed URL input and copies reconstructed URL', () => {
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue(undefined);
    render(<UrlParserTool />);

    const input = screen.getByLabelText('Raw Target URL');
    fireEvent.change(input, { target: { value: 'http://[invalid' } });
    expect(screen.getByText(/Invalid URL/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText('Reset'));
    fireEvent.click(screen.getByText('Copy'));
    expect(writeText).toHaveBeenCalled();
  });
});
