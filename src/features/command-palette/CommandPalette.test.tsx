import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CommandPalette } from './CommandPalette';
import { ThemeProvider } from '@/features/theme/ThemeProvider';

describe('CommandPalette Keyboard Navigation', () => {
  it('focuses input, navigates with ArrowDown and ArrowUp, and highlights selection', async () => {
    const handleOpenChange = vi.fn();
    render(
      <MemoryRouter>
        <ThemeProvider>
          <CommandPalette open={true} onOpenChange={handleOpenChange} />
        </ThemeProvider>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Type to search...');
    expect(input).toBeInTheDocument();

    const items = screen.getAllByRole('option');
    expect(items.length).toBeGreaterThan(1);

    // Initial selected item is the first item
    expect(items[0]).toHaveAttribute('aria-selected', 'true');
    expect(items[0]).toHaveClass('aria-selected:bg-primary-container');

    // Press ArrowDown to move to second item
    fireEvent.keyDown(input, { key: 'ArrowDown', code: 'ArrowDown' });
    expect(items[1]).toHaveAttribute('aria-selected', 'true');
    expect(items[0]).toHaveAttribute('aria-selected', 'false');

    // Press ArrowUp to move back to first item
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(items[0]).toHaveAttribute('aria-selected', 'true');

    // Press ArrowUp to wrap around to last item (due to loop={true})
    fireEvent.keyDown(input, { key: 'ArrowUp', code: 'ArrowUp' });
    expect(items[items.length - 1]).toHaveAttribute('aria-selected', 'true');
  });

  it('filters results when typing and maintains keyboard navigation', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <CommandPalette open={true} onOpenChange={() => {}} />
        </ThemeProvider>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Type to search...');
    fireEvent.change(input, { target: { value: 'uuid' } });

    const filteredItems = screen.getAllByRole('option');
    expect(filteredItems.some((el) => el.textContent?.includes('UUID Generator'))).toBe(true);

    // First filtered item is selected
    expect(filteredItems[0]).toHaveAttribute('aria-selected', 'true');
  });
});
