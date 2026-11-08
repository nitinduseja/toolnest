import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CssLayoutBuilderTool } from './index';

describe('CssLayoutBuilderTool', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders default tool title, controls, and canvas', () => {
    render(<CssLayoutBuilderTool />);
    expect(screen.getByText('CSS Flexbox & Grid Playground')).toBeInTheDocument();
    expect(screen.getByTestId('layout-container')).toBeInTheDocument();
    expect(screen.getByText(/Canvas \(4 items\)/i)).toBeInTheDocument();
  });

  it('toggles between Flexbox and CSS Grid modes', () => {
    render(<CssLayoutBuilderTool />);

    const gridBtn = screen.getByRole('button', { name: 'CSS Grid' });
    fireEvent.click(gridBtn);

    expect(screen.getByText('Columns (grid-cols)')).toBeInTheDocument();

    const flexBtn = screen.getByRole('button', { name: 'Flexbox' });
    fireEvent.click(flexBtn);

    expect(screen.getByText('flex-direction')).toBeInTheDocument();
  });

  it('adds and removes canvas items', () => {
    render(<CssLayoutBuilderTool />);

    const addBtn = screen.getByRole('button', { name: /Add Item/i });
    fireEvent.click(addBtn);

    expect(screen.getByText(/Canvas \(5 items\)/i)).toBeInTheDocument();

    const removeBtn = screen.getByTitle('Remove item');
    fireEvent.click(removeBtn);

    expect(screen.getByText(/Canvas \(4 items\)/i)).toBeInTheDocument();
  });

  it('switches code tabs between CSS and Tailwind', () => {
    render(<CssLayoutBuilderTool />);

    const tailwindTab = screen.getByRole('button', { name: 'Tailwind' });
    fireEvent.click(tailwindTab);

    expect(screen.getByText(/flex flex-row/i)).toBeInTheDocument();
  });
});
