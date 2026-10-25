import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ToolCard } from './ToolCard';
import { ALL_TOOLS } from '@/registry/tool-registry';

describe('ToolCard Component', () => {
  const sampleTool = ALL_TOOLS[0]; // JSON Formatter

  it('renders tool title, description, and category badge', () => {
    render(
      <MemoryRouter>
        <ToolCard tool={sampleTool} />
      </MemoryRouter>
    );

    expect(screen.getByText(sampleTool.name)).toBeInTheDocument();
    expect(screen.getByText(sampleTool.description)).toBeInTheDocument();
  });

  it('toggles favorite button on click', () => {
    render(
      <MemoryRouter>
        <ToolCard tool={sampleTool} />
      </MemoryRouter>
    );

    const favButton = screen.getByRole('button', {
      name: new RegExp(`add ${sampleTool.name} to favorites`, 'i'),
    });
    fireEvent.click(favButton);

    expect(
      screen.getByRole('button', {
        name: new RegExp(`remove ${sampleTool.name} from favorites`, 'i'),
      })
    ).toBeInTheDocument();
  });
});
