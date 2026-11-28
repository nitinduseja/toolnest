import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { JsonYamlDiffTool } from './index';

describe('JsonYamlDiff Component', () => {
  it('renders structural diff badges and summary from sample JSON vs YAML', () => {
    render(<JsonYamlDiffTool />);
    expect(screen.getByText(/Structural Changes/)).toBeInTheDocument();
    expect(screen.getByText(/\+\d+ Added/)).toBeInTheDocument();
    expect(screen.getByText(/-\d+ Removed/)).toBeInTheDocument();
  });

  it('toggles between structural diff table and RFC 6902 JSON Patch view', () => {
    render(<JsonYamlDiffTool />);
    fireEvent.click(screen.getByText('RFC 6902 Patch'));
    expect(screen.getByText('RFC 6902 JSON Patch')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Show Diff List'));
    expect(screen.getAllByText('Original (Left)').length).toBeGreaterThan(0);
  });

  it('swaps left and right panes cleanly', () => {
    render(<JsonYamlDiffTool />);
    const textareas = screen.getAllByRole('textbox');
    const initialLeft = (textareas[0] as HTMLTextAreaElement).value;
    const initialRight = (textareas[1] as HTMLTextAreaElement).value;

    fireEvent.click(screen.getByText('Swap Panes'));
    expect((textareas[0] as HTMLTextAreaElement).value).toBe(initialRight);
    expect((textareas[1] as HTMLTextAreaElement).value).toBe(initialLeft);
  });

  it('shows syntax error notice when malformed JSON is entered', () => {
    render(<JsonYamlDiffTool />);
    const leftArea = screen.getAllByRole('textbox')[0];
    fireEvent.change(leftArea, { target: { value: '{ bad json' } });
    expect(screen.getByText(/Left syntax error:/)).toBeInTheDocument();
  });
});
