import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HeroSearchBar } from './HeroSearchBar';

describe('HeroSearchBar Component', () => {
  it('renders search input and quick pick chips', () => {
    const handleOpenCommandPalette = vi.fn();
    render(
      <MemoryRouter>
        <HeroSearchBar onOpenCommandPalette={handleOpenCommandPalette} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search 36\+ tools/i);
    expect(input).toBeInTheDocument();
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.getByText('Regex Tester')).toBeInTheDocument();
  });

  it('displays matching dropdown suggestions when typing', () => {
    render(
      <MemoryRouter>
        <HeroSearchBar onOpenCommandPalette={() => {}} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search 36\+ tools/i);
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'uuid' } });

    expect(screen.getByText('Matching Tools')).toBeInTheDocument();
    expect(screen.getAllByText('UUID Generator').length).toBeGreaterThanOrEqual(1);
  });

  it('clears query when clicking clear button', () => {
    render(
      <MemoryRouter>
        <HeroSearchBar onOpenCommandPalette={() => {}} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Search 36\+ tools/i);
    fireEvent.change(input, { target: { value: 'test' } });
    expect(input).toHaveValue('test');

    const clearBtn = screen.getByLabelText('Clear search input');
    fireEvent.click(clearBtn);
    expect(input).toHaveValue('');
  });

  it('triggers onOpenCommandPalette when submitting an empty search', () => {
    const handleOpenCommandPalette = vi.fn();
    render(
      <MemoryRouter>
        <HeroSearchBar onOpenCommandPalette={handleOpenCommandPalette} />
      </MemoryRouter>
    );

    const searchBtn = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchBtn);
    expect(handleOpenCommandPalette).toHaveBeenCalledTimes(1);
  });
});
