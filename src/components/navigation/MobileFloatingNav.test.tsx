import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MobileFloatingNav } from './MobileFloatingNav';

describe('MobileFloatingNav Component', () => {
  it('renders Home, Explore, Categories, elevated Search, and More button', () => {
    render(
      <MemoryRouter>
        <MobileFloatingNav onOpenCommandPalette={() => {}} onOpenCategories={() => {}} />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();
    expect(screen.getByLabelText(/Search tools with command palette/i)).toBeInTheDocument();
  });

  it('triggers onOpenCommandPalette when clicking elevated Search button', () => {
    const handleOpenCommandPalette = vi.fn();
    render(
      <MemoryRouter>
        <MobileFloatingNav
          onOpenCommandPalette={handleOpenCommandPalette}
          onOpenCategories={() => {}}
        />
      </MemoryRouter>
    );

    const searchBtn = screen.getByLabelText(/Search tools with command palette/i);
    fireEvent.click(searchBtn);
    expect(handleOpenCommandPalette).toHaveBeenCalledTimes(1);
  });

  it('toggles More popover menu displaying Favorites and Recent links', () => {
    render(
      <MemoryRouter>
        <MobileFloatingNav onOpenCommandPalette={() => {}} onOpenCategories={() => {}} />
      </MemoryRouter>
    );

    const moreBtn = screen.getByLabelText(/More navigation options/i);
    expect(screen.queryByText('Recent Tools')).not.toBeInTheDocument();

    // Click to open popover
    fireEvent.click(moreBtn);
    expect(screen.getByText('Quick Library')).toBeInTheDocument();
    expect(screen.getByText('Favorites')).toBeInTheDocument();
    expect(screen.getByText('Recent Tools')).toBeInTheDocument();

    // Press Escape to close popover
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByText('Quick Library')).not.toBeInTheDocument();
  });

  it('is consistently fixed to the bottom of the screen on mobile viewports', () => {
    render(
      <MemoryRouter>
        <MobileFloatingNav onOpenCommandPalette={() => {}} onOpenCategories={() => {}} />
      </MemoryRouter>
    );

    const nav = screen.getByRole('navigation', { name: /Mobile bottom navigation dock/i });
    expect(nav).toHaveClass('fixed');
    expect(nav).toHaveClass('bottom-4');
    expect(nav).not.toHaveClass('relative');
  });
});
