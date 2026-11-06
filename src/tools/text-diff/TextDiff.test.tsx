import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextDiffTool } from './index';

describe('TextDiffTool Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders side-by-side view, sample text, and toolbar controls', () => {
    render(<TextDiffTool />);

    expect(screen.getByRole('button', { name: /side-by-side/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /unified/i })).toBeInTheDocument();
    expect(screen.getByText('Original Version')).toBeInTheDocument();
    expect(screen.getByText('Modified Version')).toBeInTheDocument();
  });

  it('swaps original and modified texts when swap button is clicked', () => {
    render(<TextDiffTool />);

    const swapBtn = screen.getByTitle('Swap Original and Modified texts');
    const originalTextarea = screen.getByPlaceholderText(/Paste original source text/i);
    const modifiedTextarea = screen.getByPlaceholderText(/Paste modified source text/i);

    const origVal = (originalTextarea as HTMLTextAreaElement).value;
    const modVal = (modifiedTextarea as HTMLTextAreaElement).value;

    fireEvent.click(swapBtn);

    expect((originalTextarea as HTMLTextAreaElement).value).toBe(modVal);
    expect((modifiedTextarea as HTMLTextAreaElement).value).toBe(origVal);
  });

  it('toggles between side-by-side and unified views', () => {
    render(<TextDiffTool />);

    const unifiedBtn = screen.getByRole('button', { name: /unified/i });
    fireEvent.click(unifiedBtn);

    expect(screen.getByText(/Diff Output \(Unified\)/i)).toBeInTheDocument();
  });

  it('clears both inputs when clear button is clicked', () => {
    render(<TextDiffTool />);

    const clearBtn = screen.getByTitle('Clear Both');
    fireEvent.click(clearBtn);

    const originalTextarea = screen.getByPlaceholderText(/Paste original source text/i);
    const modifiedTextarea = screen.getByPlaceholderText(/Paste modified source text/i);

    expect((originalTextarea as HTMLTextAreaElement).value).toBe('');
    expect((modifiedTextarea as HTMLTextAreaElement).value).toBe('');
  });
});
