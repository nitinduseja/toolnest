import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SqlToSchema } from './index';

describe('SqlToSchema Component', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  it('renders header and initial generated TypeScript schema', () => {
    render(<SqlToSchema />);
    expect(screen.getByText(/SQL DDL to TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/export interface Users/i)).toBeInTheDocument();
  });

  it('switches schema target to Zod', () => {
    render(<SqlToSchema />);
    const zodBtn = screen.getByRole('button', { name: /zod/i });
    fireEvent.click(zodBtn);
    expect(screen.getByText(/UsersSchema = z.object/i)).toBeInTheDocument();
  });

  it('switches schema target to Prisma', () => {
    render(<SqlToSchema />);
    const prismaBtn = screen.getByRole('button', { name: /prisma/i });
    fireEvent.click(prismaBtn);
    expect(screen.getByText(/model Users/i)).toBeInTheDocument();
  });

  it('handles clearing SQL input to show empty state', () => {
    render(<SqlToSchema />);
    const clearBtn = screen.getByText('Clear');
    fireEvent.click(clearBtn);
    expect(screen.getByText(/No valid CREATE TABLE statements detected/i)).toBeInTheDocument();
  });

  it('loads preset schema on click', () => {
    render(<SqlToSchema />);
    const ecomBtn = screen.getByText('E-commerce Products & Orders');
    fireEvent.click(ecomBtn);
    expect(screen.getByText(/export interface Products/i)).toBeInTheDocument();
  });

  it('copies generated schema code', async () => {
    render(<SqlToSchema />);
    const copyBtn = screen.getByRole('button', { name: /Copy Code/i });
    await act(async () => {
      fireEvent.click(copyBtn);
    });
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
