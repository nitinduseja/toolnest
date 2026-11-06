import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ChmodCalculatorTool } from './index';

describe('ChmodCalculator Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders the header, octal input, and symbolic input with defaults (755)', () => {
    render(<ChmodCalculatorTool />);

    expect(screen.getByText('Chmod / Linux Permissions Calculator')).toBeInTheDocument();
    expect(screen.getByDisplayValue('755')).toBeInTheDocument();
    expect(screen.getByDisplayValue('-rwxr-xr-x')).toBeInTheDocument();
  });

  it('updates octal and symbolic string when permission matrix checkbox is toggled', () => {
    render(<ChmodCalculatorTool />);

    // Toggle Owner Write off (Owner: 7 -> 5)
    // Find checkboxes for write
    const writeCheckboxes = screen.getAllByRole('checkbox');
    // Owner is first, action 0 is read, 1 is write, 2 is execute
    fireEvent.click(writeCheckboxes[1]);

    // Octal should now be 555
    expect(screen.getByDisplayValue('555')).toBeInTheDocument();
    expect(screen.getByDisplayValue('-r-xr-xr-x')).toBeInTheDocument();
  });

  it('updates state when typing a valid octal code in the input', () => {
    render(<ChmodCalculatorTool />);

    const octalInput = screen.getByDisplayValue('755');
    fireEvent.change(octalInput, { target: { value: '644' } });

    expect(screen.getByDisplayValue('644')).toBeInTheDocument();
    expect(screen.getByDisplayValue('-rw-r--r--')).toBeInTheDocument();
  });

  it('applies preset when a preset button is clicked', () => {
    render(<ChmodCalculatorTool />);

    const preset600 = screen.getByText('Private File / SSH Key');
    fireEvent.click(preset600);

    expect(screen.getByDisplayValue('600')).toBeInTheDocument();
    expect(screen.getByDisplayValue('-rw-------')).toBeInTheDocument();
  });

  it('copies commands to clipboard when copy button is clicked', () => {
    render(<ChmodCalculatorTool />);

    const copyButtons = screen.getAllByTitle('Copy command');
    expect(copyButtons.length).toBeGreaterThan(0);

    fireEvent.click(copyButtons[0]);
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
