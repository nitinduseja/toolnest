import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from './ThemeProvider';

describe('ThemeToggle Component', () => {
  it('renders theme button and opens menu on click', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByRole('menuitem', { name: /light/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /dark/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /system/i })).toBeInTheDocument();
  });

  it('selects light theme when clicking light mode option', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    const lightOption = screen.getByRole('menuitem', { name: /light/i });
    fireEvent.click(lightOption);

    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('selects dark theme and updates accessibility label', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    const darkOption = screen.getByRole('menuitem', { name: /dark/i });
    fireEvent.click(darkOption);

    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(screen.getByRole('button', { name: /current theme: dark/i })).toBeInTheDocument();
  });

  it('selects system theme and displays system monitor icon', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);

    const systemOption = screen.getByRole('menuitem', { name: /system/i });
    fireEvent.click(systemOption);

    expect(screen.getByRole('button', { name: /current theme: system/i })).toBeInTheDocument();
  });

  it('closes theme menu when Escape key is pressed', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );

    const button = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(button);
    expect(screen.getByRole('menu', { name: /theme options/i })).toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('menu', { name: /theme options/i }), { key: 'Escape' });
    expect(screen.queryByRole('menu', { name: /theme options/i })).not.toBeInTheDocument();
  });
});
