import { describe, it, expect } from 'vitest';

import { render, screen, fireEvent } from '@testing-library/react';

import { CodeToImage } from './index';

describe('CodeToImage Component', () => {
  it('renders header and curated presets', () => {
    render(<CodeToImage />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /Code Screenshot & Card Studio/i,
      })
    ).toBeInTheDocument();

    expect(screen.getByText(/Modern Mac \(Dracula\)/i)).toBeInTheDocument();

    expect(screen.getByText(/Clean Minimalist \(Nord\)/i)).toBeInTheDocument();
  });

  it('renders SVG canvas and initial sample code', () => {
    render(<CodeToImage />);

    const canvas = screen.getByTestId('code-card-canvas');

    expect(canvas).toBeInTheDocument();
    expect(canvas.innerHTML).toContain('<svg');
    expect(canvas.innerHTML).toContain('handler.ts');
  });

  it('updates title and reflects it in SVG', () => {
    render(<CodeToImage />);

    const titleInput = screen.getByLabelText(/Window Title \/ File/i);

    fireEvent.change(titleInput, {
      target: { value: 'custom_api.py' },
    });

    const canvas = screen.getByTestId('code-card-canvas');

    expect(canvas.innerHTML).toContain('custom_api.py');
  });

  it('updates programming language', () => {
    render(<CodeToImage />);

    const languageSelect = screen.getByLabelText(/Language/i);

    fireEvent.change(languageSelect, {
      target: { value: 'python' },
    });

    expect(languageSelect).toHaveValue('python');
  });

  it('switches syntax theme', () => {
    render(<CodeToImage />);

    fireEvent.click(screen.getByRole('button', { name: 'Nord' }));

    const canvas = screen.getByTestId('code-card-canvas');

    expect(canvas.innerHTML).toContain('#2e3440');
  });

  it('switches window style to Windows', () => {
    render(<CodeToImage />);

    fireEvent.click(screen.getByRole('button', { name: 'Windows' }));

    const canvas = screen.getByTestId('code-card-canvas');

    expect(canvas.innerHTML).not.toContain('circle cx="20" cy="18"');
  });

  it('applies curated preset', () => {
    render(<CodeToImage />);

    fireEvent.click(screen.getByText(/Clean Minimalist \(Nord\)/i));

    const canvas = screen.getByTestId('code-card-canvas');

    expect(canvas.innerHTML).toContain('#2e3440');
  });

  it('preserves title when applying a preset', () => {
    render(<CodeToImage />);

    const titleInput = screen.getByLabelText(/Window Title \/ File/i);

    fireEvent.change(titleInput, {
      target: { value: 'my-custom-file.ts' },
    });

    fireEvent.click(screen.getByText(/Clean Minimalist \(Nord\)/i));

    expect(titleInput).toHaveValue('my-custom-file.ts');

    const canvas = screen.getByTestId('code-card-canvas');

    expect(canvas.innerHTML).toContain('my-custom-file.ts');
  });

  it('preserves code when applying a preset', () => {
    render(<CodeToImage />);

    const codeInput = screen.getByLabelText('Code Snippet');

    fireEvent.change(codeInput, {
      target: { value: 'const customValue = 123;' },
    });

    fireEvent.click(screen.getByText(/Clean Minimalist \(Nord\)/i));

    expect(codeInput).toHaveValue('const customValue = 123;');
  });
});
