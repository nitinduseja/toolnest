import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarkdownExporter } from './index';

describe('MarkdownExporter Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    vi.spyOn(window, 'open').mockReturnValue({
      document: {
        open: vi.fn(),
        write: vi.fn(),
        close: vi.fn(),
      },
      focus: vi.fn(),
      print: vi.fn(),
    } as unknown as Window);
  });

  it('renders header title and initial preview iframe', () => {
    render(<MarkdownExporter />);
    expect(screen.getByText(/Markdown to PDF & Printable HTML Exporter/i)).toBeInTheDocument();
    expect(screen.getByTitle('Print Document Preview')).toBeInTheDocument();
  });

  it('updates document metadata title and author', () => {
    render(<MarkdownExporter />);
    const titleInput = screen.getByDisplayValue('RFC 2048: Real-Time Event Bus Architecture');
    fireEvent.change(titleInput, { target: { value: 'Updated RFC Title' } });
    expect(screen.getByDisplayValue('Updated RFC Title')).toBeInTheDocument();
  });

  it('switches export theme to Academic', () => {
    render(<MarkdownExporter />);
    const themeSelect = screen.getByDisplayValue('Modern Sans');
    fireEvent.change(themeSelect, { target: { value: 'academic' } });
    expect(screen.getAllByText(/academic/i).length).toBeGreaterThan(0);
  });

  it('loads service statement preset on click', () => {
    render(<MarkdownExporter />);
    const presetBtn = screen.getByText('Formal Service Statement');
    fireEvent.click(presetBtn);
    expect(screen.getByDisplayValue(/# Statement of Work & Invoice/i)).toBeInTheDocument();
  });

  it('copies full printable HTML', async () => {
    render(<MarkdownExporter />);
    const copyBtn = screen.getByRole('button', { name: /Copy HTML/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });

  it('triggers browser print window', () => {
    render(<MarkdownExporter />);
    const printBtn = screen.getByRole('button', { name: /Print \/ Save PDF/i });
    fireEvent.click(printBtn);
    expect(window.open).toHaveBeenCalled();
  });
});
