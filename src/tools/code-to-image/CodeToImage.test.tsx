import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CodeToImage } from './index';

describe('CodeToImage Component', () => {
  it('renders header title and curated presets', () => {
    render(<CodeToImage />);
    expect(
      screen.getByRole('heading', { level: 1, name: /Code Screenshot & Card Studio/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Modern Mac \(Dracula\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Clean Minimalist \(Nord\)/i)).toBeInTheDocument();
  });

  it('renders SVG canvas and initial sample code', () => {
    render(<CodeToImage />);
    const canvas = screen.getByTestId('code-card-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.innerHTML).toContain('svg');
    expect(canvas.innerHTML).toContain('handler.ts');
  });

  it('updates title input and reflects in SVG output', () => {
    render(<CodeToImage />);
    const titleInput = screen.getByLabelText(/Window Title \/ File/i);
    fireEvent.change(titleInput, { target: { value: 'custom_api.py' } });

    const canvas = screen.getByTestId('code-card-canvas');
    expect(canvas.innerHTML).toContain('custom_api.py');
  });

  it('switches syntax theme when button is clicked', () => {
    render(<CodeToImage />);
    const nordBtn = screen.getByRole('button', { name: 'Nord' });
    fireEvent.click(nordBtn);

    const canvas = screen.getByTestId('code-card-canvas');
    expect(canvas.innerHTML).toContain('#2e3440'); // Nord background
  });

  it('switches window style to Windows', () => {
    render(<CodeToImage />);
    const winBtn = screen.getByRole('button', { name: 'Windows' });
    fireEvent.click(winBtn);

    const canvas = screen.getByTestId('code-card-canvas');
    expect(canvas.innerHTML).not.toContain('circle cx="20" cy="18"');
  });

  it('applies curated preset configuration', () => {
    render(<CodeToImage />);
    const presetBtn = screen.getByText(/Clean Minimalist \(Nord\)/i);
    fireEvent.click(presetBtn);

    const canvas = screen.getByTestId('code-card-canvas');
    expect(canvas.innerHTML).toContain('#2e3440');
  });
});
